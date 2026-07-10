import Link from "next/link";
import { getHealthNews } from "@/lib/news";
import { Newspaper, ExternalLink, ArrowLeft } from "lucide-react";

function timeAgo(pubDate: string) {
  const diffMs = Date.now() - new Date(pubDate).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "à l'instant";
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
}

export default async function ActualitesPage() {
  const news = await getHealthNews(20);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/daily"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-900"
      >
        <ArrowLeft className="h-4 w-4" />
        SOINELY Daily
      </Link>

      <div className="mt-4 text-center">
        <p className="flex items-center justify-center gap-1.5 text-sm font-medium uppercase tracking-wide text-primary-600">
          <Newspaper className="h-4 w-4" />
          Actualités santé
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-navy-900">Le fil de l'actualité médicale</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Flux en direct de Google Actualités — filtré sur les sujets santé, médical et infirmier.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-2">
        {news.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Aucune actualité disponible pour le moment. Réessayez dans un instant.
          </p>
        )}
        {news.map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary-500"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-navy-900">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.source}
                {item.pubDate && <> · {timeAgo(item.pubDate)}</>}
              </p>
            </div>
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
}
