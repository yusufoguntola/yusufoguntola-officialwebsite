// Single source of truth for absolute-URL SEO metadata. Kept dependency-free
// (no Vite-specific syntax) so it can be imported both by the React app and
// by the plain Node build scripts (see scripts/postbuild.mjs).
export const SITE_URL = "https://yusufoguntola.com";
export const SITE_NAME = "Yusuf Oguntola";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/profile_img.jpg`;
