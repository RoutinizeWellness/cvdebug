/**
 * SEO Analytics Script for CVDebug
 * Generates reports on keyword coverage, page optimization, and expansion opportunities
 * Run with: npx tsx scripts/seoAnalytics.ts
 */

import { nicheTemplates, getAllNicheSlugs } from '../src/data/nicheTemplates.js';
import { seoPages, getNextPagesToBuild } from '../src/data/seoStrategy.js';

interface PageAnalysis {
  url: string;
  title: string;
  keywordCount: number;
  hasTrends: boolean;
  hasBeforeAfter: boolean;
  testimonialCount: number;
  relatedPagesCount: number;
  seoScore: number;
}

const analyzePage = (slug: string): PageAnalysis | null => {
  const template = nicheTemplates[slug];
  const seoPage = Object.values(seoPages).find(p => p.url.includes(slug));

  if (!template) return null;

  const keywordCount = template.keywords.length;
  const hasTrends = template.stats.length >= 3;
  const hasBeforeAfter = !!template.beforeAfter;
  const testimonialCount = template.testimonials.length;
  const relatedPagesCount = seoPage?.relatedPages.length || 0;

  // Calculate SEO score (0-100)
  let seoScore = 0;
  seoScore += Math.min(keywordCount * 5, 50); // Max 50 points for keywords (10+ keywords = 50)
  seoScore += hasTrends ? 10 : 0;
  seoScore += hasBeforeAfter ? 15 : 0;
  seoScore += Math.min(testimonialCount * 5, 15); // Max 15 points for testimonials
  seoScore += Math.min(relatedPagesCount * 2.5, 10); // Max 10 points for internal links

  return {
    url: `/${slug}`,
    title: template.metaTitle,
    keywordCount,
    hasTrends,
    hasBeforeAfter,
    testimonialCount,
    relatedPagesCount,
    seoScore: Math.round(seoScore)
  };
};

const generateReport = () => {
  console.log('\n📊 CVDebug SEO Analytics Report\n');
  console.log('='.repeat(80));

  const slugs = getAllNicheSlugs();
  const analyses = slugs.map(analyzePage).filter(Boolean) as PageAnalysis[];

  // Overall stats
  console.log('\n📈 Overall Statistics:\n');
  console.log(`  Total Niche Pages: ${analyses.length}`);
  console.log(`  Average Keywords per Page: ${Math.round(analyses.reduce((sum, a) => sum + a.keywordCount, 0) / analyses.length)}`);
  console.log(`  Average SEO Score: ${Math.round(analyses.reduce((sum, a) => sum + a.seoScore, 0) / analyses.length)}/100`);
  console.log(`  Pages with Before/After: ${analyses.filter(a => a.hasBeforeAfter).length}/${analyses.length}`);
  console.log(`  Total Keywords Targeted: ${analyses.reduce((sum, a) => sum + a.keywordCount, 0)}`);

  // Category breakdown
  console.log('\n📂 Category Breakdown:\n');
  const nursingPages = slugs.filter(s => s.includes('nurse'));
  const techPages = slugs.filter(s => s.includes('engineer') || s.includes('devops') || s.includes('frontend'));
  console.log(`  Nursing Pages: ${nursingPages.length}`);
  console.log(`  Tech Pages: ${techPages.length}`);
  console.log(`  Other Pages: ${slugs.length - nursingPages.length - techPages.length}`);

  // Top performing pages
  console.log('\n🏆 Top Performing Pages (by SEO Score):\n');
  analyses
    .sort((a, b) => b.seoScore - a.seoScore)
    .slice(0, 5)
    .forEach((analysis, idx) => {
      console.log(`  ${idx + 1}. ${analysis.url} - Score: ${analysis.seoScore}/100`);
      console.log(`     Keywords: ${analysis.keywordCount}, Testimonials: ${analysis.testimonialCount}, Links: ${analysis.relatedPagesCount}`);
    });

  // Pages needing improvement
  console.log('\n⚠️  Pages Needing Improvement (SEO Score < 80):\n');
  const needsImprovement = analyses.filter(a => a.seoScore < 80);
  if (needsImprovement.length === 0) {
    console.log('  ✅ All pages have good SEO scores!');
  } else {
    needsImprovement.forEach(analysis => {
      console.log(`  - ${analysis.url} (Score: ${analysis.seoScore}/100)`);
      if (analysis.keywordCount < 10) console.log(`    → Add more keywords (current: ${analysis.keywordCount})`);
      if (!analysis.hasBeforeAfter) console.log(`    → Add Before/After section (+15 points)`);
      if (analysis.testimonialCount < 3) console.log(`    → Add more testimonials (current: ${analysis.testimonialCount})`);
      if (analysis.relatedPagesCount < 3) console.log(`    → Add more internal links (current: ${analysis.relatedPagesCount})`);
    });
  }

  // Expansion opportunities
  console.log('\n🚀 Next Pages to Build (High Priority):\n');
  const nextPages = getNextPagesToBuild(10);
  nextPages.slice(0, 5).forEach((page, idx) => {
    console.log(`  ${idx + 1}. ${page.slug} (${page.category}, priority: ${page.priority})`);
  });

  // Keyword analysis
  console.log('\n🔑 Keyword Coverage by Category:\n');
  const nursingKeywords = analyses
    .filter(a => nursingPages.includes(a.url.replace('/', '')))
    .reduce((sum, a) => sum + a.keywordCount, 0);
  const techKeywords = analyses
    .filter(a => techPages.includes(a.url.replace('/', '')))
    .reduce((sum, a) => sum + a.keywordCount, 0);
  console.log(`  Nursing: ${nursingKeywords} keywords across ${nursingPages.length} pages`);
  console.log(`  Tech: ${techKeywords} keywords across ${techPages.length} pages`);

  // Traffic potential (rough estimate)
  console.log('\n💰 Estimated Monthly Traffic Potential:\n');
  const avgTrafficPerKeyword = 20; // conservative estimate
  const totalPotential = analyses.reduce((sum, a) => sum + a.keywordCount, 0) * avgTrafficPerKeyword;
  console.log(`  Conservative (20 visitors/keyword/month): ${totalPotential.toLocaleString()} monthly visitors`);
  console.log(`  With 15% conversion to free scan: ${Math.round(totalPotential * 0.15).toLocaleString()} scans/month`);
  console.log(`  With 3% conversion to paid: ${Math.round(totalPotential * 0.03).toLocaleString()} paid users/month`);

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Report complete!\n');
};

generateReport();
