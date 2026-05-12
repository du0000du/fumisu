/**
 * クライアントサイド クエリキャッシュ
 * Client Components での重複 Supabase リクエストを排除する。
 * TTL内ならキャッシュ値を返し、inflight 中の同一キーは Promise を共有する。
 */

type CacheEntry<T> = {
  data: T
  fetchedAt: number
}

const CACHE_TTL_MS = 30_000 // 30秒

class QueryCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private inflight = new Map<string, Promise<unknown>>()

  async get<T>(key: string, fetcher: () => Promise<T>, ttl = CACHE_TTL_MS): Promise<T> {
    const now = Date.now()
    const cached = this.cache.get(key)
    if (cached && now - cached.fetchedAt < ttl) {
      return cached.data as T
    }

    if (this.inflight.has(key)) {
      return this.inflight.get(key) as Promise<T>
    }

    const promise = fetcher()
      .then((data) => {
        this.cache.set(key, { data, fetchedAt: Date.now() })
        this.inflight.delete(key)
        return data
      })
      .catch((err) => {
        this.inflight.delete(key)
        throw err
      })

    this.inflight.set(key, promise)
    return promise
  }

  /** キー（前方一致）でキャッシュを無効化 */
  invalidate(keyPrefix: string) {
    for (const key of Array.from(this.cache.keys())) {
      if (key.startsWith(keyPrefix)) this.cache.delete(key)
    }
  }

  clear() {
    this.cache.clear()
    this.inflight.clear()
  }
}

export const queryCache = new QueryCache()
