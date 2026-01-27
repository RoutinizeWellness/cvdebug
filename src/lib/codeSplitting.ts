/**
 * Code Splitting and Route-based Lazy Loading
 * Optimizes bundle size by splitting code into smaller chunks
 */

import { lazy, ComponentType } from 'react';

/**
 * Route-based code splitting configuration
 * Each route gets its own chunk for optimal initial load
 */
export const routes = {
  // Public routes
  // home: lazy(() => import('@/pages/Home')),
  landing: lazy(() => import('@/pages/Landing')),
  pricing: lazy(() => import('@/pages/Pricing')),

  // Authentication routes
  auth: lazy(() => import('@/pages/Auth')),

  // Dashboard routes (loaded after authentication)
  dashboard: lazy(() => import('@/pages/Dashboard')),
  adminDashboard: lazy(() => import('@/pages/AdminDashboard'))

  // Feature-specific routes (loaded on demand)
  // Add these as you create the pages:
  // cvAnalysis: lazy(() => import('@/pages/CVAnalysis')),
  // atsOptimization: lazy(() => import('@/pages/ATSOptimization')),
  // interviewPrep: lazy(() => import('@/pages/InterviewPrep')),
  // jobMatching: lazy(() => import('@/pages/JobMatching')),

  // Settings and profile (low priority)
  // settings: lazy(() => import('@/pages/Settings')),
  // profile: lazy(() => import('@/pages/Profile'))
};

/**
 * Component-level code splitting
 * Split large components that aren't needed immediately
 */
export const components = {
  // Heavy chart/visualization components
  // Note: These components export named exports, not default exports
  // Use them directly via regular imports instead of lazy loading
  // analytics: lazy(() => import('@/components/admin/MLAnalyticsDashboard')),
  // performanceOpt: lazy(() => import('@/components/admin/PerformanceOptimizationDashboard')),
  // seoAnalytics: lazy(() => import('@/components/admin/SEOAnalyticsDashboard')),

  // Large form components (add these as you create them)
  // cvUploader: lazy(() => import('@/components/CVUploader')),
  // bulkUploader: lazy(() => import('@/components/BulkUploader')),

  // Rich text editors and complex UI
  // editor: lazy(() => import('@/components/RichTextEditor')),

  // Modal components (loaded when opened)
  // feedbackModal: lazy(() => import('@/components/FeedbackModal')),
  // upgradeModal: lazy(() => import('@/components/UpgradeModal'))
};

/**
 * Vendor code splitting strategy
 * Separate vendor code for better caching
 */
export const vendorChunks = {
  // React ecosystem (changes infrequently)
  react: ['react', 'react-dom', 'react-router'],

  // UI library (changes with design updates)
  ui: ['framer-motion', 'lucide-react', '@radix-ui'],

  // Data fetching (changes with backend updates)
  convex: ['convex'],

  // Utilities (rarely changes)
  utils: ['date-fns', 'clsx']
};

/**
 * Preload strategy for anticipated navigation
 */
export class RoutePreloader {
  private preloaded = new Set<string>();

  /**
   * Preload a route before user navigates to it
   */
  preload(routeName: keyof typeof routes): void {
    if (this.preloaded.has(routeName)) return;

    const route = routes[routeName];
    if (route && typeof (route as any).preload === 'function') {
      (route as any).preload();
      this.preloaded.add(routeName);
    }
  }

  /**
   * Preload multiple routes
   */
  preloadMultiple(routeNames: Array<keyof typeof routes>): void {
    routeNames.forEach(name => this.preload(name));
  }

  /**
   * Preload routes based on user role
   */
  preloadForRole(role: 'user' | 'admin' | 'guest'): void {
    if (role === 'admin') {
      this.preloadMultiple(['adminDashboard', 'dashboard']);
    } else if (role === 'user') {
      this.preloadMultiple(['dashboard']);
      // Add more routes as they're created:
      // this.preloadMultiple(['dashboard', 'cvAnalysis', 'jobMatching']);
    } else {
      this.preloadMultiple(['landing', 'pricing']);
    }
  }

  /**
   * Preload based on current route (predictive)
   */
  preloadRelated(currentRoute: string): void {
    const predictions: Record<string, Array<keyof typeof routes>> = {
      landing: ['auth', 'pricing'],
      pricing: ['auth', 'dashboard'],
      auth: ['dashboard'],
      dashboard: ['adminDashboard']
      // Add more predictions as routes are created:
      // dashboard: ['cvAnalysis', 'jobMatching', 'interviewPrep'],
      // cvAnalysis: ['atsOptimization', 'jobMatching']
    };

    const related = predictions[currentRoute];
    if (related) {
      this.preloadMultiple(related);
    }
  }
}

/**
 * Dynamic import with retry and timeout
 */
export async function dynamicImport<T>(
  importFn: () => Promise<T>,
  options: {
    retries?: number;
    timeout?: number;
    fallback?: T;
  } = {}
): Promise<T> {
  const { retries = 3, timeout = 10000, fallback } = options;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await Promise.race([
        importFn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Import timeout')), timeout)
        )
      ]);
      return result;
    } catch (error) {
      console.error(`Import attempt ${attempt + 1} failed:`, error);

      if (attempt === retries - 1) {
        if (fallback) return fallback;
        throw error;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw new Error('Dynamic import failed after retries');
}

/**
 * Bundle size monitoring
 */
export class BundleSizeMonitor {
  private static sizes = new Map<string, number>();

  static track(chunkName: string, size: number): void {
    this.sizes.set(chunkName, size);
  }

  static getReport(): {
    totalSize: number;
    chunks: Array<{ name: string; size: number; percentage: number }>;
  } {
    const totalSize = Array.from(this.sizes.values()).reduce((sum, size) => sum + size, 0);
    const chunks = Array.from(this.sizes.entries())
      .map(([name, size]) => ({
        name,
        size,
        percentage: (size / totalSize) * 100
      }))
      .sort((a, b) => b.size - a.size);

    return { totalSize, chunks };
  }

  static getLargestChunks(count: number = 5): Array<{ name: string; size: number }> {
    return Array.from(this.sizes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([name, size]) => ({ name, size }));
  }
}

// Global route preloader instance
export const routePreloader = new RoutePreloader();
