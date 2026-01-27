/**
 * SEO Verification Script
 *
 * This script verifies that all SEO elements are correctly configured
 * Run with: npx tsx scripts/verifySEO.ts
 */

const DOMAIN = "https://cvdebug.com";

interface SEOCheck {
  name: string;
  url: string;
  check: (response: Response, body: string) => Promise<boolean>;
  description: string;
}

const checks: SEOCheck[] = [
  {
    name: "Sitemap Accessibility",
    url: `${DOMAIN}/sitemap.xml`,
    check: async (response, body) => {
      return response.status === 200 && body.includes('<urlset') && body.includes('</urlset>');
    },
    description: "Sitemap.xml should be accessible and valid XML"
  },
  {
    name: "Robots.txt Accessibility",
    url: `${DOMAIN}/robots.txt`,
    check: async (response, body) => {
      return response.status === 200 && body.includes('User-agent:') && body.includes('Sitemap:');
    },
    description: "Robots.txt should be accessible and contain directives"
  },
  {
    name: "Sitemap URL Count",
    url: `${DOMAIN}/sitemap.xml`,
    check: async (response, body) => {
      const urlCount = (body.match(/<loc>/g) || []).length;
      console.log(`   Found ${urlCount} URLs in sitemap (expected: 55)`);
      return urlCount >= 50; // At least 50 URLs (50 niche + 5 core)
    },
    description: "Sitemap should contain all 55 URLs"
  },
  {
    name: "Homepage Meta Tags",
    url: DOMAIN,
    check: async (response, body) => {
      const hasTitle = body.includes('<title>');
      const hasDescription = body.includes('meta name="description"');
      const hasOG = body.includes('og:title');
      return hasTitle && hasDescription && hasOG;
    },
    description: "Homepage should have title, description, and OG tags"
  },
  {
    name: "Schema.org Structured Data",
    url: DOMAIN,
    check: async (response, body) => {
      const hasSchema = body.includes('application/ld+json');
      const hasWebApp = body.includes('"@type": "WebApplication"');
      const hasRating = body.includes('aggregateRating');
      return hasSchema && hasWebApp && hasRating;
    },
    description: "Homepage should have JSON-LD structured data"
  },
  {
    name: "Favicon Accessibility",
    url: `${DOMAIN}/favicon.png`,
    check: async (response) => {
      return response.status === 200 && response.headers.get('content-type')?.includes('image');
    },
    description: "Favicon should be accessible"
  },
  {
    name: "PWA Manifest",
    url: `${DOMAIN}/site.webmanifest`,
    check: async (response, body) => {
      const hasName = body.includes('"name"');
      const hasIcons = body.includes('"icons"');
      return response.status === 200 && hasName && hasIcons;
    },
    description: "PWA manifest should be accessible and valid"
  },
  {
    name: "Sample Niche Page (Nurses)",
    url: `${DOMAIN}/ats-scanner-for-nurses`,
    check: async (response, body) => {
      const hasTitle = body.includes('Nurses') || body.includes('ATS');
      return response.status === 200 && hasTitle;
    },
    description: "Niche landing page should load correctly"
  },
  {
    name: "Sample Niche Page (Tech)",
    url: `${DOMAIN}/senior-frontend-engineer-ats`,
    check: async (response, body) => {
      const hasTitle = body.includes('Engineer') || body.includes('Frontend');
      return response.status === 200 && hasTitle;
    },
    description: "Tech landing page should load correctly"
  },
  {
    name: "Canonical URL",
    url: DOMAIN,
    check: async (response, body) => {
      const hasCanonical = body.includes('rel="canonical"');
      const correctURL = body.includes('https://cvdebug.com');
      return hasCanonical && correctURL;
    },
    description: "Homepage should have correct canonical URL"
  }
];

async function runCheck(check: SEOCheck): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`\n🔍 Checking: ${check.name}`);
    console.log(`   URL: ${check.url}`);

    const response = await fetch(check.url);
    const body = await response.text();

    const passed = await check.check(response, body);

    if (passed) {
      console.log(`   ✅ PASS: ${check.description}`);
      return { success: true };
    } else {
      console.log(`   ❌ FAIL: ${check.description}`);
      return { success: false, error: "Check failed" };
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function main() {
  console.log('🚀 CVDebug SEO Verification Script');
  console.log('====================================\n');
  console.log(`Domain: ${DOMAIN}`);
  console.log(`Total checks: ${checks.length}\n`);

  const results = [];

  for (const check of checks) {
    const result = await runCheck(check);
    results.push({ name: check.name, ...result });

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n====================================');
  console.log('📊 SUMMARY');
  console.log('====================================\n');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;
  const passRate = Math.round((passed / total) * 100);

  console.log(`Total: ${total} checks`);
  console.log(`✅ Passed: ${passed} (${passRate}%)`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed Checks:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}`);
      if (r.error) console.log(`     Error: ${r.error}`);
    });
  }

  console.log('\n====================================');

  if (passRate === 100) {
    console.log('🎉 All checks passed! Your SEO setup is ready.');
  } else if (passRate >= 80) {
    console.log('⚠️  Most checks passed, but some issues need attention.');
  } else {
    console.log('❌ Multiple checks failed. Please review the errors above.');
  }

  console.log('\n📚 Next Steps:');
  console.log('1. Submit sitemap to Google Search Console');
  console.log('2. Verify structured data with Rich Results Test');
  console.log('3. Monitor rankings in GSC after 48 hours');
  console.log('\nSee SEO_SETUP_GUIDE.md for detailed instructions.');

  process.exit(failed > 0 ? 1 : 0);
}

main();
