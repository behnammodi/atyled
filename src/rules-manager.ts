import { RulesManager } from './type';

export function createRulesManager(
  styleElement: HTMLStyleElement
): RulesManager {
  const selectors = new Set<string>();
  const atIndexes = new Map<string, number>();

  function assertCSSRulesIsAvailable(
    CSSRules?: CSSRuleList
  ): asserts CSSRules is CSSRuleList {
    if (!CSSRules) throw new Error('cssRules not available');
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

  function getStyleSheetWithTag(): string {
    return `<style>
${getStyleSheet()}
</style>`;
  }

  function createRule(
    selector: string,
    property: string,
    value: string,
    at?: string
  ): string {
    if (at) {
      return `${at} {${createRule(selector, property, value)}}`;
    }
    return `.${selector} {${property}: ${value};}`;
  }

  function addAt(
    selector: string,
    property: string,
    value: string,
    at: string = ''
  ) {
    const key = `${selector}${at}`;

    if (selectors.has(key)) {
      return;
    }

    const sheet = styleElement.sheet as CSSStyleSheet;

    const indexOfAt = atIndexes.get(at);

    if (indexOfAt !== undefined) {
      const rule = createRule(selector, property, value);
      const previousCSSText = sheet.cssRules[indexOfAt].cssText;
      const newCSSText: string =
        previousCSSText.substring(0, previousCSSText.length - 1) + rule + '}';

      sheet.deleteRule(indexOfAt);
      sheet.insertRule(newCSSText, indexOfAt);
    } else {
      const rule = createRule(selector, property, value, at);
      const index = sheet.insertRule(rule, sheet.cssRules.length);
      atIndexes.set(at, index);
    }

    selectors.add(key);
  }

  function addRule(selector: string, property: string, value: string) {
    const key = selector;

    if (selectors.has(key)) {
      return;
    }

    const sheet = styleElement.sheet as CSSStyleSheet;

    const rule = createRule(selector, property, value);

    sheet.insertRule(rule, sheet.cssRules.length);

    selectors.add(key);
  }

  function add(
    selector: string,
    property: string,
    value: string,
    at: string = ''
  ) {
    if (at) {
      return addAt(selector, property, value, at);
    }

    return addRule(selector, property, value);
  }

  return { add, getStyleSheetWithTag, getStyleSheet };
}
