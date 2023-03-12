import { FunctionComponent, ComponentClass } from 'react';
import { Element } from 'stylis';
import elements from './elements';

export type ReactNode = FunctionComponent<any> | ComponentClass<any, any>;

export type AtyledReactNode = ReactNode & {
  __ATYLED__: {
    element: ReactNode;
    declarationBlock: Element[];
  };
  displayName?: Element[];
};

export type RulesManager = {
  add: (selector: string, property: string, value: string, at?: string) => void;
  getStyleSheet: () => string;
  getStyleTags: () => string;
};

export type SelectorsManager = {
  add: (
    property: string,
    value: string,
    additionalSelectorOrPseudo?: string
  ) => string;
};

export type StyleManager = {
  attache: ({
    rulesManager,
    selectorsManager,
  }: {
    rulesManager: RulesManager;
    selectorsManager: SelectorsManager;
  }) => {
    add: (declarationBlock: Element[]) => string;
  };
  cleanUpSelectors: (selectors: string) => string;
};

export type AtyledElements = {
  [K in typeof elements[number]]: ([
    declarationBlock,
  ]: TemplateStringsArray) => AtyledReactNode;
};

export type AtyledConstructor = (
  element: AtyledReactNode
) => ([declarationBlock]: TemplateStringsArray) => AtyledReactNode;

export type Atyled = AtyledConstructor & AtyledElements;

export type ServerContext = {
  selectorsManager: SelectorsManager;
  styleManager: StyleManager;
  rulesManager: RulesManager;
};

export type StyleElement = {
  cssRules: Array<Pick<CSSRule, 'cssText'>>;
  deleteRule(index: number): void;
  insertRule(rule: string, index?: number | undefined): number;
  element?: HTMLStyleElement;
};
