import { getCollection, type CollectionEntry } from "astro:content";
import { existsSync, statSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

export const researchGroups = [
  {
    slug: "pam-system",
    title: "PAM 系统构建",
    description: "从激光二极管驱动到系统搭建，按模块整理文献与学习记录。",
    categories: [
      { slug: "laser-diode-driver", title: "激光二极管驱动", description: "激光二极管驱动相关论文、原始资料与学习笔记。" },
      { slug: "system-building", title: "系统搭建", description: "PAM 系统搭建相关论文、原始资料与学习笔记。" },
    ],
  },
  {
    slug: "fundamentals",
    title: "光声基础学习类文章",
    description: "按 PACT、PAM、PAME 归档，把原论文与自己的理解放在一起。",
    categories: [
      { slug: "pact", title: "PACT", description: "PACT 相关文献与学习记录。" },
      { slug: "pam", title: "PAM", description: "PAM 相关文献与学习记录。" },
      { slug: "pame", title: "PAME", description: "PAME 相关文献与学习记录。" },
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
  return entries.sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title, "zh-CN"));
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
