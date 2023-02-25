import type { RulesManager, SelectorsManager, StyleManager } from './type';

export function createStyleManager(
  selectorsManager: SelectorsManager,
  rulesManager: RulesManager
): StyleManager {
  const selectorsCache = new Map<string, string>();

  function add(styleBlock: string) {
    const [main, ...others] = styleBlock.split('&');

    console.log = () => {};
    console.log(others, main);

    const selector = main
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