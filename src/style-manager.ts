import type { RulesManager, SelectorsManager, StyleManager } from './type';

export function createStyleManager(
  selectorsManager: SelectorsManager,
  rulesManager: RulesManager
): StyleManager {
  const selectorsCache = new Map<string, string>();
  const declarationBlockCache = new Map<string, string>();
  const declarationStart = '{';
  const declarationEnd = '}';
  const combinator = '&';

  function createSelectorAndRule(
    line: string,
    additionalSelector: string = ''
  ): string {
    let [property, value] = line.split(':');
    property = property.trim();
    value = value.trim();

    const selector = selectorsManager.add(property, value, additionalSelector);

    rulesManager.add(`${selector}${additionalSelector}`, property, value);

    return selector;
  }

  function createDeclarationFromDeclarationBlock(plain: string): string[] {
    return plain
      .trim()
      .split(';')
      .filter(item => !!item);
  }

  function add(declarationBlock: string): string {
    if (declarationBlockCache.has(declarationBlock)) {
      return declarationBlockCache.get(declarationBlock) as string;
    }

    const [
      mainDeclarationBlock,
      ...moreDeclarationBlocks
    ] = declarationBlock.split(combinator);

    const mainDeclarations = createDeclarationFromDeclarationBlock(
      mainDeclarationBlock
    );
    const mainSelectors = mainDeclarations.map(item =>
      createSelectorAndRule(item)
    );

    const moreSelectors = moreDeclarationBlocks.map(moreDeclarationBlock => {
      let [selector, declarationBlock] = moreDeclarationBlock.split(
        declarationStart
      );
      selector = selector.trim();
      const moreDeclarations = createDeclarationFromDeclarationBlock(
        declarationBlock.replace(declarationEnd, '')
      );
      return moreDeclarations
        .map(item => createSelectorAndRule(item, selector))
        .join(' ');
    });

    const selectors = [...mainSelectors, ...moreSelectors].join(' ');

    declarationBlockCache.set(declarationBlock, selectors);

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
