#!/usr/bin/env node
// Runs after `vite build`. This is a client-rendered SPA, so link-preview
// crawlers (WhatsApp, Slack, Twitter, LinkedIn, ...) never execute our React
// code — they fetch a URL once and read whatever <head> tags are already in
// the HTML. The usePageMeta hook (src/lib/usePageMeta.js) only updates tags
// after the page mounts in a real browser, so it's invisible to those bots.
//
// Vercel serves an exact static file before falling back to the SPA rewrite
// in vercel.json, so writing a real dist/blog/<slug>/index.html — with that
// post's own title/description/OG tags already baked in — is what makes
// previews show the right thing. A real visitor still gets the same JS bundle
// referenced by absolute paths, so the app boots normally from there and
// usePageMeta keeps handling client-side navigation between posts.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseFrontmatter, slugFromPath } from "../src/lib/frontmatter.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, "dist");
const BLOG_CONTENT = path.join(ROOT, "blog_content");
const SITE_URL = "https://yusufoguntola.com";

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
      };
    });
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
    throw new Error(`prerender-blog-meta: expected tag not found in dist/index.html (pattern: ${matcher})`);
  }
  return html.replace(matcher, (_full, before, _old, after) => `${before}${escapeHtml(content)}${after}`);
}

function render(template, { title, description, ogType, url }) {
  let html = template;
  html = replaceTag(html, /(<title>)([\s\S]*?)(<\/title>)/, title);
  html = replaceTag(html, /(<meta name="description" content=")([^"]*)(")/, description);
  html = replaceTag(html, /(<meta property="og:type" content=")([^"]*)(")/, ogType);
  html = replaceTag(html, /(<meta property="og:url" content=")([^"]*)(")/, url);
  html = replaceTag(html, /(<meta property="og:title" content=")([^"]*)(")/, title);
  html = replaceTag(html, /(<meta property="og:description" content=")([^"]*)(")/, description);
  html = replaceTag(html, /(<meta name="twitter:title" content=")([^"]*)(")/, title);
  html = replaceTag(html, /(<meta name="twitter:description" content=")([^"]*)(")/, description);
  return html;
}

function writePage(relDir, html) {
  const dir = path.join(DIST, relDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html);
}

const template = readFileSync(path.join(DIST, "index.html"), "utf8");
const defaultDescriptionMatch = template.match(/<meta name="description" content="([^"]*)"/);
const DEFAULT_DESCRIPTION = defaultDescriptionMatch?.[1] ?? "";

const posts = loadPosts();

for (const post of posts) {
  const html = render(template, {
    title: `${post.title} — Yusuf Oguntola`,
    description: post.excerpt || DEFAULT_DESCRIPTION,
    ogType: "article",
    url: `${SITE_URL}/blog/${post.slug}`,
  });
  writePage(`blog/${post.slug}`, html);
  console.log(`prerendered meta for /blog/${post.slug}`);
}

const blogListHtml = render(template, {
  title: "Blog — Yusuf Oguntola",
  description: "Writing on technology leadership, business strategy, and building infrastructure for African markets.",
  ogType: "website",
  url: `${SITE_URL}/blog`,
});
writePage("blog", blogListHtml);
console.log("prerendered meta for /blog");
