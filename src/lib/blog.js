// Parses a minimal YAML-style frontmatter block at the top of a markdown file:
//   ---
//   title: My Post
//   date: 2026-01-01
//   tags: [react, career]
//   excerpt: A short summary.
//   ---
function parseFrontmatter(raw) {
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

function slugFromPath(path) {
  return path.split("/").pop().replace(/\.md$/, "");
}

const files = import.meta.glob("/blog_content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const posts = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, content } = parseFrontmatter(raw);
    const slug = meta.slug || slugFromPath(path);
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || "",
      tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
      excerpt: meta.excerpt || "",
      content,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}
