import { getCollection, type CollectionEntry } from "astro:content";
import { existsSync, statSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

export const researchGroups = [
  {
    slug: "pam-system",
    title: "PAM Systems",
    description: "PAM system design and instrumentation.",
    categories: [
      { slug: "laser-diode-driver", title: "Laser Diode Drivers", description: "Laser diode drivers for photoacoustic imaging." },
      { slug: "system-building", title: "System Construction", description: "Photoacoustic microscopy system construction." },
    ],
  },
  {
    slug: "fundamentals",
    title: "Fundamentals",
    description: "Photoacoustic imaging fundamentals.",
    categories: [
      { slug: "pact", title: "PACT", description: "Photoacoustic computed tomography." },
      { slug: "pam", title: "PAM", description: "Photoacoustic microscopy." },
      { slug: "pame", title: "PAME", description: "PAME research papers and notes." },
    ],
  },
] as const;

export const researchCategories = researchGroups.flatMap((group) => group.categories.map((category) => ({
  ...category,
  groupSlug: group.slug,
  groupTitle: group.title,
  path: `${group.slug}/${category.slug}`,
})));

export function paperCategory(slug: string) {
  const category = researchCategories.find((item) => item.slug === slug);
  if (!category) throw new Error(`Unknown paper category: ${slug}`);
  return category;
}

export function paperUrl(paper: CollectionEntry<"papers">) {
  return `/photoacoustic/${paperCategory(paper.data.category).path}/${paper.data.slug}/`;
}

export function englishUrl(entry: CollectionEntry<"english">) {
  return `/english/${entry.data.slug}/`;
}

function assertUnique<T>(items: T[], key: (item: T) => string, collection: string) {
  const seen = new Set<string>();
  for (const item of items) {
    const value = key(item);
    if (seen.has(value)) throw new Error(`Duplicate public route in ${collection}: ${value}`);
    seen.add(value);
  }
}

export async function publishedPapers() {
  const entries = await getCollection("papers", ({ data }) => data.status === "published");
  assertUnique(entries, paperUrl, "papers");
  const publicDirectory = resolve(process.cwd(), "public");
  for (const entry of entries) {
    const assets = [entry.data.downloads.pdf?.url, entry.data.downloads.notes?.url, ...entry.data.figures.map((figure) => figure.src)];
    for (const url of assets) {
      if (!url?.startsWith("/")) continue;
      const file = resolve(publicDirectory, `.${decodeURIComponent(url)}`);
      const inside = relative(publicDirectory, file);
      if (!inside || inside === ".." || inside.startsWith(`..${sep}`) || !existsSync(file) || !statSync(file).isFile()) {
        throw new Error(`Published paper "${entry.data.slug}" references a missing public file: ${url}`);
      }
    }
  }
  return entries.sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title, "en"));
}

export async function publishedEnglish() {
  const entries = await getCollection("english", ({ data }) => data.status === "published");
  assertUnique(entries, englishUrl, "english");
  return entries.sort((a, b) => a.data.title.localeCompare(b.data.title, "en"));
}

export function searchText(...values: Array<string | string[] | undefined>) {
  return values.flat().filter(Boolean).join(" ").normalize("NFKC").toLocaleLowerCase();
}

// Deliberately small Markdown subset. Every value is rendered as escaped Astro text;
// arbitrary HTML, scripts, iframes and raw Markdown links are never evaluated.
export type NoteBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string };

export function noteBlocks(body: string | undefined): NoteBlock[] {
  if (!body?.trim()) return [];
  return body.replace(/\r\n/g, "\n").split(/\n\s*\n/).flatMap((part): NoteBlock[] => {
    const text = part.trim();
    if (!text) return [];
    const lines = text.split("\n");
    if (lines.every((line) => /^[-*+]\s+/.test(line))) return [{ type: "list", ordered: false, items: lines.map((line) => line.replace(/^[-*+]\s+/, "")) }];
    if (lines.every((line) => /^\d+\.\s+/.test(line))) return [{ type: "list", ordered: true, items: lines.map((line) => line.replace(/^\d+\.\s+/, "")) }];
    if (lines.every((line) => /^>\s?/.test(line))) return [{ type: "quote", text: lines.map((line) => line.replace(/^>\s?/, "")).join("\n") }];
    const heading = /^(#{1,6})\s+(.+)$/.exec(text);
    if (heading) return [{ type: "heading", level: heading[1].length, text: heading[2] }];
    return [{ type: "paragraph", text }];
  });
}
