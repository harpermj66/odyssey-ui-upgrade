import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  setData(key: string, data: string): void {
    localStorage.setItem(key, data);
  }

  getData(key: string): string {
    if (localStorage.getItem(key)) {
      return localStorage.getItem(key) as string;
    } else {
      return '';
    }
  }
}
