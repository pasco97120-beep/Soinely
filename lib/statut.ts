// Statuts de validation éditoriale — Trust Center™ (Master Book Vol.6 Ch.2).
// Mêmes 4 couleurs que les niveaux de priorité (Design Book Loi n°7), sens différent :
// ici on note la fiabilité du contenu, pas l'urgence clinique.
export const STATUTS_FICHE = {
  valide: { label: "Validé", description: "Conforme au processus éditorial.", dot: "bg-priorite-info" },
  en_revision: { label: "En cours de révision", description: "Contenu non encore relu par un professionnel.", dot: "bg-priorite-vigilance" },
  a_mettre_a_jour: { label: "Mise à jour recommandée", description: "Une évolution des références a été identifiée.", dot: "bg-priorite-action" },
  archive: { label: "Archivé", description: "N'est plus la référence principale.", dot: "bg-priorite-critique" },
} as const;

export type StatutFiche = keyof typeof STATUTS_FICHE;

export function toStatutFiche(raw: string | null | undefined): StatutFiche {
  if (raw && raw in STATUTS_FICHE) return raw as StatutFiche;
  return "en_revision";
}
