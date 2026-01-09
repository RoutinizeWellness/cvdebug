/**
 * Generate sitemap.xml for CVDebug
 * Run with: npx tsx scripts/generateSitemap.ts
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

const baseUrl = 'https://cvdebug.com';
const today = new Date().toISOString().split('T')[0];

const urls: SitemapURL[] = [
  // Core pages
  { loc: '/', lastmod: today, changefreq: 'weekly', priority: 1.0 },
  { loc: '/pricing', lastmod: today, changefreq: 'weekly', priority: 0.9 },
  { loc: '/preview', lastmod: today, changefreq: 'monthly', priority: 0.7 },

  // Nursing niche pages (27 pages)
  { loc: '/ats-scanner-for-nurses', lastmod: today, changefreq: 'weekly', priority: 0.9 },
  { loc: '/med-surg-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/icu-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/er-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/travel-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/pediatric-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/psychiatric-nurse-resume-scanner', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/nurse-practitioner-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/ccu-cvu-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/dialysis-nurse-ats-scanner', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/home-health-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/school-nurse-ats-resume-scanner', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/case-manager-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/infection-control-nurse-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/rehab-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/wound-care-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/pain-management-nurse-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/ambulatory-care-nurse-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/radiology-nurse-ats-scanner', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/transplant-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/cardiology-nurse-ats-scanner', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/neurology-nurse-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/endoscopy-nurse-ats-scanner', lastmod: today, changefreq: 'monthly', priority: 0.8 },

  // Tech niche pages (21 pages)
  { loc: '/senior-frontend-engineer-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/backend-engineer-java-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/full-stack-engineer-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/machine-learning-engineer-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/devops-engineer-kubernetes-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/ios-engineer-swift-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/android-engineer-kotlin-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/cloud-architect-aws-ats-scanner', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/site-reliability-engineer-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/qa-engineer-automation-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/security-engineer-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/blockchain-engineer-ats-scanner', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/mobile-engineer-react-native-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/embedded-systems-engineer-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/golang-backend-engineer-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/rust-systems-engineer-ats', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/platform-engineer-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/solutions-architect-ats-scanner', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/software-engineer-keyword-sniper', lastmod: today, changefreq: 'monthly', priority: 0.7 },

  // Other niche pages
  { loc: '/resume-debug-for-data-analysts', lastmod: today, changefreq: 'monthly', priority: 0.7 },
  { loc: '/finance-internship-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.7 },
  { loc: '/financial-analyst-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.7 },
  { loc: '/marketing-manager-ats-scanner', lastmod: today, changefreq: 'monthly', priority: 0.7 },
  { loc: '/product-manager-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/ux-designer-ats-optimizer', lastmod: today, changefreq: 'monthly', priority: 0.8 },

  // Company-specific pages
  { loc: '/optimize/google-sde', lastmod: today, changefreq: 'monthly', priority: 0.7 },

  // Blog
  { loc: '/blog', lastmod: today, changefreq: 'weekly', priority: 0.9 },
  { loc: '/blog/how-to-beat-ats-resume-scanners', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  { loc: '/blog/understanding-ats-robot-view', lastmod: today, changefreq: 'monthly', priority: 0.8 },
];

const generateSitemap = (): string => {
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

const main = () => {
  const sitemap = generateSitemap();
  const outputPath = resolve(__dirname, '../public/sitemap.xml');

  writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`✅ Sitemap generated successfully at ${outputPath}`);
  console.log(`📊 Total URLs: ${urls.length}`);
  console.log('\nURL Summary:');
  console.log(`  - Priority 1.0: ${urls.filter(u => u.priority === 1.0).length}`);
  console.log(`  - Priority 0.9: ${urls.filter(u => u.priority === 0.9).length}`);
  console.log(`  - Priority 0.8: ${urls.filter(u => u.priority === 0.8).length}`);
  console.log(`  - Priority 0.7: ${urls.filter(u => u.priority === 0.7).length}`);
  console.log('\nNext steps:');
  console.log('  1. Submit to Google Search Console: https://search.google.com/search-console');
  console.log('  2. Add to robots.txt: Sitemap: https://cvdebug.com/sitemap.xml');
  console.log('  3. Verify sitemap at: https://cvdebug.com/sitemap.xml');
};

main();
