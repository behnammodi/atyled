import { RulesManager, StyleElement } from './type';

export function createRulesManager(styleElement: StyleElement): RulesManager {
  const selectors = new Set<string>();
  const atIndexes = new Map<string, number>();

  function getStyleSheet(): string {
    return styleElement.cssRules.map(cssRule => cssRule.cssText).join('\n');
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

    const indexOfAt = atIndexes.get(at);

    if (indexOfAt !== undefined) {
      const rule = createRule(selector, property, value);
      const previousCSSText = styleElement.cssRules[indexOfAt].cssText;
      const newCSSText: string =
        previousCSSText.substring(0, previousCSSText.length - 1) + rule + '}';

      styleElement.deleteRule(indexOfAt);
      styleElement.insertRule(newCSSText, indexOfAt);
    } else {
      const rule = createRule(selector, property, value, at);
      const index = styleElement.insertRule(rule, styleElement.cssRules.length);
      atIndexes.set(at, index);
    }

    selectors.add(key);
  }

  function addRule(selector: string, property: string, value: string) {
    const key = selector;

    if (selectors.has(key)) {
      return;
    }

    const rule = createRule(selector, property, value);

    styleElement.insertRule(rule, styleElement.cssRules.length);

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
