// Renseigne des modèles de courriers de liaison prêts à l'emploi sur la fiche
// documents-professionnels/modele-de-courrier-de-liaison. Idempotent.
const { PrismaClient } = require("@prisma/client");
const { COURRIER_LIAISON } = require("./courrier-liaison-exemples");

const prisma = new PrismaClient();

async function main() {
  const hub = await prisma.hub.findUnique({ where: { slug: "documents-professionnels" } });
  if (!hub) throw new Error("hub documents-professionnels introuvable");

  const fiche = await prisma.fiche.findUnique({
    where: { hubId_slug: { hubId: hub.id, slug: "modele-de-courrier-de-liaison" } },
  });
  if (!fiche) throw new Error("fiche modele-de-courrier-de-liaison introuvable");

  await prisma.fiche.update({ where: { id: fiche.id }, data: { exemple: COURRIER_LIAISON } });
  console.log("Modèles de courrier de liaison ajoutés à la fiche", fiche.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
