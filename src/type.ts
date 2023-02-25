import { FunctionComponent, ComponentClass } from 'react';
import elements from './elements';

export type ReactNode = FunctionComponent<any> | ComponentClass<any, any>;

export type AtyledReactNode = ReactNode & {
  __ATYLED__: {
    element: ReactNode;
    styleBlock: string;
  };
  displayName?: string;
};

export type RulesManager = {
  add: (selector: string, property: string, value: string) => void;
};

export type SelectorsManager = {
  add: (property: string, value: string, additionalSelector?: string) => string;
};

export type StyleManager = {
  add: (styleBlock: string) => string;
  cleanUpSelectors: (selectors: string) => string;
};

export type AtyledElements = {
  [K in typeof elements[number]]: ([
    blockString,
  ]: TemplateStringsArray) => AtyledReactNode;
};

export type AtyledConstructor = (
  element: AtyledReactNode
) => ([blockString]: TemplateStringsArray) => AtyledReactNode;

export type Atyled = AtyledConstructor & AtyledElements;
