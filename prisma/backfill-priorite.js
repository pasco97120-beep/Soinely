// Rétro-remplissage ponctuel du champ Fiche.priorite pour les fiches existantes,
// à partir de la même heuristique que lib/priorite.ts (à exécuter une seule fois
// après l'ajout de la colonne). Les prochaines fiches créées via seed.js reçoivent
// directement une valeur cohérente.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function inferPriorite(text) {
  const t = normalize(text);
  if (/(urgence|urgent|detresse|arret|choc|hemorragie)/.test(t)) return "urgente";
  if (/(risque|attention|vigilance|surveiller|complication)/.test(t)) return "action";
  if (/(verifier|controler|prudence|contre-indication)/.test(t)) return "vigilance";
  return "information";
}

async function main() {
  const fiches = await prisma.fiche.findMany({ select: { id: true, titre: true, resume: true, tags: true } });

  const counts = { information: 0, vigilance: 0, action: 0, urgente: 0 };
  for (const f of fiches) {
    // Volontairement limité à titre/résumé/tags (pas contenu) : le gabarit générique
    // de contenu partage le même texte de sécurité sur toutes les fiches et fausserait le résultat.
    const priorite = inferPriorite(`${f.titre} ${f.resume} ${f.tags}`);
    counts[priorite]++;
    await prisma.fiche.update({ where: { id: f.id }, data: { priorite } });
  }

  console.log(`Mis à jour ${fiches.length} fiches.`);
  console.log(counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
