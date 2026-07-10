// Actualités santé — flux réel Google News RSS (aucune donnée inventée).
// Parseur minimal en regex pour éviter une dépendance XML supplémentaire ;
// le format du flux Google News RSS est stable et simple (title/link/pubDate/source).

export type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
};

const FEED_URL =
  "https://news.google.com/rss/search?q=sant%C3%A9+OR+m%C3%A9dical+OR+infirmier+OR+HAS+OR+minist%C3%A8re+de+la+sant%C3%A9&hl=fr&gl=FR&ceid=FR:fr";

function decodeEntities(str: string) {
  return str
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? decodeEntities(match[1]) : "";
}

export async function getHealthNews(limit = 6): Promise<NewsItem[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();

    return xml
      .split("<item>")
      .slice(1, limit + 1)
      .map((block) => {
        const source = extractTag(block, "source");
        let title = extractTag(block, "title");
        // Google News répète la source en suffixe du titre ("... - Le Monde") ; on l'enlève
        // puisqu'elle est déjà affichée séparément.
        if (source && title.endsWith(` - ${source}`)) {
          title = title.slice(0, -(source.length + 3));
        }
        return { title, link: extractTag(block, "link"), pubDate: extractTag(block, "pubDate"), source };
      })
      .filter((item) => item.title && item.link);
  } catch {
    // Le flux externe ne doit jamais faire planter la page.
    return [];
  }
}
