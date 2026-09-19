import { useEffect } from "react";

// Finds (or creates) a <meta> tag identified by `attr` ("name" or "property")
// and returns it plus whatever content it had before this call touched it, so
// the caller can restore it later.
function claimMeta(attr, key) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  const previousContent = el ? el.getAttribute("content") : null;

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  return { el, previousContent };
}

// Sets document.title plus the description / Open Graph / Twitter card tags
// for the page that's currently mounted, and puts everything back the way it
// was (the site-wide defaults from index.html) when it unmounts — so routing
// away from a blog post doesn't leave that post's metadata behind.
export default function usePageMeta({ title, description, type } = {}) {
  useEffect(() => {
    if (!title && !description) return undefined;

    const previousTitle = document.title;
    const restores = [];

    const setContent = (attr, key, content) => {
      const { el, previousContent } = claimMeta(attr, key);
      restores.push({ el, previousContent });
      el.setAttribute("content", content);
    };

    if (title) {
      document.title = title;
      setContent("property", "og:title", title);
      setContent("name", "twitter:title", title);
    }
    if (description) {
      setContent("name", "description", description);
      setContent("property", "og:description", description);
      setContent("name", "twitter:description", description);
    }
    if (type) {
      setContent("property", "og:type", type);
    }
    setContent("property", "og:url", window.location.href);

    return () => {
      document.title = previousTitle;
      restores.forEach(({ el, previousContent }) => {
        if (previousContent === null) el.remove();
        else el.setAttribute("content", previousContent);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, type]);
}
