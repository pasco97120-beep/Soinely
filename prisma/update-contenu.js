// Mise à jour ponctuelle du champ Fiche.contenu pour les 40 fiches déjà seedées en
// production, remplacement du gabarit générique unique par le contenu spécifique par
// thème défini dans fiches-contenu.js. Idempotent : peut être relancé sans effet de bord,
// suit le même schéma que backfill-priorite.js.
const { PrismaClient } = require("@prisma/client");
const { FICHES_CONTENU } = require("./fiches-contenu");

const prisma = new PrismaClient();

async function main() {
  const fiches = await prisma.fiche.findMany({
    select: { id: true, slug: true, hub: { select: { slug: true } } },
  });

  let updated = 0;
  let skipped = 0;
  for (const f of fiches) {
    const key = `${f.hub.slug}/${f.slug}`;
    const contenu = FICHES_CONTENU[key];
    if (!contenu) {
      skipped++;
      continue;
    }
    await prisma.fiche.update({ where: { id: f.id }, data: { contenu } });
    updated++;
  }

  console.log(`Contenu mis à jour pour ${updated} fiches (${skipped} sans correspondance, gabarit conservé).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
