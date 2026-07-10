export type FicheParcours = {
  objectif: string;
  pointsCles: string[];
  quandAlerter: string[];
  reste: string;
};

const SECTION_HEADERS = ["Objectif", "Points clés", "Quand alerter"] as const;

// Les fiches SOINELY suivent un gabarit stable (Objectif / Points clés / Quand alerter).
// On le découpe pour nourrir le Parcours Clinique Intelligent™ (Comprendre / Réaliser / Sécuriser).
// Si une fiche future s'écarte du gabarit, tout le texte retombe dans `reste` (aucune perte de contenu).
export function parseFicheContenu(contenu: string): FicheParcours {
  const sections: Record<(typeof SECTION_HEADERS)[number], string[]> = {
    Objectif: [],
    "Points clés": [],
    "Quand alerter": [],
  };
  const rest: string[] = [];
  let current: (typeof SECTION_HEADERS)[number] | null = null;
  let matchedAny = false;

  for (const raw of contenu.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if ((SECTION_HEADERS as readonly string[]).includes(line)) {
      current = line as (typeof SECTION_HEADERS)[number];
      matchedAny = true;
      continue;
    }
    if (current) sections[current].push(line.replace(/^[-•]\s*/, ""));
    else rest.push(line);
  }

  return {
    objectif: sections.Objectif.join(" "),
    pointsCles: sections["Points clés"],
    quandAlerter: sections["Quand alerter"],
    reste: matchedAny ? rest.join("\n") : contenu,
  };
}

export type FicheExemple = { titre: string; corps: string };

// Découpe le champ Fiche.exemple (modèles prêts à l'emploi, ex. courriers de liaison) en
// blocs indépendants, chacun introduit par une ligne "## Titre".
export function parseExemples(exemple: string | null | undefined): FicheExemple[] {
  if (!exemple) return [];

  const blocks: FicheExemple[] = [];
  let current: FicheExemple | null = null;

  for (const raw of exemple.split("\n")) {
    if (raw.startsWith("## ")) {
      if (current) blocks.push(current);
      current = { titre: raw.slice(3).trim(), corps: "" };
      continue;
    }
    if (current) current.corps += (current.corps ? "\n" : "") + raw;
  }
  if (current) blocks.push(current);

  return blocks.map((b) => ({ titre: b.titre, corps: b.corps.trim() }));
}
