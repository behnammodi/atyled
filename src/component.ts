import * as React from 'react';
import { Element } from 'stylis';
import {
  ReactNode,
  StyleManager,
  AtyledReactNode,
  RulesManager,
  SelectorsManager,
  ServerContext,
} from './type';
import { Context } from './sheet-manager';

export function createComponent(
  styleManager: StyleManager,
  rulesManager: RulesManager,
  selectorsManager: SelectorsManager,
  element: string | ReactNode,
  displayName: string,
  declarationBlock: Element[]
): AtyledReactNode {
  function Component(props: any) {
    const serverContext = React.useContext<ServerContext | null>(Context);

    const selectors = React.useMemo<string>(() => {
      const selectors = (serverContext?.styleManager || styleManager)
        .attache({
          rulesManager: serverContext?.rulesManager || rulesManager,
          selectorsManager: serverContext?.selectorsManager || selectorsManager,
        })
        .add(declarationBlock);
      return selectors;
    }, [serverContext]);

    const { className, ...restProps } = props;

    const classNames = React.useMemo(() => {
      let cns = selectors;
      if (className) {
        cns = `${selectors} ${className}`;
      }
      return styleManager.cleanUpSelectors(cns);
    }, [className, selectors]);

    return React.createElement(element, {
      ...(classNames && { className: classNames }),
      ...restProps,
    });
  }

  Component.displayName = displayName;

  Component.__ATYLED__ = {
    element,
    declarationBlock,
  };

  return Component as AtyledReactNode;
}
