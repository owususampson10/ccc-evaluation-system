type CacheEntry<T> = {
    data: T;
    expiry: number;
};

class SimpleCache {
    private cache = new Map<string, CacheEntry<any>>();

    set<T>(key: string, data: T, ttlSeconds: number): void {
        const expiry = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { data, expiry });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

// Singleton instance
export const memoryCache = new SimpleCache();
