function initials(prenom: string, nom: string) {
  return `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();
}

// Avatar standard : initiales sur fond de marque tant qu'aucune photo n'est envoyée —
// pas de photo générique de personne (identité fabriquée), un motif d'avatar déjà
// familier (Gmail, Slack, GitHub...).
export function Avatar({
  photoUrl,
  prenom,
  nom,
  size = "md",
}: {
  photoUrl?: string | null;
  prenom: string;
  nom: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-14 w-14 text-lg",
    lg: "h-24 w-24 text-2xl",
  }[size];

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`${prenom} ${nom}`}
        className={`shrink-0 rounded-full object-cover ${sizeClasses}`}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-navy-950 font-heading font-bold text-primary-400 ${sizeClasses}`}
    >
      {initials(prenom, nom)}
    </span>
  );
}
