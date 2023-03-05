import { FunctionComponent, ComponentClass } from 'react';
import elements from './elements';

export type ReactNode = FunctionComponent<any> | ComponentClass<any, any>;

export type AtyledReactNode = ReactNode & {
  __ATYLED__: {
    element: ReactNode;
    declarationBlock: string;
  };
  displayName?: string;
};

export type RulesManager = {
  add: (selector: string, property: string, value: string, at?: string) => void;
  getStyleSheet: () => string;
  getStyleSheetWithTags: () => string;
};

export type SelectorsManager = {
  add: (
    property: string,
    value: string,
    additionalSelectorOrPseudo?: string
  ) => string;
};

export type StyleManager = {
  add: (declarationBlock: string) => string;
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
