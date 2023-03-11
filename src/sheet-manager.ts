import { ReactNode, createContext, createElement } from 'react';
import { ServerContext } from './type';
import { createRulesManager } from './rules-manager';
import { createSelectorsManager } from './selectors-manager';
import { createStyleManager } from './style-manager';
import { createServerStyleElement } from './style-element';

const Context = createContext<ServerContext | null>(null);

export default function createStyleCollector(Component: ReactNode) {
  const styleElement = createServerStyleElement();
  const styleManager = createStyleManager();
  const selectorsManager = createSelectorsManager();
  const rulesManager = createRulesManager(styleElement);
  // TODO update getStyleSheetWithTag to getStyleTags
  const { getStyleSheet, getStyleSheetWithTag: getStyleTags } = rulesManager;

  const jsx = createElement(
    Context.Provider,
    {
      value: { styleManager, selectorsManager, rulesManager } as ServerContext,
    },
    Component
  );

  return { jsx, getStyleSheet, getStyleTags };
}

export { Context, createStyleCollector };
