import type { RulesManager } from './type';

export function createRulesManager(
  styleElement: HTMLStyleElement
): RulesManager {
  const selectors = new Set<string>();

  function assertCSSRulesIsAvailable(
    CSSRules?: CSSRuleList
  ): asserts CSSRules is CSSRuleList {
    if (!CSSRules) throw 'cssRules not available';
  }

  function getStyleSheet(): string {
    const valueToReturn: string[] = [];
    const cssRules = styleElement.sheet?.cssRules;

    assertCSSRulesIsAvailable(cssRules);

    for (let cssRule in cssRules) {
      valueToReturn.push(cssRules[cssRule].cssText);
    }

    return valueToReturn.join('\n');
  }

  function getStyleSheetWithTags(): string {
    return `<style>
${getStyleSheet()}
</style>`;
  }

  function createRule(
    selector: string,
    property: string,
    value: string
  ): string {
    return `.${selector} {${property}: ${value};}`;
  }

  function add(selector: string, property: string, value: string) {
    if (selectors.has(selector)) {
      return;
    }

    const rule = createRule(selector, property, value);

    styleElement.sheet?.insertRule(rule, styleElement.sheet.cssRules.length);

    selectors.add(selector);
  }

  return { add, getStyleSheetWithTags, getStyleSheet };
}
