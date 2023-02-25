import type { RulesManager, SelectorsManager, StyleManager } from './type';

export function createStyleManager(
  selectorsManager: SelectorsManager,
  rulesManager: RulesManager
): StyleManager {
  const selectorsCache = new Map<string, string>();
  const beginBracket = "{";
  const endBracket = "}"
  const combinator = "&"

  function createSelectorAndRule(line: string, additionalSelector: string = ''): string{
    let [property, value] = line.split(':');
    property = property.trim();
    value = value.trim();

    const selector = selectorsManager.add(property, value, additionalSelector);

    rulesManager.add(`${selector}${additionalSelector}`, property, value);

    return selector;
  }

  function createLineByPlainString(plain: string): string[]{
    return plain.trim()
    .split(';')
    .filter(item => !!item)
  }

  function add(styleBlock: string) {
    const [mainStyleBlock, ...moreStyleBlocks] = styleBlock.split(combinator);

    const mainLines = createLineByPlainString(mainStyleBlock);    
    const mainSelector = mainLines.map(item => createSelectorAndRule(item))

    const moreSelectors = moreStyleBlocks
    .map(moreStyleBlock => {
      let [selector, styleBlock] = moreStyleBlock.split(beginBracket);
      selector = selector.trim();
      const moreLines = createLineByPlainString(styleBlock.replace(endBracket,""));
      const moreSelector = moreLines.map(item => createSelectorAndRule(item, selector));
      return moreSelector.join(' ');      
    })

    const selectors= [...mainSelector, ...moreSelectors].join(' ');

    return selectors;
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