/**
 * API Response Cache Utility
 * Implements client-side caching for API responses with TTL
 *
 * Usage:
 * const cache = new ApiCache();
 * cache.set('key', data, 300000); // 5 minutes
 * const data = cache.get('key');
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class ApiCache {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number; // 5 minutes default

  constructor(defaultTTL: number = 300000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Set a cache entry with TTL
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    if (!key) {
      console.warn('Cache key is required');
      return;
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Get a cache entry if it exists and hasn't expired
   * @param key - Cache key
   * @returns Cached data or null
   */
  get<T>(key: string): T | null {
    if (!key) {
      return null;
    }

    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if a key exists in cache and is valid
   * @param key - Cache key
   * @returns True if key exists and hasn't expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a specific cache entry
   * @param key - Cache key to delete
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size (number of entries)
   * @returns Number of cached entries
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get all cache keys
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   * @returns Cache statistics object
   */
  stats(): {
    totalEntries: number;
    keys: string[];
    sizes: Record<string, string>;
  } {
    const stats = {
      totalEntries: this.cache.size,
      keys: Array.from(this.cache.keys()),
      sizes: {} as Record<string, string>,
    };

    for (const key of stats.keys) {
      const entry = this.cache.get(key);
      if (entry) {
        const size = JSON.stringify(entry.data).length;
        stats.sizes[key] = this.formatBytes(size);
      }
    }

    return stats;
  }

  /**
   * Format bytes to human-readable format
   * @param bytes - Number of bytes
   * @returns Formatted string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

// Create a singleton instance for the application
export const apiCache = new ApiCache();

/**
 * Cache key builder for consistent cache keys
 */
export const cacheKeys = {
  adminApprovals: (page: number, limit: number) => `admin:approvals:${page}:${limit}`,
  adminUsers: (page: number, limit: number) => `admin:users:${page}:${limit}`,
  adminStats: () => `admin:stats`,
  analyticsDashboard: (startDate: string, endDate: string) => `analytics:dashboard:${startDate}:${endDate}`,
  analyticsCampaigns: (page: number, limit: number, startDate: string, endDate: string) =>
    `analytics:campaigns:${page}:${limit}:${startDate}:${endDate}`,
  analyticsInfluencers: (page: number, limit: number, startDate: string, endDate: string) =>
    `analytics:influencers:${page}:${limit}:${startDate}:${endDate}`,
  metaAccounts: () => `meta:accounts`,
  metaDashboard: () => `meta:dashboard`,
  metaInsights: (campaignId: string, startDate: string, endDate: string) =>
    `meta:insights:${campaignId}:${startDate}:${endDate}`,
  metaMetrics: (campaignId: string, startDate: string, endDate: string) =>
    `meta:metrics:${campaignId}:${startDate}:${endDate}`,
};

/**
 * Clear cache for a specific section
 */
export const clearCacheSection = (section: 'admin' | 'analytics' | 'meta' | 'all') => {
  const keys = apiCache.keys();

  if (section === 'all') {
    apiCache.clear();
    return;
  }

  for (const key of keys) {
    if (key.startsWith(section)) {
      apiCache.delete(key);
    }
  }
};
