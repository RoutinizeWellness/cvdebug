/**
 * Advanced Caching Strategies
 * Multi-layer caching for optimal performance
 */

/**
 * Multi-level cache with memory and localStorage
 */
export class MultiLevelCache<T> {
  private memoryCache = new Map<string, { data: T; timestamp: number; hits: number }>();
  private memoryMaxSize: number;
  private ttl: number;
  private storageKey: string;

  constructor(options: {
    memoryMaxSize?: number;
    ttl?: number;
    storageKey: string;
  }) {
    this.memoryMaxSize = options.memoryMaxSize || 100;
    this.ttl = options.ttl || 3600000; // 1 hour default
    this.storageKey = options.storageKey;

    // Load from localStorage on init
    this.loadFromStorage();
  }

  /**
   * Get value from cache (memory first, then localStorage)
   */
  get(key: string): T | null {
    // Try memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry) {
      if (Date.now() - memoryEntry.timestamp < this.ttl) {
        memoryEntry.hits++;
        return memoryEntry.data;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Try localStorage
    try {
      const storageData = localStorage.getItem(`${this.storageKey}:${key}`);
      if (storageData) {
        const parsed = JSON.parse(storageData);
        if (Date.now() - parsed.timestamp < this.ttl) {
          // Promote to memory cache
          this.memoryCache.set(key, {
            data: parsed.data,
            timestamp: parsed.timestamp,
            hits: 1
          });
          return parsed.data;
        } else {
          localStorage.removeItem(`${this.storageKey}:${key}`);
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }

    return null;
  }

  /**
   * Set value in both memory and localStorage
   */
  set(key: string, data: T): void {
    const entry = {
      data,
      timestamp: Date.now(),
      hits: 0
    };

    // Memory cache with LRU eviction
    if (this.memoryCache.size >= this.memoryMaxSize) {
      this.evictLRU();
    }
    this.memoryCache.set(key, entry);

    // localStorage (with error handling for quota exceeded)
    try {
      localStorage.setItem(
        `${this.storageKey}:${key}`,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      // Clear old items if quota exceeded
      this.clearOldStorageItems();
    }
  }

  /**
   * Delete from both caches
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(`${this.storageKey}:${key}`);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear();
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${this.storageKey}:`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Evict least recently used item
   */
  private evictLRU(): void {
    let minHits = Infinity;
    let lruKey: string | null = null;

    this.memoryCache.forEach((entry, key) => {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        lruKey = key;
      }
    });

    if (lruKey) {
      this.memoryCache.delete(lruKey);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${this.storageKey}:`)) {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            if (Date.now() - parsed.timestamp < this.ttl) {
              const cacheKey = key.replace(`${this.storageKey}:`, '');
              this.memoryCache.set(cacheKey, {
                data: parsed.data,
                timestamp: parsed.timestamp,
                hits: 0
              });
            } else {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  /**
   * Clear old storage items when quota exceeded
   */
  private clearOldStorageItems(): void {
    try {
      const items: Array<{ key: string; timestamp: number }> = [];
      const keys = Object.keys(localStorage);

      keys.forEach(key => {
        if (key.startsWith(`${this.storageKey}:`)) {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            items.push({ key, timestamp: parsed.timestamp });
          }
        }
      });

      // Sort by timestamp and remove oldest 25%
      items.sort((a, b) => a.timestamp - b.timestamp);
      const toRemove = Math.ceil(items.length * 0.25);
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(items[i].key);
      }
    } catch (error) {
      console.error('Error clearing old storage items:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    memorySize: number;
    totalHits: number;
    avgHits: number;
    oldestEntry: number | null;
  } {
    let totalHits = 0;
    let oldestTimestamp = Date.now();

    this.memoryCache.forEach(entry => {
      totalHits += entry.hits;
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
      }
    });

    return {
      memorySize: this.memoryCache.size,
      totalHits,
      avgHits: this.memoryCache.size > 0 ? totalHits / this.memoryCache.size : 0,
      oldestEntry: this.memoryCache.size > 0 ? oldestTimestamp : null
    };
  }
}

/**
 * Request deduplication cache
 * Prevents duplicate concurrent requests
 */
export class RequestCache<T> {
  private pending = new Map<string, Promise<T>>();
  private results = new Map<string, { data: T; timestamp: number }>();
  private ttl: number;

  constructor(ttl: number = 60000) {
    this.ttl = ttl;
  }

  /**
   * Execute request with deduplication
   */
  async fetch(key: string, fetcher: () => Promise<T>): Promise<T> {
    // Return cached result if fresh
    const cached = this.results.get(key);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }

    // Return pending request if exists
    const pending = this.pending.get(key);
    if (pending) {
      return pending;
    }

    // Execute new request
    const promise = fetcher()
      .then(data => {
        this.results.set(key, { data, timestamp: Date.now() });
        this.pending.delete(key);
        return data;
      })
      .catch(error => {
        this.pending.delete(key);
        throw error;
      });

    this.pending.set(key, promise);
    return promise;
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    this.results.delete(key);
    this.pending.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.results.clear();
    this.pending.clear();
  }
}

/**
 * Time-based cache with automatic cleanup
 */
export class TimedCache<T> {
  private cache = new Map<string, { data: T; expiresAt: number }>();
  private cleanupInterval: number;
  private cleanupTimer?: number;

  constructor(options: { cleanupInterval?: number } = {}) {
    this.cleanupInterval = options.cleanupInterval || 60000; // 1 minute
    this.startCleanup();
  }

  /**
   * Set value with TTL
   */
  set(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl
    });
  }

  /**
   * Get value if not expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() < entry.expiresAt) {
      return entry.data;
    }

    this.cache.delete(key);
    return null;
  }

  /**
   * Delete entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Start automatic cleanup
   */
  private startCleanup(): void {
    this.cleanupTimer = window.setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now >= entry.expiresAt) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.cache.delete(key));

    if (expiredKeys.length > 0) {
      console.log(`[TimedCache] Cleaned up ${expiredKeys.length} expired entries`);
    }
  }

  /**
   * Stop cleanup timer
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Memoization decorator for expensive functions
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    maxSize?: number;
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
  } = {}
): T {
  const cache = new Map<string, { result: ReturnType<T>; timestamp: number }>();
  const maxSize = options.maxSize || 100;
  const ttl = options.ttl || Infinity;
  const keyGen = options.keyGenerator || ((...args: any[]) => JSON.stringify(args));

  return ((...args: Parameters<T>) => {
    const key = keyGen(...args);
    const cached = cache.get(key);

    if (cached && (ttl === Infinity || Date.now() - cached.timestamp < ttl)) {
      return cached.result;
    }

    const result = fn(...args);

    // Evict oldest if at capacity
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value as string;
      cache.delete(oldestKey);
    }

    cache.set(key, { result, timestamp: Date.now() });
    return result;
  }) as T;
}

/**
 * Cache warming utility
 */
export class CacheWarmer {
  private warmers = new Map<string, () => Promise<void>>();

  /**
   * Register a cache warmer function
   */
  register(name: string, warmer: () => Promise<void>): void {
    this.warmers.set(name, warmer);
  }

  /**
   * Warm specific cache
   */
  async warm(name: string): Promise<void> {
    const warmer = this.warmers.get(name);
    if (!warmer) {
      console.warn(`[CacheWarmer] No warmer registered for: ${name}`);
      return;
    }

    try {
      await warmer();
      console.log(`[CacheWarmer] Successfully warmed cache: ${name}`);
    } catch (error) {
      console.error(`[CacheWarmer] Failed to warm cache ${name}:`, error);
    }
  }

  /**
   * Warm all caches
   */
  async warmAll(): Promise<void> {
    console.log(`[CacheWarmer] Warming ${this.warmers.size} caches...`);
    const results = await Promise.allSettled(
      Array.from(this.warmers.entries()).map(([name, warmer]) =>
        warmer().then(() => name)
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    console.log(`[CacheWarmer] Warmed ${successful}/${this.warmers.size} caches`);
  }

  /**
   * Schedule periodic cache warming
   */
  schedule(intervalMs: number): () => void {
    const intervalId = setInterval(() => {
      this.warmAll();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }
}

// Global cache instances
export const mlCache = new MultiLevelCache<any>({
  storageKey: 'ml-predictions',
  memoryMaxSize: 500,
  ttl: 3600000 // 1 hour
});

export const apiCache = new RequestCache<any>(60000); // 1 minute

export const metadataCache = new TimedCache<any>({
  cleanupInterval: 300000 // 5 minutes
});

export const cacheWarmer = new CacheWarmer();
