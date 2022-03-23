import {Observable, of, throwError} from "rxjs";
import {catchError, map, share} from "rxjs/operators";

/**
 * A loading cache for asynchronously loaded data, eg. HTTP request results.
 */
export class AsyncCacheLoader<T> {
  private cachedValue?: T;
  private cachedAtSeconds?: number;
  private observable?: Observable<T>;

  /**
   * Create an async cache.
   *
   * @param loadFunc The async function that loads the required data.
   * @param validForSeconds The time (in seconds) that the cache is valid for, if not specified then the cache does not expire.
   */
  constructor(private loadFunc: () => Observable<T>, private validForSeconds?: number) {
  }

  /**
   * Get the value.
   * If the value is cached and not expired then this will be returned.
   * Else the value must be loaded asynchronously.
   */
  public get(): Observable<T> {
    let obs: Observable<T>;
    if(this.cachedValue !== null && this.cachedValue !== undefined && !this.expired()) {
      obs = of(this.cachedValue);
    } else {
      if(!this.observable) {
        this.observable = this.loadFunc()
          .pipe(
            map(
              value => {
                this.cachedValue = value;
                this.cachedAtSeconds = Date.now()/1000;
                return value;
              }
            ),
            catchError(
              error => {
                delete this.observable;
                return throwError(error);
              }
            ),
            share()
          );
        obs = this.observable;
      }
      obs = this.observable;
    }
    return obs;
  }

  public expired(): boolean {
    return !!this.validForSeconds && !!this.cachedAtSeconds && (Date.now()/1000 > this.validForSeconds + this.cachedAtSeconds);
  }

  public clear(): void {
    delete this.cachedValue;
    delete this.cachedAtSeconds;
  }
}
