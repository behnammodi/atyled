import { compile } from 'stylis';
import { createComponent } from './component';
import { createSelectorsManager } from './selectors-manager';
import { createRulesManager } from './rules-manager';
import { createStyleManager } from './style-manager';
import elements from './elements';
import { Atyled, AtyledElements, AtyledReactNode } from './type';
import { createStyleElement } from './style-element';

export function createAtyled() {
  const styleElement = createStyleElement();

  const rulesManager = createRulesManager(styleElement);
  const selectorsManager = createSelectorsManager();
  const styleManager = createStyleManager();

  function atyled(element: AtyledReactNode) {
    return ([declarationBlock]: TemplateStringsArray) => {
      if (element.__ATYLED__) {
        return createComponent(
          styleManager,
          rulesManager,
          selectorsManager,
          element.__ATYLED__.element,
          `atyled(${element.displayName})`,
          [...element.__ATYLED__.declarationBlock, ...compile(declarationBlock)]
        );
      } else {
        return createComponent(
          styleManager,
          rulesManager,
          selectorsManager,
          element,
          `atyled(${element.displayName || (element as any).name})`,
          compile(declarationBlock)
        );
      }
    };
  }

  elements.forEach(
    element =>
      (((atyled as unknown) as AtyledElements)[element] = ([
        declarationBlock,
      ]: TemplateStringsArray) =>
        createComponent(
          styleManager,
          rulesManager,
          selectorsManager,
          element,
          `atyled(${element})`,
          compile(declarationBlock)
        ))
  );

  return atyled as Atyled;
}
