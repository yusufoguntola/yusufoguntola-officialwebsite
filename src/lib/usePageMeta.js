import { useEffect } from "react";
import { SITE_URL, DEFAULT_OG_IMAGE } from "./siteConfig";

// Finds (or creates) an element identified by a CSS selector and returns it
// plus whatever attribute value it had before this call touched it, so the
// caller can restore it later.
function claimElement(selector, create) {
  let el = document.head.querySelector(selector);
  const existed = Boolean(el);

  if (!el) {
    el = create();
    document.head.appendChild(el);
  }

  return { el, existed };
}

function claimMeta(attr, key) {
  const { el, existed } = claimElement(`meta[${attr}="${key}"]`, () => {
    const meta = document.createElement("meta");
    meta.setAttribute(attr, key);
    return meta;
  });
  const previousContent = existed ? el.getAttribute("content") : null;
  return { el, previousContent };
}

// Sets document.title, canonical URL, description / Open Graph / Twitter card
// tags, the robots directive, and (optionally) a JSON-LD block for the page
// that's currently mounted — then puts everything back the way it was (the
// site-wide defaults from index.html) when it unmounts, so routing away from
// a blog post doesn't leave that post's metadata behind.
export default function usePageMeta({ title, description, type, image, noindex, jsonLd } = {}) {
  useEffect(() => {
    if (!title && !description && !noindex && !jsonLd) return undefined;

    const previousTitle = document.title;
    const restores = [];

    const setContent = (attr, key, content) => {
      const { el, previousContent } = claimMeta(attr, key);
      restores.push({ el, previousContent });
      el.setAttribute("content", content);
    };

    const canonicalUrl = `${SITE_URL}${window.location.pathname}`;

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
    setContent("property", "og:url", canonicalUrl);
    setContent("property", "og:image", image || DEFAULT_OG_IMAGE);
    setContent("name", "twitter:image", image || DEFAULT_OG_IMAGE);
    setContent("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    const { el: canonicalEl, existed: canonicalExisted } = claimElement('link[rel="canonical"]', () => {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      return link;
    });
    const previousHref = canonicalExisted ? canonicalEl.getAttribute("href") : null;
    canonicalEl.setAttribute("href", canonicalUrl);

    let jsonLdEl = null;
    if (jsonLd) {
      jsonLdEl = document.createElement("script");
      jsonLdEl.type = "application/ld+json";
      jsonLdEl.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdEl);
    }

    return () => {
      document.title = previousTitle;
      restores.forEach(({ el, previousContent }) => {
        if (previousContent === null) el.remove();
        else el.setAttribute("content", previousContent);
      });
      if (previousHref === null) canonicalEl.remove();
      else canonicalEl.setAttribute("href", previousHref);
      if (jsonLdEl) jsonLdEl.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, type, image, noindex, jsonLd]);
}
