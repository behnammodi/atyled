import type { RulesManager } from './type';

export function createRulesManager(
  styleElement: HTMLStyleElement
): RulesManager {
  const selectors = new Set<string>();

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

  return { add };
}
