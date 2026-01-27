# Quick Integration Guide

This guide shows you how to integrate all the optimization systems into your application.

## Step 1: Initialize Performance Optimizations

In your main `src/main.tsx` or `src/App.tsx`:

```typescript
import { useEffect } from 'react';
import { initializePerformanceOptimizations } from '@/lib/performanceIntegration';

function App() {
  useEffect(() => {
    // Initialize all performance optimizations
    initializePerformanceOptimizations();
  }, []);

  return (
    // Your app JSX
  );
}
```

## Step 2: Update Routing with Lazy Loading

In your `src/main.tsx`:

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

// Use lazy loading for routes
const Landing = lazy(() => import('@/pages/Landing'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const Auth = lazy(() => import('@/pages/Auth'));
const Pricing = lazy(() => import('@/pages/Pricing'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function Root() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## Step 3: Add SEO to Landing Page

In `src/pages/Landing.tsx`:

```typescript
import { useEffect } from 'react';
import { AdvancedSEO } from '@/lib/advancedSEO';

export function Landing() {
  useEffect(() => {
    const seo = AdvancedSEO.getInstance();

    // Set meta tags
    seo.setMetaTags({
      title: 'AI-Powered Resume Analysis & Job Matching | Your Company',
      description: 'Optimize your resume for ATS systems, get matched with perfect jobs, and prepare for interviews with AI-powered insights.',
      keywords: ['resume analysis', 'ATS optimization', 'job matching', 'AI career tools', 'interview preparation'],
      ogImage: 'https://yoursite.com/og-landing.jpg',
      twitterCard: 'summary_large_image',
      language: 'en'
    });

    // Add organization schema
    seo.setStructuredData(
      seo.generateOrganizationSchema({
        name: 'Your Company',
        url: 'https://yoursite.com',
        logo: 'https://yoursite.com/logo.png',
        description: 'AI-powered career optimization platform',
        sameAs: [
          'https://twitter.com/yourcompany',
          'https://linkedin.com/company/yourcompany'
        ]
      })
    );
  }, []);

  return (
    <div>
      {/* Your landing page content */}
    </div>
  );
}
```

## Step 4: Optimize ML Predictions

Create a new file `src/convex/ml/optimizedAnalysis.ts`:

```typescript
"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import {
  extractFeaturesOptimized,
  predictScoreOptimized,
  MLPredictionCache,
  batchPredictOptimized
} from "./mlOptimizer";

// Create global cache instance
const predictionCache = new MLPredictionCache();
const featureCache = new Map<string, any>();

export const analyzeCVOptimized = internalAction({
  args: {
    cvText: v.string(),
    jobDescription: v.optional(v.string()),
    industry: v.string()
  },
  handler: async (ctx, args) => {
    // Check cache first
    const cacheKey = predictionCache.generateKey(args.cvText, args.jobDescription);
    const cachedScore = predictionCache.get(cacheKey);

    if (cachedScore !== null) {
      console.log('[ML] Cache hit for prediction');
      return { score: cachedScore, cached: true };
    }

    // Extract features with optimization
    const features = extractFeaturesOptimized(
      args.cvText,
      args.jobDescription,
      featureCache
    );

    // Get model weights (replace with your actual model weights)
    const modelWeights = {
      keywordDensity: 30,
      formatScore: 20,
      experienceScore: 25,
      educationScore: 15,
      skillsScore: 10
    };

    // Predict with optimization
    const score = predictScoreOptimized(
      features,
      modelWeights,
      args.industry,
      0.5 // threshold
    );

    // Cache the result
    predictionCache.set(cacheKey, score);

    return { score, cached: false };
  }
});

export const batchAnalyzeCVs = internalAction({
  args: {
    cvs: v.array(v.object({
      text: v.string(),
      jobDescription: v.optional(v.string()),
      industry: v.string()
    }))
  },
  handler: async (ctx, args) => {
    // Use batch processing for better performance
    const modelWeights = {
      keywordDensity: 30,
      formatScore: 20,
      experienceScore: 25,
      educationScore: 15,
      skillsScore: 10
    };

    const results = await batchPredictOptimized(
      args.cvs.map(cv => cv.text),
      args.cvs.map(cv => cv.jobDescription),
      args.cvs.map(cv => cv.industry),
      modelWeights,
      featureCache,
      predictionCache
    );

    return results;
  }
});
```

## Step 5: Use Advanced Caching

In any component or action that fetches data frequently:

```typescript
import { mlCache, apiCache, memoize } from '@/lib/advancedCaching';

// Example 1: Multi-level cache for ML predictions
async function getPrediction(cvId: string) {
  const cacheKey = `prediction-${cvId}`;

  // Try cache first
  const cached = mlCache.get(cacheKey);
  if (cached) {
    console.log('Cache hit!');
    return cached;
  }

  // Fetch if not cached
  const prediction = await fetchPredictionFromAPI(cvId);

  // Store in cache
  mlCache.set(cacheKey, prediction);

  return prediction;
}

// Example 2: Request deduplication
async function getUserData(userId: string) {
  return await apiCache.fetch(`user-${userId}`, () => {
    return fetchUserDataFromAPI(userId);
  });
}

// Example 3: Memoization for expensive calculations
const calculateComplexScore = memoize((data: any) => {
  // Expensive computation here
  return result;
}, {
  maxSize: 100,
  ttl: 3600000 // 1 hour
});
```

## Step 6: Add Preloading to Navigation

In your navigation component:

```typescript
import { preloadOnHover } from '@/lib/lazyLoader';

function Navigation() {
  return (
    <nav>
      <Link
        to="/dashboard"
        {...preloadOnHover(() => import('@/pages/Dashboard'))}
      >
        Dashboard
      </Link>

      <Link
        to="/admin"
        {...preloadOnHover(() => import('@/pages/AdminDashboard'))}
      >
        Admin
      </Link>
    </nav>
  );
}
```

## Step 7: Monitor Performance

Add a performance monitoring component:

```typescript
import { useEffect, useState } from 'react';
import { getPerformanceScore, getCacheStatistics } from '@/lib/performanceIntegration';

export function PerformanceMonitor() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const performance = getPerformanceScore();
      const cache = getCacheStatistics();
      setStats({ performance, cache });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs">
      <div>Performance: {stats.performance.score}/100</div>
      <div>Cache Hit Rate: {stats.cache.overall.hitRate.toFixed(1)}%</div>
      <div>TTFB: {stats.performance.metrics.ttfb}ms</div>
    </div>
  );
}
```

## Step 8: Use in Admin Dashboard

The Performance Optimization Dashboard is already integrated in AdminDashboard.tsx.
Access it at `/admin` and click the "Performance" tab.

## Step 9: Health Monitoring

The health check system is already running via cron job (every 5 minutes).
View results in the Admin Dashboard under the "System Health" section.

## Step 10: Export Analytics

In your admin dashboard, you can export metrics:

```typescript
import { unifiedMetrics } from '@/lib/unifiedMetrics';

function exportMetrics() {
  // Export as JSON
  const jsonData = unifiedMetrics.exportAll('json');

  // Download
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `metrics-${new Date().toISOString()}.json`;
  a.click();
}

// Or export as CSV
function exportMetricsCSV() {
  const csvData = unifiedMetrics.exportAll('csv');

  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `metrics-${new Date().toISOString()}.csv`;
  a.click();
}
```

## Testing the Optimizations

### 1. Test Performance
```bash
# Run Lighthouse audit
npx lighthouse https://yoursite.com --view

# Check bundle size
npm run build
```

### 2. Test Caching
```typescript
// In browser console
import { mlCache } from '@/lib/advancedCaching';
console.log(mlCache.getStats());
```

### 3. Test SEO
- Use [Google Rich Results Test](https://search.google.com/test/rich-results)
- Use [Schema Markup Validator](https://validator.schema.org/)
- Check meta tags with browser DevTools

### 4. Test ML Performance
```typescript
// Time a prediction
console.time('prediction');
const result = await analyzeCVOptimized({ cvText, jobDescription, industry });
console.timeEnd('prediction');
// Should be < 50ms with cache, < 100ms without
```

## Troubleshooting

### Issue: High initial load time
**Solution**: Verify lazy loading is working. Check Network tab in DevTools for chunk loading.

### Issue: Low cache hit rate
**Solution**: Increase cache size or TTL in cache configuration.

### Issue: SEO not working
**Solution**: Verify meta tags are being set. Check with "View Page Source" in browser.

### Issue: TypeScript errors
**Solution**: Run `npx tsc -b --noEmit` to check for errors. Fix any type issues.

## Next Steps

1. ✅ Initialize optimizations in App.tsx
2. ✅ Update routes with lazy loading
3. ✅ Add SEO to all pages
4. ✅ Replace ML predictions with optimized versions
5. ✅ Add caching to frequently accessed data
6. ✅ Add preloading to navigation
7. ✅ Monitor performance metrics
8. ✅ Test in production

## Support

For issues or questions:
1. Check OPTIMIZATION_SUMMARY.md for detailed documentation
2. Review code comments in optimization files
3. Test with provided examples
4. Monitor Admin Dashboard for insights

---

**Remember**: These optimizations are incremental. Implement them one at a time and measure the impact.
