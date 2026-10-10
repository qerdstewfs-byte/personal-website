import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Local public files or HTTPS only. Protocol-relative and traversal paths are rejected.
const assetUrl = z.string().refine((value) => {
  if (/^\/(?!\/)[a-zA-Z0-9_./%-]+$/.test(value)) {
    return !value.split("/").some((part) => {
      try { return [".", ".."].includes(decodeURIComponent(part)); } catch { return true; }
    });
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}, "Use a local /library/... file path or an HTTPS URL.");

const sourceUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
}, "References must use HTTPS without embedded credentials.");
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words joined with hyphens.");
const source = z.object({ title: z.string().min(1), url: sourceUrl });
const download = z.object({ url: assetUrl, label: z.string().min(1), size: z.string().optional() });
const figure = z.object({
  id: slug,
  src: assetUrl,
  alt: z.string().min(1),
  caption: z.string().min(1),
  attribution: z.string().min(1),
  source: sourceUrl.optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
const explanation = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  figureIds: z.array(slug).default([]),
});

const slide = z.object({
  id: slug,
  section: z.string().min(1),
  title: z.string().min(1),
  layout: z.enum(["cover", "split", "wide", "text", "references"]).default("text"),
  lead: z.string().optional(),
  paragraphs: z.array(z.string().min(1)).default([]),
  points: z.array(z.object({ label: z.string().min(1), text: z.string().min(1) })).default([]),
  metrics: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).default([]),
  flow: z.array(z.object({ label: z.string().min(1), text: z.string().min(1) })).default([]),
  relation: z.string().optional(),
  takeaway: z.string().optional(),
  figureIds: z.array(slug).default([]),
  sourceNote: z.string().min(1),
  sourcePage: z.number().int().positive().optional(),
  sources: z.array(source).default([]),
});

const papers = defineCollection({
  loader: glob({ base: "./src/content/papers", pattern: "**/[^_]*.md" }),
  schema: z.object({
    slug,
    title: z.string().min(1),
    category: z.enum(["laser-diode-driver", "system-building", "pact", "pam", "pame"]),
    status: z.enum(["draft", "published"]).default("draft"),
    summary: z.string().min(1),
    journal: z.string().min(1),
    year: z.number().int().min(1900).max(2200),
    authors: z.array(z.string().min(1)).min(1),
    doi: z.string().regex(/^10\.\d{4,9}\/\S+$/, "Supply the DOI, without a URL prefix.").optional(),
    tags: z.array(z.string().min(1)).default([]),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    downloads: z.object({ pdf: download.optional(), notes: download.optional() }).default({}),
    team: z.object({
      name: z.string().min(1),
      institution: z.string().optional(),
      mainWork: z.array(z.string().min(1)).min(1),
      sources: z.array(source).min(1),
    }).optional(),
    problem: z.string().optional(),
    materials: z.array(explanation).default([]),
    methods: z.array(explanation).default([]),
    innovations: z.array(z.object({
      title: z.string().min(1),
      before: z.string().min(1),
      change: z.string().min(1),
      why: z.string().min(1),
      evidence: z.string().min(1),
      tradeoff: z.string().min(1),
      figureIds: z.array(slug).default([]),
    })).default([]),
    results: z.array(explanation).default([]),
    conclusions: z.array(z.string().min(1)).default([]),
    figures: z.array(figure).default([]),
    references: z.array(source).default([]),
    presentation: z.object({
      title: z.string().min(1),
      slides: z.array(slide).min(1).max(40),
    }).optional(),
  }).superRefine((data, context) => {
    if (data.status === "published") {
      if (!data.problem?.trim()) context.addIssue({ code: "custom", path: ["problem"], message: "A published report needs a source-grounded research problem." });
      if (!data.team) context.addIssue({ code: "custom", path: ["team"], message: "Verify the research team and provide its sources before publication." });
      for (const key of ["pdf", "notes"] as const) {
        if (!data.downloads[key]) context.addIssue({ code: "custom", path: ["downloads", key], message: "Both the original PDF and learning notes are required before publication." });
      }
      for (const key of ["materials", "methods", "innovations", "results", "conclusions", "figures"] as const) {
        if (!data[key].length) context.addIssue({ code: "custom", path: [key], message: `A published report needs ${key}. Save incomplete reports as draft.` });
      }
    }
    const ids = new Set<string>();
    for (const [index, item] of data.figures.entries()) {
      if (ids.has(item.id)) context.addIssue({ code: "custom", path: ["figures", index, "id"], message: "Figure IDs must be unique." });
      ids.add(item.id);
    }
    for (const section of ["materials", "methods", "innovations", "results"] as const) {
      data[section].forEach((item, index) => item.figureIds.forEach((id) => {
        if (!ids.has(id)) context.addIssue({ code: "custom", path: [section, index, "figureIds"], message: `Unknown figure ID: ${id}` });
      }));
    }
    const slideIds = new Set<string>();
    data.presentation?.slides.forEach((item, index) => {
      if (slideIds.has(item.id)) context.addIssue({ code: "custom", path: ["presentation", "slides", index, "id"], message: "Slide IDs must be unique." });
      slideIds.add(item.id);
      item.figureIds.forEach((id) => {
        if (!ids.has(id)) context.addIssue({ code: "custom", path: ["presentation", "slides", index, "figureIds"], message: `Unknown figure ID: ${id}` });
      });
    });
  }),
});

const english = defineCollection({
  loader: glob({ base: "./src/content/english", pattern: "**/[^_]*.md" }),
  schema: z.object({
    slug,
    type: z.enum(["speaking", "vocabulary"]),
    status: z.enum(["draft", "published"]).default("draft"),
    title: z.string().min(1),
    meaning: z.string().min(1),
    category: z.string().min(1),
    tags: z.array(z.string().min(1)).default([]),
    context: z.string().optional(),
    pronunciation: z.string().optional(),
    examples: z.array(z.object({ english: z.string().min(1), chinese: z.string().optional() })).default([]),
    sources: z.array(source).default([]),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
});

export const collections = { papers, english };
