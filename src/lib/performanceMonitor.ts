/**
 * Frontend Performance Monitoring
 * Track page load times, component render times, and user interactions
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;

  /**
   * Record a custom metric
   */
  record(name: string, value: number, metadata?: Record<string, any>) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      metadata,
    });

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Measure execution time of a function
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - start;

      this.record(name, duration, metadata);

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(name, duration, {
        ...metadata,
        error: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  /**
   * Get average metric value
   */
  getAverage(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Get percentile value
   */
  getPercentile(name: string, percentile: number): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;

    const sorted = metrics.map(m => m.value).sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;

    return sorted[Math.max(0, index)];
  }

  /**
   * Get performance summary
   */
  getSummary(): Record<string, {
    count: number;
    avg: number;
    min: number;
    max: number;
    p50: number;
    p95: number;
    p99: number;
  }> {
    const summary: Record<string, any> = {};
    const uniqueNames = [...new Set(this.metrics.map(m => m.name))];

    for (const name of uniqueNames) {
      const values = this.getMetricsByName(name).map(m => m.value);
      const sorted = [...values].sort((a, b) => a - b);

      summary[name] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)],
      };
    }

    return summary;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
  }

  /**
   * Track page load performance using Navigation Timing API
   */
  trackPageLoad() {
    if (typeof window === 'undefined') return;

    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (!navigationTiming) return;

    // DNS lookup time
    this.record(
      'page_load.dns',
      navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart
    );

    // TCP connection time
    this.record(
      'page_load.tcp',
      navigationTiming.connectEnd - navigationTiming.connectStart
    );

    // Request time
    this.record(
      'page_load.request',
      navigationTiming.responseStart - navigationTiming.requestStart
    );

    // Response time
    this.record(
      'page_load.response',
      navigationTiming.responseEnd - navigationTiming.responseStart
    );

    // DOM processing time
    this.record(
      'page_load.dom_processing',
      navigationTiming.domComplete - navigationTiming.domInteractive
    );

    // Total page load time
    this.record(
      'page_load.total',
      navigationTiming.loadEventEnd - navigationTiming.fetchStart
    );

    // First Contentful Paint
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcp) {
      this.record('page_load.fcp', fcp.startTime);
    }

    // Largest Contentful Paint
    const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
    if (lcp) {
      this.record('page_load.lcp', (lcp as any).startTime);
    }
  }

  /**
   * Track resource loading times
   */
  trackResources() {
    if (typeof window === 'undefined') return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    for (const resource of resources) {
      const duration = resource.responseEnd - resource.startTime;

      this.record('resource_load', duration, {
        url: resource.name,
        type: resource.initiatorType,
        size: resource.transferSize,
      });
    }
  }

  /**
   * Track long tasks (> 50ms)
   */
  observeLongTasks() {
    if (typeof window === 'undefined') return;
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.record('long_task', entry.duration, {
            startTime: entry.startTime,
          });
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task observation not supported
      console.warn('Long task observation not supported:', e);
    }
  }

  /**
   * Track user interactions
   */
  trackInteraction(eventType: string, target: string) {
    const start = performance.now();

    // Use requestIdleCallback to measure after interaction completes
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        const duration = performance.now() - start;
        this.record('interaction', duration, {
          eventType,
          target,
        });
      });
    }
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      metrics: this.metrics,
      summary: this.getSummary(),
    }, null, 2);
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-track page load on browser
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.trackPageLoad();
      performanceMonitor.trackResources();
    }, 0);
  });

  // Observe long tasks
  performanceMonitor.observeLongTasks();
}

// Hook for React components
export function usePerformance(name: string) {
  const start = performance.now();

  return () => {
    const duration = performance.now() - start;
    performanceMonitor.record(`component.${name}`, duration);
  };
}
