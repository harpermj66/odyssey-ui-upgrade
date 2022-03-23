export class FindModel {
  constructor(public search: string, public fields: string, public sort: string,
              public page: number, public size: number, public group: string = '', public sums: string = '') {
  }

  sortMap(): string[] {
    if (this.sort != null && this.sort.length > 0) {
      const split = this.sort.split(",");
      return split.map(val => val.trim());
    } else {
      return [];
    }
  }

  removeSort(index: number, current: string[]): string[] {
    current.splice(index,2);
    return current;
  }

  replaceSort(index: number, direction: string, current: string[]): string[]  {
    current[index + 1] = direction;
    return current;
  }

  updateSort(current: string[]): void  {
    this.sort = '';
    if (current.length > 0) {
      for (const val of current) {
        this.sort = this.sort + val + ",";
      }
      this.sort = this.sort.substr(0, this.sort.length - 1);
    }
  }

  regeneratorSort(key: string, direction: string): void {
    let current = this.sortMap();
    if (direction === '') {
      // remove if exists
      const index = current.indexOf(key,0);
      if (index !== -1) {
        current = this.removeSort(index, current);
      }
    }
    else {
      // replace if exists
      const index = current.indexOf(key,0);
      if (index !== -1) {
        current = this.replaceSort(index, direction, current);
      } else {
        // add the sort
        current.push(key, direction);
      }
    }
    this.updateSort(current);
  }
}
