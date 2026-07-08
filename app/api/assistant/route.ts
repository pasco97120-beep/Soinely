import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSearch } from "@/lib/utils";

const STOPWORDS = new Set([
  "le", "la", "les", "un", "une", "des", "de", "du", "et", "ou", "que", "qui",
  "est", "en", "au", "aux", "pour", "sur", "avec", "dans", "comment", "quoi",
  "faire", "quand", "je", "j'ai", "mon", "ma", "mes", "il", "elle", "ce", "cette",
]);

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const q = (question ?? "").toString().trim();

  if (!q) {
    return NextResponse.json({ answer: "Posez-moi une question sur un soin, un protocole ou un thème.", sources: [] });
  }

  const words = normalizeSearch(q)
    .split(/[^a-z0-9]+/i)
    .filter((w: string) => w.length > 2 && !STOPWORDS.has(w));

  const fiches = await prisma.fiche.findMany({ include: { hub: true } });

  const scored = fiches
    .map((fiche) => {
      const haystack = normalizeSearch(`${fiche.titre} ${fiche.resume} ${fiche.tags} ${fiche.contenu}`);
      const score = words.reduce((acc: number, w: string) => acc + (haystack.includes(w) ? 1 : 0), 0);
      return { fiche, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) {
    return NextResponse.json({
      answer: `Je n'ai rien trouvé de précis dans SOINELY à propos de « ${q} ». Essayez de reformuler ou parcourez les HUBS thématiques.`,
      sources: [],
    });
  }

  const answer =
    `Voici ce que j'ai retrouvé dans SOINELY à propos de « ${q} » :\n\n` +
    scored.map(({ fiche }) => `- ${fiche.titre} — ${fiche.resume}`).join("\n");

  const sources = scored.map(({ fiche }) => ({
    titre: fiche.titre,
    hub: fiche.hub.nom,
    href: `/hubs/${fiche.hub.slug}/${fiche.slug}`,
  }));

  return NextResponse.json({ answer, sources });
}
