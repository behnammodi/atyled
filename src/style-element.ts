import { StyleElement } from './type';

function createClientStyleElement(): StyleElement {
  const element = document.createElement('style');
  document.head.append(element);

  const deleteRule = (index: number): void =>
    (element.sheet as CSSStyleSheet).deleteRule(index);

  const insertRule = (rule: string, index?: number | undefined): number =>
    (element.sheet as CSSStyleSheet).insertRule(rule, index);

  return {
    get cssRules() {
      return ((element.sheet as CSSStyleSheet)
        .cssRules as unknown) as StyleElement['cssRules'];
    },
    deleteRule,
    insertRule,
    element,
  };
}

function createServerStyleElement(): StyleElement {
  const cssRules = [] as StyleElement['cssRules'];

  const deleteRule = (index: number): void => {
    cssRules.splice(index, 1);
  };

  const insertRule = (rule: string, index: number = 0): number => {
    cssRules.splice(index, 0, { cssText: rule });
    return index;
  };

  return { cssRules, deleteRule, insertRule };
}

function createStyleElement() {
  const isNode =
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null;

  return isNode ? createServerStyleElement() : createClientStyleElement();
}

export {
  createStyleElement,
  createClientStyleElement,
  createServerStyleElement,
};
