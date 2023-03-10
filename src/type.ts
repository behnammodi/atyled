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
  add: (declarationBlock: Element[]) => string;
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
