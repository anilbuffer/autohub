import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/contact", "/terms", "/privacy", "/register", "/login"],
      disallow: ["/admin/", "/portal/"],
    },
    sitemap: "https://procurly.autohub.co.nz/sitemap.xml",
  };
}
