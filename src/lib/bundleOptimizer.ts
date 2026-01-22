/**
 * Bundle Optimization Utilities
 * Reduces bundle size and improves load times
 */

/**
 * Tree-shakeable imports helper
 * Examples of how to import only what you need from large libraries
 */
export const optimizedImports = {
  // Only import what you need from large libraries
  // Note: Install lodash-es for tree-shakeable lodash utilities
  // lodash: {
  //   debounce: () => import('lodash-es/debounce'),
  //   throttle: () => import('lodash-es/throttle'),
  //   cloneDeep: () => import('lodash-es/cloneDeep')
  // },

  // Date libraries - date-fns is already used in the project
  date: {
    format: () => import('date-fns/format'),
    parseISO: () => import('date-fns/parseISO'),
    formatDistance: () => import('date-fns/formatDistance')
  }
};

/**
 * Dynamic component loader with retry
 */
export async function loadComponentWithRetry<T>(
  loader: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await loader();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Failed to load component');
}

/**
 * Chunk prefetching strategy
 */
export class ChunkPrefetcher {
  private prefetched = new Set<string>();

  prefetch(chunkIds: string[]): void {
    chunkIds.forEach(id => {
      if (this.prefetched.has(id)) return;

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/chunks/${id}.js`;
      document.head.appendChild(link);

      this.prefetched.add(id);
    });
  }

  preload(chunkIds: string[]): void {
    chunkIds.forEach(id => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = `/chunks/${id}.js`;
      document.head.appendChild(link);
    });
  }
}

/**
 * Service Worker registration for caching
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('Service Worker registered:', registration.scope);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New Service Worker available');
            // Optionally prompt user to reload
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  static measureLoad(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      console.log('Performance Metrics:', {
        pageLoadTime: `${pageLoadTime}ms`,
        connectTime: `${connectTime}ms`,
        renderTime: `${renderTime}ms`
      });

      // Send to analytics
      if (pageLoadTime > 3000) {
        console.warn('Slow page load detected:', pageLoadTime);
      }
    });
  }

  static measureFCP(): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime);
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }

  static measureLCP(): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  static measureCLS(): void {
    if (typeof window === 'undefined') return;

    let clsScore = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsScore += (entry as any).value;
          console.log('CLS:', clsScore);
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  static measureFID(): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const eventEntry = entry as any; // PerformanceEventTiming
        const fid = eventEntry.processingStart - eventEntry.startTime;
        console.log('FID:', fid);
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
  }

  static initAll(): void {
    this.measureLoad();
    this.measureFCP();
    this.measureLCP();
    this.measureCLS();
    this.measureFID();
  }
}

/**
 * Image optimization utilities
 */
export class ImageOptimizer {
  static lazy(images?: NodeListOf<HTMLImageElement>): void {
    const imgs = images || document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px'
      });

      imgs.forEach(img => observer.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      imgs.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
        }
      });
    }
  }

  static webp(imgElement: HTMLImageElement, webpSrc: string, fallbackSrc: string): void {
    const img = new Image();
    img.onload = () => {
      imgElement.src = webpSrc;
    };
    img.onerror = () => {
      imgElement.src = fallbackSrc;
    };
    img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  }

  static responsive(img: HTMLImageElement, sizes: { [key: number]: string }): void {
    const sortedSizes = Object.entries(sizes).sort((a, b) => Number(a[0]) - Number(b[0]));

    const updateSrc = () => {
      const width = window.innerWidth;
      let selectedSrc = sortedSizes[0][1];

      for (const [breakpoint, src] of sortedSizes) {
        if (width >= Number(breakpoint)) {
          selectedSrc = src;
        }
      }

      img.src = selectedSrc;
    };

    updateSrc();
    window.addEventListener('resize', updateSrc);
  }
}

/**
 * Font loading optimization
 */
export class FontOptimizer {
  static preload(fonts: Array<{ name: string; url: string; format: string }>): void {
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = `font/${font.format}`;
      link.href = font.url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  static async loadFontFace(name: string, url: string, descriptors?: FontFaceDescriptors): Promise<void> {
    if ('fonts' in document) {
      const font = new FontFace(name, `url(${url})`, descriptors);
      await font.load();
      document.fonts.add(font);
    }
  }

  static useFontDisplay(strategy: 'auto' | 'block' | 'swap' | 'fallback' | 'optional' = 'swap'): void {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: ${strategy};
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Critical CSS extractor
 */
export class CriticalCSSExtractor {
  static extract(viewport: { width: number; height: number }): string {
    const styles: string[] = [];

    // Get all stylesheets
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules || []).forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            // Check if selector matches visible elements
            const elements = document.querySelectorAll(rule.selectorText);
            const hasVisibleElement = Array.from(elements).some(el => {
              const rect = el.getBoundingClientRect();
              return rect.top < viewport.height && rect.bottom > 0;
            });

            if (hasVisibleElement) {
              styles.push(rule.cssText);
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheets might throw
      }
    });

    return styles.join('\n');
  }

  static inline(css: string): void {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
}

// Global instances
export const chunkPrefetcher = new ChunkPrefetcher();
