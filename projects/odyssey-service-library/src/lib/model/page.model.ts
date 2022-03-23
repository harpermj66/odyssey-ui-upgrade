export class PageModel<T> {
  content?: T[] | null;
  totalPages: number;
  totalElements: number;
  number: number;
  numberOfElements: number;
}
