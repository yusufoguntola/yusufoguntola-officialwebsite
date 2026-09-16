// Lets a blog post choose how its tables are drawn, from inside the markdown.
//
// Put a marker on its own line directly above a table:
//
//   {table: borderless}
//
//   | Feature | Value |
//   |:--------|:------|
//   | ...     | ...   |
//
// Several styles can be combined: `{table: bordered striped compact}`.
// Without a marker a table gets the default look (header rule + faint row lines).
//
// The marker paragraph is removed from the tree and turned into class names on
// the <table> element, which `.prose-blog` styles in src/index.css.

const MARKER = /^\{\s*table:\s*([a-z0-9\-,\s]+)\}$/i;

// Anything not listed here is ignored, so a typo can't inject arbitrary classes.
const STYLES = new Set(["bordered", "borderless", "rows", "striped", "compact"]);

export default function remarkTableStyle() {
  return (tree) => walk(tree);
}

function walk(node) {
  const children = node.children;
  if (!Array.isArray(children)) return;

  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    walk(child);

    if (child.type !== "table") continue;

    const styles = readMarker(children[i - 1]);
    if (!styles) continue;

    // Drop the marker even when every style in it was a typo, so a mistake
    // shows up as an unstyled table rather than as stray text in the post.
    children.splice(i - 1, 1);
    i--;

    if (!styles.length) continue;

    child.data = child.data || {};
    child.data.hProperties = {
      ...child.data.hProperties,
      className: styles.map((s) => `table-${s}`).join(" "),
    };
  }
}

function readMarker(node) {
  if (!node || node.type !== "paragraph" || node.children.length !== 1) return null;

  const only = node.children[0];
  if (only.type !== "text") return null;

  const match = only.value.trim().match(MARKER);
  if (!match) return null;

  return match[1]
    .split(/[\s,]+/)
    .map((s) => s.toLowerCase())
    .filter((s) => STYLES.has(s));
}
