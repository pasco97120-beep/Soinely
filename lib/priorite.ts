import { normalizeSearch } from "@/lib/utils";
import { NIVEAUX_PRIORITE, type NiveauPriorite } from "@/components/Badge";

// Convertit la valeur brute stockée en base (Fiche.priorite) en un niveau valide,
// avec repli défensif si la donnée est absente ou invalide.
export function toNiveauPriorite(raw: string | null | undefined): NiveauPriorite {
  if (raw && raw in NIVEAUX_PRIORITE) return raw as NiveauPriorite;
  return "information";
}

// Heuristique de classement utilisée pour le rétro-remplissage éditorial initial
// (prisma/backfill-priorite.js) et comme repli si aucune donnée n'est disponible.
export function inferPriorite(text: string): NiveauPriorite {
  const t = normalizeSearch(text);
  if (/(urgence|urgent|detresse|arret|choc|hemorragie)/.test(t)) return "urgente";
  if (/(risque|attention|vigilance|surveiller|complication)/.test(t)) return "action";
  if (/(verifier|controler|prudence|contre-indication)/.test(t)) return "vigilance";
  return "information";
}
