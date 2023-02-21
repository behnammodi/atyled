import { createComponent } from '../src/component';
import {
  createRulesManager,
  createSelectorsManager,
  createStyleManager,
} from '../src/core';
import elements from './elements';
import { ReactNodeWithIdentifier } from './type';

// TODO: should change to brand name
export function createAtyled() {
  const styleElement = document.createElement('style');
  document.head.append(styleElement);

  const rulesManager = createRulesManager(styleElement);
  const selectorsManager = createSelectorsManager();
  const styleManager = createStyleManager(selectorsManager, rulesManager);

  function atyled(element: ReactNodeWithIdentifier) {
    return ([atyledString]: [string]) => {
      if (element.__ATYLED__) {
        return createComponent(
          styleManager,
          element.__ATYLED__.element,
          `atyled(${element.displayName})`,
          `${element.__ATYLED__.styleBlock}${atyledString}`
        );
      } else {
        return createComponent(
          styleManager,
          element,
          `atyled(${element.displayName || (element as any).name})`,
          atyledString
        );
      }
    };
  }

  elements.forEach(
    element =>
      ((atyled as any)[element] = ([atyledString]: [string]) =>
        createComponent(
          styleManager,
          element,
          `atyled(${element})`,
          atyledString
        ))
  );

  return atyled;
}
