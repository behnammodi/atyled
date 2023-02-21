import { RulesManager, SelectorsManager, StyleManager } from './type';

export function createRulesManager(
  styleElement: HTMLStyleElement
): RulesManager {
  const selectors = new Set<string>();

  function createRule(
    className: string,
    property: string,
    value: string
  ): string {
    return `.${className} {${property}: ${value};}`;
  }

  function add(selector: string, property: string, value: string) {
    if (selectors.has(selector)) {
      return;
    }

    const rule = createRule(selector, property, value);

    styleElement.sheet?.insertRule(rule, styleElement.sheet.cssRules.length);

    selectors.add(selector);
  }

  return { add };
}

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

  function add(property: string, value: string) {
    const propertyKey = addPropertyIfNotExist(property);
    const valueKey = addValueIfNotExist(value);

    return `${propertyKey}${valueKey}`;
  }

  return { add };
}

export function createStyleManager(
  selectorsManager: SelectorsManager,
  rulesManager: RulesManager
): StyleManager {
  const selectorsCache = new Map<string, string>();

  function add(styleBlock: string) {
    const selector = styleBlock
      .trim()
      .split(';')
      .filter(item => !!item)
      .map(item => {
        let [property, value] = item.split(':');

        property = property.trim();
        value = value.trim();

        const selector = selectorsManager.add(property, value);

        rulesManager.add(selector, property, value);

        return selector;
      })
      .join(' ');

    return selector;
  }

  function cleanUpSelectors(selectors: string): string {
    if (selectorsCache.has(selectors)) {
      return selectorsCache.get(selectors) as string;
    }

    const selectorsArray = selectors.split(' ');

    for (let i = selectorsArray.length - 1; i >= 0; i--) {
      const a = selectorsArray[i];
      if (a === '') {
        continue;
      }
      for (let j = i - 1; j >= 0; j--) {
        if (selectorsArray[j] === '') {
          continue;
        }

        const [keyA] = a.split('v');
        const [keyB] = selectorsArray[j].split('v');

        if (keyA === keyB) {
          selectorsArray[j] = '';
        }
      }
    }

    const valueToReturn = selectorsArray.filter(s => !!s).join(' ');

    selectorsCache.set(selectors, valueToReturn);

    return valueToReturn;
  }

  return { add, cleanUpSelectors };
}
