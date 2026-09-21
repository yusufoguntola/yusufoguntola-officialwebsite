#!/usr/bin/env node
// Runs after `vite build`. Two jobs, both driven by the same blog post data:
//
// 1. Prerendered blog HTML. This is a client-rendered SPA, so link-preview
//    crawlers (WhatsApp, Slack, Twitter, LinkedIn, ...) never execute our
//    React code — they fetch a URL once and read whatever <head> tags are
//    already in the HTML. The usePageMeta hook (src/lib/usePageMeta.js) only
//    updates tags after the page mounts in a real browser, so it's invisible
//    to those bots. Vercel serves an exact static file before falling back to
//    the SPA rewrite in vercel.json, so writing a real
//    dist/blog/<slug>/index.html — with that post's own title/description/OG
//    tags and JSON-LD already baked in — is what makes previews and search
//    snippets show the right thing. A real visitor still gets the same JS
//    bundle referenced by absolute paths, so the app boots normally from
//    there and usePageMeta keeps handling client-side navigation.
//
// 2. dist/sitemap.xml, listing every static route plus every blog post slug,
//    generated from the same source of truth (blog_content/*.md) instead of
//    a hand-maintained list that inevitably drifts.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseFrontmatter, slugFromPath } from "../src/lib/frontmatter.js";
import { SITE_URL, SITE_NAME } from "../src/lib/siteConfig.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, "dist");
const BLOG_CONTENT = path.join(ROOT, "blog_content");

function loadPosts() {
  return readdirSync(BLOG_CONTENT)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = readFileSync(path.join(BLOG_CONTENT, file), "utf8");
      const { meta } = parseFrontmatter(raw);
      return {
        slug: meta.slug || slugFromPath(file),
        title: meta.title || slugFromPath(file),
        excerpt: meta.excerpt || "",
        date: meta.date || "",
        image: meta.image || "",
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceTag(html, matcher, content) {
  if (!matcher.test(html)) {
    throw new Error(`postbuild: expected tag not found in dist/index.html (pattern: ${matcher})`);
  }
  return html.replace(matcher, (_full, before, _old, after) => `${before}${escapeHtml(content)}${after}`);
}

function injectJsonLd(html, jsonLd) {
  const script = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`;
  return html.replace(/<\/head>/, script);
}

function render(template, { title, description, ogType, url, image, jsonLd }) {
  let html = template;
  html = replaceTag(html, /(<title>)([\s\S]*?)(<\/title>)/, title);
  html = replaceTag(html, /(<meta name="description" content=")([^"]*)(")/, description);
  html = replaceTag(html, /(<link rel="canonical" href=")([^"]*)(")/, url);
  html = replaceTag(html, /(<meta property="og:type" content=")([^"]*)(")/, ogType);
  html = replaceTag(html, /(<meta property="og:url" content=")([^"]*)(")/, url);
  html = replaceTag(html, /(<meta property="og:title" content=")([^"]*)(")/, title);
  html = replaceTag(html, /(<meta property="og:description" content=")([^"]*)(")/, description);
  html = replaceTag(html, /(<meta property="og:image" content=")([^"]*)(")/, image);
  html = replaceTag(html, /(<meta name="twitter:title" content=")([^"]*)(")/, title);
  html = replaceTag(html, /(<meta name="twitter:description" content=")([^"]*)(")/, description);
  html = replaceTag(html, /(<meta name="twitter:image" content=")([^"]*)(")/, image);
  if (jsonLd) html = injectJsonLd(html, jsonLd);
  return html;
}

function writePage(relDir, html) {
  const dir = path.join(DIST, relDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html);
}

const template = readFileSync(path.join(DIST, "index.html"), "utf8");
const defaultDescriptionMatch = template.match(/<meta name="description" content="([^"]*)"/);
const defaultImageMatch = template.match(/<meta property="og:image" content="([^"]*)"/);
const DEFAULT_DESCRIPTION = defaultDescriptionMatch?.[1] ?? "";
const DEFAULT_IMAGE = defaultImageMatch?.[1] ?? `${SITE_URL}/profile_img.jpg`;

const posts = loadPosts();
const staticRoutes = [
  { path: "/", changefreq: "monthly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/experience", changefreq: "monthly", priority: "0.6" },
  { path: "/learning", changefreq: "monthly", priority: "0.6" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/press", changefreq: "monthly", priority: "0.5" },
];

for (const post of posts) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const title = `${post.title} — Yusuf Oguntola`;
  const description = post.excerpt || DEFAULT_DESCRIPTION;
  const image = post.image ? `${SITE_URL}${post.image}` : DEFAULT_IMAGE;
  const html = render(template, {
    title,
    description,
    ogType: "article",
    url,
    image,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description,
      datePublished: post.date,
      author: { "@type": "Person", name: SITE_NAME },
      image,
      url,
    },
  });
  writePage(`blog/${post.slug}`, html);
  console.log(`prerendered meta for /blog/${post.slug}`);
}

const blogListHtml = render(template, {
  title: "Blog — Yusuf Oguntola",
  description: "Writing on technology leadership, business strategy, and building infrastructure for African markets.",
  ogType: "website",
  url: `${SITE_URL}/blog`,
  image: DEFAULT_IMAGE,
});
writePage("blog", blogListHtml);
console.log("prerendered meta for /blog");

const urls = [
  ...staticRoutes.map((r) => ({ loc: `${SITE_URL}${r.path}`, changefreq: r.changefreq, priority: r.priority })),
  ...posts.map((post) => ({
    loc: `${SITE_URL}/blog/${post.slug}`,
    lastmod: post.date || undefined,
    changefreq: "monthly",
    priority: "0.7",
  })),
];

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) =>
    [
      "  <url>",
      `    <loc>${escapeHtml(u.loc)}</loc>`,
      u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority}</priority>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n")
  ),
  "</urlset>",
  "",
].join("\n");

writeFileSync(path.join(DIST, "sitemap.xml"), sitemapXml);
console.log(`generated sitemap.xml with ${urls.length} URLs`);
