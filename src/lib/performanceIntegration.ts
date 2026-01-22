/**
 * Performance Integration
 * Centralized initialization of all performance optimizations
 */

import { PerformanceMonitor } from './bundleOptimizer';
import { routePreloader } from './codeSplitting';
import { cacheWarmer, mlCache, apiCache } from './advancedCaching';
import { AdvancedSEO } from './advancedSEO';

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations(): void {
  console.log('[Performance] Initializing optimizations...');

  // 1. Start performance monitoring
  initializePerformanceMonitoring();

  // 2. Setup cache warming
  setupCacheWarming();

  // 3. Initialize route preloading
  setupRoutePreloading();

  // 4. Setup SEO
  setupSEO();

  console.log('[Performance] All optimizations initialized');
}

/**
 * Initialize performance monitoring
 */
function initializePerformanceMonitoring(): void {
  // Only run in browser
  if (typeof window === 'undefined') return;

  // Initialize all Core Web Vitals monitoring
  PerformanceMonitor.initAll();

  // Log performance metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      logPerformanceMetrics();
    }, 2000);
  });

  console.log('[Performance] Performance monitoring initialized');
}

/**
 * Setup cache warming strategies
 */
function setupCacheWarming(): void {
  // Register cache warmers for frequently accessed data
  cacheWarmer.register('ml-models', async () => {
    console.log('[CacheWarmer] Warming ML models cache...');
    // Pre-load critical ML model data
    // This would fetch and cache model weights, feature extractors, etc.
  });

  cacheWarmer.register('user-data', async () => {
    console.log('[CacheWarmer] Warming user data cache...');
    // Pre-load user profile and preferences
  });

  cacheWarmer.register('common-queries', async () => {
    console.log('[CacheWarmer] Warming common queries cache...');
    // Pre-cache common database queries
  });

  // Warm caches on initial load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      // Delay cache warming to not block initial render
      setTimeout(() => {
        cacheWarmer.warmAll();
      }, 3000);
    });

    // Schedule periodic cache warming (every 30 minutes)
    cacheWarmer.schedule(30 * 60 * 1000);
  }

  console.log('[Performance] Cache warming configured');
}

/**
 * Setup intelligent route preloading
 */
function setupRoutePreloading(): void {
  if (typeof window === 'undefined') return;

  // Preload based on user authentication status
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Check if user is authenticated (adjust based on your auth system)
      const isAuthenticated = document.cookie.includes('__session');
      const isAdmin = document.cookie.includes('admin=true'); // Example

      if (isAdmin) {
        routePreloader.preloadForRole('admin');
      } else if (isAuthenticated) {
        routePreloader.preloadForRole('user');
      } else {
        routePreloader.preloadForRole('guest');
      }
    }, 1000);
  });

  // Preload related routes based on current location
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    const routeName = currentPath.split('/')[1] || 'landing';
    routePreloader.preloadRelated(routeName);
  }

  console.log('[Performance] Route preloading configured');
}

/**
 * Setup advanced SEO
 */
function setupSEO(): void {
  if (typeof window === 'undefined') return;

  const seo = AdvancedSEO.getInstance();

  // Set default SEO configuration
  seo.setMetaTags({
    title: 'AI-Powered Resume Analysis & Job Matching',
    description: 'Optimize your resume for ATS systems, get matched with perfect jobs, and prepare for interviews with AI-powered insights.',
    keywords: ['resume analysis', 'ATS optimization', 'job matching', 'interview prep', 'AI career tools'],
    ogImage: 'https://yoursite.com/og-image.jpg',
    twitterCard: 'summary_large_image',
    author: 'Your Company',
    language: 'en'
  });

  // Add resource hints for external domains
  seo.addResourceHints([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net'
  ]);

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

  console.log('[Performance] SEO configured');
}

/**
 * Log performance metrics
 */
function logPerformanceMetrics(): void {
  if (typeof window === 'undefined') return;

  const perfData = window.performance.getEntriesByType('navigation')[0] as any;
  if (!perfData) return;

  const metrics = {
    dns: perfData.domainLookupEnd - perfData.domainLookupStart,
    tcp: perfData.connectEnd - perfData.connectStart,
    ttfb: perfData.responseStart - perfData.requestStart,
    download: perfData.responseEnd - perfData.responseStart,
    domInteractive: perfData.domInteractive - perfData.fetchStart,
    domComplete: perfData.domComplete - perfData.fetchStart,
    loadComplete: perfData.loadEventEnd - perfData.fetchStart
  };

  console.log('[Performance] Metrics:', {
    'DNS Lookup': `${Math.round(metrics.dns)}ms`,
    'TCP Connection': `${Math.round(metrics.tcp)}ms`,
    'Time to First Byte': `${Math.round(metrics.ttfb)}ms`,
    'Download': `${Math.round(metrics.download)}ms`,
    'DOM Interactive': `${Math.round(metrics.domInteractive)}ms`,
    'DOM Complete': `${Math.round(metrics.domComplete)}ms`,
    'Load Complete': `${Math.round(metrics.loadComplete)}ms`
  });

  // Track cache performance
  const mlCacheStats = mlCache.getStats();
  console.log('[Performance] ML Cache Stats:', mlCacheStats);
}

/**
 * Get current performance score
 */
export function getPerformanceScore(): {
  score: number;
  metrics: Record<string, number>;
  recommendations: string[];
} {
  if (typeof window === 'undefined') {
    return { score: 0, metrics: {}, recommendations: [] };
  }

  const perfData = window.performance.getEntriesByType('navigation')[0] as any;
  if (!perfData) {
    return { score: 0, metrics: {}, recommendations: [] };
  }

  // Calculate metrics
  const ttfb = perfData.responseStart - perfData.requestStart;
  const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;
  const loadTime = perfData.loadEventEnd - perfData.fetchStart;

  // Score calculation (0-100)
  let score = 100;
  const recommendations: string[] = [];

  // TTFB should be < 600ms
  if (ttfb > 600) {
    score -= 20;
    recommendations.push('Reduce server response time (TTFB > 600ms)');
  } else if (ttfb > 300) {
    score -= 10;
    recommendations.push('Optimize server response time');
  }

  // FCP should be < 1800ms
  if (fcp > 1800) {
    score -= 25;
    recommendations.push('Improve First Contentful Paint (FCP > 1.8s)');
  } else if (fcp > 1000) {
    score -= 10;
    recommendations.push('Optimize First Contentful Paint');
  }

  // Load time should be < 3000ms
  if (loadTime > 3000) {
    score -= 20;
    recommendations.push('Reduce total page load time (> 3s)');
  } else if (loadTime > 2000) {
    score -= 10;
    recommendations.push('Optimize page load time');
  }

  return {
    score: Math.max(0, Math.round(score)),
    metrics: {
      ttfb: Math.round(ttfb),
      fcp: Math.round(fcp),
      loadTime: Math.round(loadTime)
    },
    recommendations
  };
}

/**
 * Export cache statistics for monitoring
 */
export function getCacheStatistics(): {
  ml: any;
  api: { pending: number };
  overall: { hitRate: number };
} {
  const mlStats = mlCache.getStats();

  return {
    ml: mlStats,
    api: {
      pending: 0 // Would track pending API requests
    },
    overall: {
      hitRate: mlStats.avgHits > 0 ? (mlStats.avgHits / mlStats.memorySize) * 100 : 0
    }
  };
}
