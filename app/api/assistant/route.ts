import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSearch } from "@/lib/utils";

const STOPWORDS = new Set([
  "le", "la", "les", "un", "une", "des", "de", "du", "et", "ou", "que", "qui",
  "est", "en", "au", "aux", "pour", "sur", "avec", "dans", "comment", "quoi",
  "faire", "quand", "je", "j'ai", "mon", "ma", "mes", "il", "elle", "ce", "cette",
]);

const GLM_ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

function findRelevantFiches(question: string, fiches: Awaited<ReturnType<typeof getAllFiches>>) {
  const words = normalizeSearch(question)
    .split(/[^a-z0-9]+/i)
    .filter((w: string) => w.length > 2 && !STOPWORDS.has(w));

  return fiches
    .map((fiche) => {
      const haystack = normalizeSearch(`${fiche.titre} ${fiche.resume} ${fiche.tags} ${fiche.contenu}`);
      const score = words.reduce((acc: number, w: string) => acc + (haystack.includes(w) ? 1 : 0), 0);
      return { fiche, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function getAllFiches() {
  return prisma.fiche.findMany({ include: { hub: true } });
}

export async function POST(req: NextRequest) {
  let question: unknown;
  try {
    ({ question } = await req.json());
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const q = (question ?? "").toString().trim();

  if (!q) {
    return NextResponse.json({ answer: "Posez-moi une question sur un soin, un protocole ou un thème.", sources: [] });
  }

  let fiches: Awaited<ReturnType<typeof getAllFiches>>;
  try {
    fiches = await getAllFiches();
  } catch {
    return NextResponse.json({
      answer: "L'assistant est momentanément indisponible (connexion à la base de données). Réessayez dans un instant.",
      sources: [],
    });
  }

  const matches = findRelevantFiches(q, fiches);
  const sources = matches.map(({ fiche }) => ({
    titre: fiche.titre,
    hub: fiche.hub.nom,
    href: `/hubs/${fiche.hub.slug}/${fiche.slug}`,
  }));

  const apiKey = process.env.GLM_API_KEY;
  if (!apiKey) {
    return NextResponse.json(fallbackAnswer(q, matches));
  }

  const context = matches.length
    ? matches
        .map(({ fiche }) => `### ${fiche.titre} (hub: ${fiche.hub.nom})\n${fiche.resume}\n${fiche.contenu}`)
        .join("\n\n")
    : "Aucune fiche SOINELY ne correspond directement à cette question.";

  const systemPrompt =
    "Tu es l'assistant SOINELY, une bibliothèque de ressources pour infirmiers et infirmières libéraux (IDEL). " +
    "Réponds en français, de façon claire et concise, en t'appuyant en priorité sur les fiches SOINELY fournies ci-dessous. " +
    "Si les fiches fournies ne couvrent pas la question, tu peux répondre avec tes connaissances générales, mais précise alors clairement que ce n'est pas issu du contenu SOINELY. " +
    "Pour toute question clinique précise (dosages, seuils, décisions médicales), rappelle que ta réponse est informative et qu'elle doit être validée par un professionnel de santé ou le médecin traitant avant application.";

  const userPrompt = `Fiches SOINELY pertinentes :\n\n${context}\n\nQuestion de l'utilisateur : ${q}`;

  try {
    const res = await fetch(GLM_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GLM_MODEL || "glm-4-plus",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(fallbackAnswer(q, matches));
    }

    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return NextResponse.json(fallbackAnswer(q, matches));
    }

    return NextResponse.json({ answer, sources });
  } catch {
    return NextResponse.json(fallbackAnswer(q, matches));
  }
}

function fallbackAnswer(
  q: string,
  matches: { fiche: { titre: string; resume: string; slug: string; hub: { nom: string; slug: string } } }[]
) {
  const sources = matches.map(({ fiche }) => ({
    titre: fiche.titre,
    hub: fiche.hub.nom,
    href: `/hubs/${fiche.hub.slug}/${fiche.slug}`,
  }));

  if (matches.length === 0) {
    return {
      answer: `Je n'ai rien trouvé de précis dans SOINELY à propos de « ${q} ». Essayez de reformuler ou parcourez les HUBS thématiques.`,
      sources,
    };
  }

  const answer =
    `Voici ce que j'ai retrouvé dans SOINELY à propos de « ${q} » :\n\n` +
    matches.map(({ fiche }) => `- ${fiche.titre} — ${fiche.resume}`).join("\n");

  return { answer, sources };
}
