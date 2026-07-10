import Link from "next/link";
import { Search } from "lucide-react";

const popular = ["Hypoglycémie", "Perfusion", "Escarre", "Insuline", "Tension artérielle", "Gastrostomie"];

export default function SearchSection() {
  return (
    <section className="relative z-10 mx-auto -mt-20 max-w-4xl px-6 sm:-mt-24">
      <div className="rounded-lg border border-border bg-card p-6 shadow-xl sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              De quoi avez-vous besoin <span className="text-primary-600">maintenant</span> ?
            </h2>
            <p className="text-sm text-muted-foreground">
              Trouvez une réponse en moins de 10 secondes parmi les fiches SOINELY.
            </p>
          </div>
        </div>

        <form action="/recherche" method="GET" className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            name="q"
            className="flex-1 rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary-500"
            placeholder="Exemple : glycémie, sonde urinaire bouchée, pansement..."
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Search className="h-4 w-4" />
            Trouver la réponse
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Recherches populaires :</span>
          {popular.map((p) => (
            <Link
              key={p}
              href={`/recherche?q=${encodeURIComponent(p)}`}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary-500 hover:text-primary-600"
            >
              {p}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
