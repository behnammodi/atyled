import { RulesManager, SelectorsManager, StyleManager } from './type';
import {
  createSingleDeclarationFromDeclarationBlock,
  extractPseudoAndAtRules,
} from './style-manager-utils';

export function createStyleManager(
  selectorsManager: SelectorsManager,
  rulesManager: RulesManager
): StyleManager {
  const selectorsCache = new Map<string, string>();
  const declarationBlockCache = new Map<string, string>();
  const declarationStart = '{';
  const declarationEnd = '}';

  function extractPropertyAndValue(declaration: string) {
    let [property, value] = declaration.split(':');
    property = property.trim();
    value = value.trim();

    return [property, value];
  }

  function createSelectorAndRuleForMainDeclarationAndPseudo(
    declaration: string,
    additionalSelectorOrPseudo: string = ''
  ): string {
    let [property, value] = extractPropertyAndValue(declaration);

    const selector = selectorsManager.add(
      property,
      value,
      additionalSelectorOrPseudo
    );

    rulesManager.add(
      `${selector}${additionalSelectorOrPseudo}`,
      property,
      value
    );

    return selector;
  }

  function createSelectorAndRuleForAtDeclaration(
    declaration: string,
    at: string = ''
  ): string {
    let [property, value] = extractPropertyAndValue(declaration);

    const selector = selectorsManager.add(`${property}${at}`, value);

    rulesManager.add(selector, property, value, at);

    return selector;
  }

  function createMainDeclarationSelector(
    mainDeclarationBlock: string
  ): string[] {
    /**
     * convert declaration block to single declarations:
     *  a: b;
     *  c: d;
     *
     * to:
     *
     * mainDeclarations: ["a:b", "c:d"]
     */
    const mainDeclarations = createSingleDeclarationFromDeclarationBlock(
      mainDeclarationBlock
    );

    /**
     * create class names and rules based on declarations:
     * ["a:b", "c:d"]
     *
     * to
     *
     * p0v0 p1v1
     */
    const mainSelectors = mainDeclarations.map(item =>
      createSelectorAndRuleForMainDeclarationAndPseudo(item)
    );

    return mainSelectors;
  }

  function createPseudoDeclarationSelector(
    pseudoDeclarationBlocks: string[]
  ): string[] {
    return pseudoDeclarationBlocks.map(pseudoDeclarationBlock => {
      /**
       * split to selector sign and declaration block by
       * declarationStart: `{`
       *
       * `:hover {
       *    a: c;
       *  }`
       *
       * to:
       *
       * selector: `:hover`
       * declarationBlock: `
       *   a: c;
       * }`
       */
      let [selector, declarationBlock] = pseudoDeclarationBlock.split(
        declarationStart
      );

      /**
       * clean up selector left right spaces and & sign
       */
      selector = selector.substring(1).trim();

      /**
       * remove declarationEnd from declarationBlock
       * declarationEnd: `}`
       *
       * declarationBlock: `
       *   a: c;
       * }`
       *
       * to:
       *
       * declarationBlock: `
       *   a: c;
       * `
       */
      declarationBlock = declarationBlock.replace(declarationEnd, '');

      /**
       * create declarations from declarationBlock;
       *
       * declarationBlock: `
       *   a: c;
       * `
       *
       * pseudoDeclarations: [
       *   "a:c"
       * ]
       */
      const pseudoDeclarations = createSingleDeclarationFromDeclarationBlock(
        declarationBlock
      );

      return pseudoDeclarations
        .map(declaration =>
          createSelectorAndRuleForMainDeclarationAndPseudo(
            declaration,
            selector
          )
        )
        .join(' ');
    });
  }

  function createAtDeclarationSelector(
    atDeclarationBlocks: string[]
  ): string[] {
    return atDeclarationBlocks.map(atDeclarationBlock => {
      console.log(atDeclarationBlock);

      let [at, declarationBlock] = atDeclarationBlock.split(declarationStart);

      at = at.trim();

      declarationBlock = declarationBlock.replace(declarationEnd, '');

      const declarations = createSingleDeclarationFromDeclarationBlock(
        declarationBlock
      );

      return declarations
        .map(declaration =>
          createSelectorAndRuleForAtDeclaration(declaration, at)
        )
        .join(' ');
    });
  }

  function add(declarationBlock: string): string {
    if (declarationBlockCache.has(declarationBlock)) {
      return declarationBlockCache.get(declarationBlock) as string;
    }

    /**
     * here we are going to split declaration block to 2 parts
     * const X = styled.div`
     *  a: b;
     *  c: d;
     *
     *  &:hover {
     *    a: c;
     *  }
     *
     *  &::before {
     *    b: c
     *  }
     *
     *  & > div {
     *    c: d
     *  }
     * `
     *
     * to:
     *
     * mainDeclarationBlock: `
     *  a: b;
     *  c: d;
     * `
     *
     * pseudoDeclarationBlocks: [
     * `&:hover {
     *    a: c;
     *  }`,
     * `&::before {
     *    b: c
     *  }`,
     *  `& > div {
     *    c: d
     *  }`,
     * ]
     */

    const [
      mainDeclarationBlock,
      pseudoDeclarationBlocks,
      atDeclarationBlocks,
    ] = extractPseudoAndAtRules(declarationBlock);

    console.log({ atDeclarationBlocks });

    const selectors = [
      ...createMainDeclarationSelector(mainDeclarationBlock),
      ...createPseudoDeclarationSelector(pseudoDeclarationBlocks),
      ...createAtDeclarationSelector(atDeclarationBlocks),
    ].join(' ');

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
