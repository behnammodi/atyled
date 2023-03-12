import { Element } from 'stylis';
import { RulesManager, SelectorsManager, StyleManager } from './type';

export function createStyleManager(): StyleManager {
  const selectorsCache = new Map<string, string>();
  const declarationBlockCache = new Map<Element[], string>();

  function extractElements(elements: Element[]) {
    const decl = [];
    const rule = [];
    const at = [];

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const type = element.type;

      if (type === 'decl') {
        decl.push(element);
      } else if (type === 'rule') {
        rule.push(element);
      } else if (type === '@media') {
        at.push(element);
      }
    }

    return [decl, rule, at];
  }

  function attache({
    rulesManager,
    selectorsManager,
  }: {
    rulesManager: RulesManager;
    selectorsManager: SelectorsManager;
  }) {
    function createMainSelectors(mainDeclarations: Element[]) {
      return mainDeclarations.map(mainDeclaration => {
        const property = mainDeclaration.props as string;
        const value = mainDeclaration.children as string;
        const selector = selectorsManager.add(property, value);
        rulesManager.add(selector, property, value);
        return selector;
      });
    }

    /**
     * at for nested rule inside @media ex:
     * a:b;
     * &::before {
     *  c:a;
     * }
     * @media (max:300px){
     *  &::before {
     *    c:b;
     *  }
     * }
     */
    function createRuleSelectors(ruleDeclarations: Element[], at: string = '') {
      return ruleDeclarations.map(pseudoDeclarationBlock => {
        const additionalSelectorOrPseudo = pseudoDeclarationBlock.value.replace(
          '&\f',
          ''
        );
        const selectors: string[] = [];
        for (let i = 0; i < pseudoDeclarationBlock.children.length; i++) {
          const declaration = pseudoDeclarationBlock.children[i] as Element;
          if (declaration.type !== 'decl') continue;
          const property = declaration.props as string;
          const value = declaration.children as string;
          const selector = selectorsManager.add(
            `${at}${property}`,
            value,
            additionalSelectorOrPseudo
          );

          rulesManager.add(
            `${selector}${additionalSelectorOrPseudo}`,
            property,
            value,
            at
          );

          selectors.push(selector);
        }
        return selectors.join(' ');
      });
    }

    function createAtSelectors(atDeclarations: Element[]) {
      return atDeclarations.map(atDeclarationBlock => {
        const at = atDeclarationBlock.value;
        const selectors: string[] = [];
        for (let i = 0; i < atDeclarationBlock.children.length; i++) {
          const declaration = atDeclarationBlock.children[i] as Element;
          if (declaration.type === 'decl') {
            const property = declaration.props as string;
            const value = declaration.children as string;
            const selector = selectorsManager.add(`${at}${property}`, value);
            rulesManager.add(selector, property, value, at);
            selectors.push(selector);
          } else if (declaration.type === 'rule') {
            /**
             * handle rule inside @media ex:
             * * @media (max:300px){
             *  &::before {
             *    c:b;
             *  }
             * }
             */
            const selector = createRuleSelectors([declaration], at);
            selectors.push(selector.join(' '));
          }
        }
        return selectors.join(' ');
      });
    }

    function add(declarationBlock: Element[]): string {
      if (declarationBlockCache.has(declarationBlock)) {
        return declarationBlockCache.get(declarationBlock) as string;
      }

      const [
        mainDeclarations,
        ruleDeclarations,
        atDeclarations,
      ] = extractElements(declarationBlock);

      const mainSelectors = createMainSelectors(mainDeclarations);
      const ruleSelectors = createRuleSelectors(ruleDeclarations);
      const atSelectors = createAtSelectors(atDeclarations);

      const selectors = [
        ...mainSelectors,
        ...ruleSelectors,
        ...atSelectors,
      ].join(' ');

      declarationBlockCache.set(declarationBlock, selectors);

      return selectors;
    }

    return { add };
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

  return { attache, cleanUpSelectors };
}
