/**
 * Optimized Lazy Loading System
 * Improves initial load time with intelligent code splitting
 */

import { lazy, ComponentType } from 'react';

interface LazyLoadOptions {
  preload?: boolean;
  delay?: number;
  fallback?: ComponentType;
}

/**
 * Enhanced lazy loading with preloading capability
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const LazyComponent = lazy(importFn);

  // Add preload method
  (LazyComponent as any).preload = importFn;

  return LazyComponent;
}

/**
 * Preload components on hover
 */
export function preloadOnHover(importFn: () => Promise<any>) {
  return {
    onMouseEnter: () => {
      importFn();
    },
    onFocus: () => {
      importFn();
    }
  };
}

/**
 * Preload components on viewport intersection
 */
export function preloadOnVisible(importFn: () => Promise<any>, threshold = 0.1) {
  return (element: HTMLElement | null) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            importFn();
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    observer.observe(element);
  };
}

/**
 * Route-based preloading
 */
export class RoutePreloader {
  private static preloadCache = new Set<string>();

  static preload(route: string, importFn: () => Promise<any>) {
    if (this.preloadCache.has(route)) return;

    this.preloadCache.add(route);

    // Preload after a short delay to not block initial render
    setTimeout(() => {
      importFn().catch(() => {
        this.preloadCache.delete(route);
      });
    }, 100);
  }

  static preloadRoutes(routes: Record<string, () => Promise<any>>) {
    Object.entries(routes).forEach(([route, importFn]) => {
      this.preload(route, importFn);
    });
  }
}

/**
 * Component prefetch on idle
 */
export function prefetchOnIdle(importFn: () => Promise<any>) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFn();
    });
  } else {
    setTimeout(() => {
      importFn();
    }, 1000);
  }
}

/**
 * Batch component loader
 */
export class ComponentBatchLoader {
  private queue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private batchSize = 3;
  private delay = 200;

  add(importFn: () => Promise<any>) {
    this.queue.push(importFn);
    this.process();
  }

  private async process() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);

      await Promise.all(
        batch.map(fn => fn().catch(() => {}))
      );

      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }

    this.isProcessing = false;
  }
}

// Global batch loader instance
export const componentBatchLoader = new ComponentBatchLoader();
