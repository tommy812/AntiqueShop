interface CacheItem<T> {
  value: T;
  expiry: number;
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param value - Value to store
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
    
    // Schedule cleanup after TTL
    setTimeout(() => {
      this.remove(key);
    }, ttl);
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    // Return null if item doesn't exist or is expired
    if (!item || Date.now() > item.expiry) {
      if (item) this.remove(key);
      return null;
    }
    
    return item.value as T;
  }

  /**
   * Remove an item from the cache
   * @param key - Cache key
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of items in the cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get all keys in the cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Check if a key exists and is not expired
   * @param key - Cache key
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    return !!item && Date.now() <= item.expiry;
  }
}

// Singleton instance
const cacheService = new CacheService();
export default cacheService; 