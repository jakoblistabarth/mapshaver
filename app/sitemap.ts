import { MetadataRoute } from "next";
import { siteUrl } from "./helpers/url";

// `output: export` only writes the file out if the route is explicitly static.
export const dynamic = "force-static";

/** Every page of the app, relative to the {@link siteUrl}. */
const routes = ["", "about"];

const lastModified = new Date();

const sitemap = (): MetadataRoute.Sitemap =>
  routes.map((route) => ({ url: new URL(route, siteUrl).href, lastModified }));

export default sitemap;
