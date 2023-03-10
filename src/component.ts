import * as React from 'react';
import { Element } from 'stylis';
import { ReactNode, StyleManager, AtyledReactNode } from './type';

export function createComponent(
  styleManager: StyleManager,
  element: string | ReactNode,
  displayName: string,
  declarationBlock: Element[]
): AtyledReactNode {
  function Component(props: any) {
    const selectors = React.useMemo<string>(() => {
      const selectors = styleManager.add(declarationBlock);
      return selectors;
    }, []);

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
