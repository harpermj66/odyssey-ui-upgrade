import {AsyncCacheLoader} from "./async-cache-loader";
import {Observable} from "rxjs";

/**
 * A cache for storing asynchronously loaded values, eg. HTTP request results.
 *
 *
 * T - The entity type the cache returns.
 *
 *
 * S - The type of the cache key, defaults to string, must implement a toString method that returns a string version of the key.
 */
export class AsyncCache<T, S extends {toString: () => string} = string> {
  private cacheMap: {[key: string]: AsyncCacheLoader<T>} = {};

  constructor(private loadingFunc: (key: S) => Observable<T>, private validForSeconds?: number) {
  }

  /**
   * Get the value for the given key.
   * If the value is not cached or has expired the value will be loaded.
   * @param key The cache key, must not be null.
   */
  public get(key: S): Observable<T> {
    return this.getLoader(key).get();
  }

  /**
   * Check if a specific cache entry has expired.
   * @param key The cache key, must not be null.
   */
  public expired(key: S): boolean {
    return this.getLoader(key).expired();
  }

  /**
   * Clear a cache entry, or all entries if key is no provided.
   * @param key The cache key to clear, if none is provided then all keys are cleared.
   */
  public clear(key?: S): void {
    if(key !== null && key !== undefined) {
      this.getLoader(key).clear();
    } else {
      Object.getOwnPropertyNames(this.cacheMap).forEach(
        cacheKey => this.cacheMap[cacheKey].clear()
      );
    }
  }

  private getLoader(key: S): AsyncCacheLoader<T> {
    const keyString = key.toString();
    let cacheLoader = this.cacheMap[keyString];
    if(!cacheLoader) {
      cacheLoader = new AsyncCacheLoader(() => this.loadingFunc(key), this.validForSeconds);
      this.cacheMap[keyString] = cacheLoader;
    }
    return cacheLoader;
  }
}
