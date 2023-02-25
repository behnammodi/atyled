import { createComponent } from './component';
import { createSelectorsManager } from './selectors-manager';
import { createRulesManager } from './rules-manager';
import { createStyleManager } from './style-manager';
import elements from './elements';
import type { Atyled, AtyledElements, AtyledReactNode } from './type';

// TODO: should change to brand name
export function createAtyled() {
  const styleElement = document.createElement('style');
  document.head.append(styleElement);

  const rulesManager = createRulesManager(styleElement);
  const selectorsManager = createSelectorsManager();
  const styleManager = createStyleManager(selectorsManager, rulesManager);

  function atyled(element: AtyledReactNode) {
    return ([blockString]: TemplateStringsArray) => {
      if (element.__ATYLED__) {
        const splitter = (content: string, index = content.indexOf('&')) => [
          content.substring(0, index),
          content.substring(index),
        ];

        const [originalBlockStyle, restOfOriginalBlockStyles] = splitter(
          element.__ATYLED__.styleBlock
        );
        const [overwriteBlockStyle, restOfOverwriteBlockStyles] = splitter(
          blockString
        );

        return createComponent(
          styleManager,
          element.__ATYLED__.element,
          `atyled(${element.displayName})`,
          `
            ${originalBlockStyle}
            ${overwriteBlockStyle}
            ${restOfOriginalBlockStyles}
            ${restOfOverwriteBlockStyles}
          `
        );
        /**
         * I added & {} cause of it has conflict with pseudo classes, element and nested selector
         * & {
         *  ${blockString}
         * }
         */
      } else {
        return createComponent(
          styleManager,
          element,
          `atyled(${element.displayName || (element as any).name})`,
          blockString
        );
      }
    };
  }

  elements.forEach(
    element =>
      (((atyled as unknown) as AtyledElements)[element] = ([
        blockString,
      ]: TemplateStringsArray) =>
        createComponent(
          styleManager,
          element,
          `atyled(${element})`,
          blockString
        ))
  );

  return atyled as Atyled;
}
