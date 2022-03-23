export class Flatten {
  private static readonly TYPE_OBJ = typeof {};

  /**
   * Flatten an object to a string indexed map with '.' separated propnames.
   * @param obj The object to flatten.
   */
  public static flatten(obj: any): {[fieldName: string]: any} {
   return Flatten.flattenInternal(obj, []);
  }

  private static flattenInternal(obj: any, processedObjs: {}[]): {[fieldName: string]: any}  {
    const flatObj: {[fieldName: string]: any} = {};

    // Keep track of what has been processed to prevent looping.
    if(typeof obj === Flatten.TYPE_OBJ) {
      processedObjs.push(obj);
    }

    Object.getOwnPropertyNames(obj).forEach(propName => {
      const propValue = obj[propName];
      if(propValue && !Array.isArray(propValue) && typeof propValue === Flatten.TYPE_OBJ) {
        const propValueFlat = Flatten.flattenInternal(propValue, processedObjs);

        Object.getOwnPropertyNames(propValueFlat).forEach(innerPropName => {
          flatObj[propName + '.' + innerPropName] = propValueFlat[innerPropName];
        });
      } else {
        flatObj[propName] = propValue;
      }
    });

    return flatObj;
  }
}
