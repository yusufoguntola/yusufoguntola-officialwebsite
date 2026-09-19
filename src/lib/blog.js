import { parseFrontmatter, slugFromPath } from "./frontmatter.js";

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
