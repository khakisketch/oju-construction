import { MetadataRoute } from "next";
import { env } from "@/shared/config/env";

// Static export를 위한 설정
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = env.site.url || "https://ojuec.co.kr";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/login/", "/private/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/login/", "/private/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
