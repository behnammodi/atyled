import { FunctionComponent, ComponentClass } from 'react';

export type ReactNode =
  | string
  | FunctionComponent<any>
  | ComponentClass<any, any>;

export type ReactNodeWithIdentifier = ReactNode & {
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
  add: (property: string, value: string) => string;
};

export type StyleManager = {
  add: (styleBlock: string) => string;
  cleanUpSelectors: (selectors: string) => string;
};
