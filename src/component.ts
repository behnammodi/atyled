import * as React from 'react';
import { ReactNode, StyleManager } from './type';

export function createComponent(
  styleManager: StyleManager,
  element: ReactNode,
  displayName: string,
  styleBlock: string
) {
  function Component(props: any) {
    const selectors = React.useMemo<string>(() => {
      const selectors = styleManager.add(styleBlock);
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
    styleBlock,
  };

  return Component;
}
