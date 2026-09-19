// Parses a minimal YAML-style frontmatter block at the top of a markdown file:
//   ---
//   title: My Post
//   date: 2026-01-01
//   tags: [react, career]
//   excerpt: A short summary.
//   ---
//
// Plain JS with no Vite-specific imports, so it can run both in the browser
// bundle (via blog.js) and in the plain Node prerender script (see
// scripts/prerender-blog-meta.mjs) without pulling in a bundler.
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const [, block, content] = match;
  const meta = {};

  for (const line of block.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, "");
    }

    meta[key] = value;
  }

  return { meta, content: content.trim() };
}

export function slugFromPath(path) {
  return path.split("/").pop().replace(/\.md$/, "");
}
