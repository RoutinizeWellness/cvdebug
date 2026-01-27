import { httpAction } from "../_generated/server";
import { getAllBlogSlugs } from "../../data/blogPosts/blogContent";

/**
 * Dynamic Sitemap Generation for SEO
 *
 * Generates XML sitemap with:
 * - Static pages
 * - Blog posts (auto-updated)
 * - Dynamic landing pages
 * - Proper priority and change frequency
 */

export const generateSitemap = httpAction(async (ctx, request) => {
  const baseUrl = "https://cvdebug.com";

  // Get all blog slugs dynamically
  const blogSlugs = getAllBlogSlugs();

  // Define static pages with priority and change frequency
  const staticPages = [
    { url: "", priority: 1.0, changefreq: "daily" }, // Homepage
    { url: "/pricing", priority: 0.9, changefreq: "weekly" },
    { url: "/features", priority: 0.8, changefreq: "weekly" },
    { url: "/blog", priority: 0.8, changefreq: "daily" },
    { url: "/about", priority: 0.6, changefreq: "monthly" },
  ];

  // Dynamic landing pages for programmatic SEO
  const roles = [
    "software-engineer",
    "data-scientist",
    "product-manager",
    "marketing-manager",
    "sdr-bdr",
    "account-executive",
    "sales-manager",
    "project-manager",
    "business-analyst",
    "ux-designer",
    "frontend-developer",
    "backend-developer",
    "fullstack-developer",
    "devops-engineer",
    "cloud-architect",
  ];

  const locations = [
    "san-francisco",
    "new-york",
    "london",
    "toronto",
    "berlin",
    "paris",
    "madrid",
    "mexico-city",
    "sao-paulo",
    "buenos-aires",
  ];

  // Generate XML sitemap
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  // Add static pages
  staticPages.forEach(page => {
    xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add blog posts
  blogSlugs.forEach(slug => {
    xml += `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <news:news>
      <news:publication>
        <news:name>CVDebug Blog</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString()}</news:publication_date>
      <news:title>Resume optimization guide</news:title>
    </news:news>
  </url>`;
  });

  // Add role-specific landing pages
  roles.forEach(role => {
    xml += `
  <url>
    <loc>${baseUrl}/resume-checker/${role}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`;
  });

  // Add location-based landing pages
  locations.forEach(location => {
    xml += `
  <url>
    <loc>${baseUrl}/ats-resume-checker/${location}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add role + location combinations (top combinations only)
  const topCombinations = [
    { role: "software-engineer", location: "san-francisco" },
    { role: "software-engineer", location: "new-york" },
    { role: "data-scientist", location: "san-francisco" },
    { role: "product-manager", location: "san-francisco" },
    { role: "marketing-manager", location: "new-york" },
    { role: "sdr-bdr", location: "san-francisco" },
    { role: "sales-manager", location: "new-york" },
  ];

  topCombinations.forEach(combo => {
    xml += `
  <url>
    <loc>${baseUrl}/resume-optimization/${combo.role}/${combo.location}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
});
