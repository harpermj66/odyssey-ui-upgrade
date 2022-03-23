/**
 * A changes history utility class.
 * Maintains a history of changes to an object.
 */
export class History<T> {
  private _versions: T[] = [];
  private _index = -1;

  constructor(original: T) {
    this.reset(original);
  }

  get versions(): T[] {
    return this._versions.slice();
  }

  get current(): T {
    return this._versions[this._index];
  }

  /**
   * Reset the history with a new baseline original version.
   * Will clear any history.
   *
   * @param originalVersion The new original version.
   */
  reset(originalVersion: T): void {
    this._versions = [originalVersion];
    this._index = 0;
  }

  addVersion(version: T): void {
    // Remove any  versions after this.
    this._versions = this._versions.slice(0, this._index);
    this._versions.push(JSON.parse(JSON.stringify(version)));
    this._index = this._versions.length - 1;
  }

  canForward(): boolean {
    return this._index < this._versions.length - 1;
  }

  forward(): T {
    if(this.canForward()) {
      this._index++;
    }
    return this.current;
  }

  canBack(): boolean {
    return this._index > 0;
  }

  back(): T {
    if(this.canBack()) {
      this._index--;
    }
    return this.current;
  }

  first(): T {
    this._index = 0;
    return this.current;
  }

  last(): T {
    this._index = this._versions.length - 1;
    return this.current;
  }
}
