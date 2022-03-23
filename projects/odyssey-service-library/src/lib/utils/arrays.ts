/**
 * Array utility class.
 */
export class Arrays {

  /**
   * Checks whether a value appears in an array.
   * If the array is undefined or null then this will return false.
   *
   * @param array The array to check.
   * @param value The value to look for.
   */
  public static contains(array: any[] | null | undefined, value: any | null | undefined): boolean {
    return !!array && array.indexOf(value) >= 0;
  }
}
