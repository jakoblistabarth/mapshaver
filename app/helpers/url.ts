/**
 * The path the app is served under. Empty during `next dev`.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix a root-relative URL with the {@link basePath}.
 *
 * Next rewrites `next/link` hrefs and `_next` asset URLs itself; this is for
 * the URLs we build by hand.
 * @param path a root-relative path, e.g. `/sql-wasm.wasm`
 */
export const withBasePath = (path: string) => `${basePath}${path}`;

/**
 * Where the site is served from, the {@link basePath} included.
 *
 * Kept with a trailing slash, so that a path below it is joined rather than
 * replacing the last segment.
 */
export const siteUrl = new URL(
  `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/`.replace(
    /\/+$/,
    "/",
  ),
);
