import { SelectorsManager } from './type';

export function createSelectorsManager(): SelectorsManager {
  const properties = new Map<string, string>();
  const values = new Map<string, string>();

  let p = 0;
  let v = 0;

  function addPropertyIfNotExist(property: string): string {
    if (properties.has(property)) {
      return properties.get(property) as string;
    }

    const propertyKey = `p${p++}`;
    properties.set(property, propertyKey);

    return propertyKey;
  }

  function addValueIfNotExist(value: string): string {
    if (values.has(value)) {
      return values.get(value) as string;
    }

    const valueKey = `v${v++}`;
    values.set(value, valueKey);

    return valueKey;
  }

  function add(
    property: string,
    value: string,
    propertyAdditionalHint: string = ''
  ): string {
    const propertyKey = addPropertyIfNotExist(
      `${property}${propertyAdditionalHint}`
    );
    const valueKey = addValueIfNotExist(value);

    return `${propertyKey}${valueKey}`;
  }

  return { add };
}
