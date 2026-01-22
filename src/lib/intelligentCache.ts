/**
 * Intelligent Caching System v1.0
 *
 * Smart caching with:
 * - LRU (Least Recently Used) eviction
 * - TTL (Time To Live) expiration
 * - Size-based limits
 * - Priority-based retention
 * - Cache warming for common queries
 * - Performance metrics
 */

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  lastAccessed: number;
  accessCount: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  ttl: number; // milliseconds
  size: number; // approximate bytes
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  totalSize: number;
  entryCount: number;
  hitRate: number;
  averageAccessTime: number;
}

export class IntelligentCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxSize: number; // bytes
  private maxEntries: number;
  private metrics: CacheMetrics;
  private accessTimes: number[] = [];

  constructor(
    maxSizeMB: number = 50,
    maxEntries: number = 1000
  ) {
    this.maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    this.maxEntries = maxEntries;
    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalSize: 0,
      entryCount: 0,
      hitRate: 0,
      averageAccessTime: 0
    };

    // Clean expired entries every 5 minutes
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanExpired(), 5 * 60 * 1000);
    }
  }

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const startTime = performance.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.metrics.misses++;
      this.updateMetrics(startTime);
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.metrics.misses++;
      this.metrics.evictions++;
      this.updateMetrics(startTime);
      return null;
    }

    // Update access metadata
    entry.lastAccessed = Date.now();
    entry.accessCount++;
    this.metrics.hits++;
    this.updateMetrics(startTime);

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(
    key: string,
    value: T,
    options: {
      ttl?: number;
      priority?: CacheEntry<T>['priority'];
    } = {}
  ): void {
    const ttl = options.ttl || 60 * 60 * 1000; // Default 1 hour
    const priority = options.priority || 'medium';
    const size = this.estimateSize(value);

    // Check if we need to evict entries
    if (this.cache.size >= this.maxEntries || this.metrics.totalSize + size > this.maxSize) {
      this.evictEntries(size);
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
      priority,
      ttl,
      size
    };

    this.cache.set(key, entry);
    this.metrics.totalSize += size;
    this.metrics.entryCount = this.cache.size;
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.cache.delete(key);
    this.metrics.totalSize -= entry.size;
    this.metrics.entryCount = this.cache.size;
    return true;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.metrics.totalSize = 0;
    this.metrics.entryCount = 0;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check expiration
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get cache metrics
   */
  getMetrics(): CacheMetrics {
    const totalRequests = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate = totalRequests > 0 ? (this.metrics.hits / totalRequests) * 100 : 0;

    return { ...this.metrics };
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: string;
    entries: number;
    hitRate: string;
    topKeys: Array<{ key: string; accessCount: number; priority: string }>;
  } {
    const metrics = this.getMetrics();
    const topKeys = Array.from(this.cache.entries())
      .sort((a, b) => b[1].accessCount - a[1].accessCount)
      .slice(0, 10)
      .map(([key, entry]) => ({
        key,
        accessCount: entry.accessCount,
        priority: entry.priority
      }));

    return {
      size: `${(metrics.totalSize / 1024 / 1024).toFixed(2)} MB`,
      entries: metrics.entryCount,
      hitRate: `${metrics.hitRate.toFixed(1)}%`,
      topKeys
    };
  }

  /**
   * Warm cache with common queries
   */
  warmCache(entries: Array<{ key: string; value: T; priority?: CacheEntry<T>['priority'] }>): void {
    console.log(`[Cache] Warming cache with ${entries.length} entries`);

    for (const entry of entries) {
      this.set(entry.key, entry.value, {
        priority: entry.priority || 'high',
        ttl: 24 * 60 * 60 * 1000 // 24 hours for warm entries
      });
    }
  }

  /**
   * Evict entries based on LRU and priority
   */
  private evictEntries(neededSpace: number): void {
    const entries = Array.from(this.cache.entries());

    // Sort by: priority (ascending), lastAccessed (ascending), accessCount (ascending)
    entries.sort((a, b) => {
      const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
      const priorityDiff = priorityOrder[a[1].priority] - priorityOrder[b[1].priority];

      if (priorityDiff !== 0) return priorityDiff;

      const timeDiff = a[1].lastAccessed - b[1].lastAccessed;
      if (timeDiff !== 0) return timeDiff;

      return a[1].accessCount - b[1].accessCount;
    });

    let freedSpace = 0;
    let evicted = 0;

    // Evict entries until we have enough space
    for (const [key, entry] of entries) {
      if (entry.priority === 'critical') continue; // Never evict critical entries

      this.cache.delete(key);
      this.metrics.totalSize -= entry.size;
      freedSpace += entry.size;
      evicted++;

      if (freedSpace >= neededSpace && this.cache.size < this.maxEntries * 0.9) {
        break;
      }
    }

    this.metrics.evictions += evicted;
    this.metrics.entryCount = this.cache.size;

    console.log(`[Cache] Evicted ${evicted} entries, freed ${(freedSpace / 1024).toFixed(2)} KB`);
  }

  /**
   * Clean expired entries
   */
  private cleanExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        this.metrics.totalSize -= entry.size;
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.metrics.entryCount = this.cache.size;
      console.log(`[Cache] Cleaned ${cleaned} expired entries`);
    }
  }

  /**
   * Estimate size of value in bytes
   */
  private estimateSize(value: T): number {
    try {
      const json = JSON.stringify(value);
      return json.length * 2; // Approximate: 2 bytes per character (UTF-16)
    } catch {
      return 1024; // Default 1KB if can't estimate
    }
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(startTime: number): void {
    const accessTime = performance.now() - startTime;
    this.accessTimes.push(accessTime);

    // Keep only last 1000 access times
    if (this.accessTimes.length > 1000) {
      this.accessTimes.shift();
    }

    this.metrics.averageAccessTime =
      this.accessTimes.reduce((sum, time) => sum + time, 0) / this.accessTimes.length;
  }
}

/**
 * Global cache instances for different data types
 */
export const resumeAnalysisCache = new IntelligentCache<any>(30, 500); // 30MB, 500 entries
export const keywordCache = new IntelligentCache<any>(10, 1000); // 10MB, 1000 entries
export const seoCache = new IntelligentCache<any>(5, 200); // 5MB, 200 entries

/**
 * Generate cache key from parameters
 */
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${JSON.stringify(params[key])}`)
    .join('|');

  return `${prefix}:${sortedParams}`;
}

/**
 * Cache decorator for functions
 */
export function withCache<T extends (...args: any[]) => any>(
  cache: IntelligentCache<ReturnType<T>>,
  keyPrefix: string,
  ttl?: number
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Generate cache key from arguments
      const cacheKey = generateCacheKey(keyPrefix, { args });

      // Try to get from cache
      const cached = cache.get(cacheKey);
      if (cached !== null) {
        console.log(`[Cache] Hit: ${cacheKey}`);
        return cached;
      }

      // Execute original method
      console.log(`[Cache] Miss: ${cacheKey}`);
      const result = await originalMethod.apply(this, args);

      // Store in cache
      cache.set(cacheKey, result, { ttl });

      return result;
    };

    return descriptor;
  };
}

/**
 * Prefetch data into cache
 */
export async function prefetchToCache<T>(
  cache: IntelligentCache<T>,
  key: string,
  fetcher: () => Promise<T>,
  options?: { ttl?: number; priority?: CacheEntry<T>['priority'] }
): Promise<void> {
  try {
    const data = await fetcher();
    cache.set(key, data, options);
    console.log(`[Cache] Prefetched: ${key}`);
  } catch (error) {
    console.error(`[Cache] Prefetch failed for ${key}:`, error);
  }
}

/**
 * Batch cache operations
 */
export class BatchCache<T> {
  private pendingOps: Array<{ key: string; value: T; options?: any }> = [];
  private cache: IntelligentCache<T>;
  private batchSize: number;
  private flushInterval: number;
  private timer?: any;

  constructor(
    cache: IntelligentCache<T>,
    batchSize: number = 50,
    flushInterval: number = 1000
  ) {
    this.cache = cache;
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
  }

  /**
   * Add operation to batch
   */
  set(key: string, value: T, options?: any): void {
    this.pendingOps.push({ key, value, options });

    if (this.pendingOps.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  /**
   * Flush all pending operations
   */
  flush(): void {
    if (this.pendingOps.length === 0) return;

    console.log(`[BatchCache] Flushing ${this.pendingOps.length} operations`);

    for (const op of this.pendingOps) {
      this.cache.set(op.key, op.value, op.options);
    }

    this.pendingOps = [];

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}
