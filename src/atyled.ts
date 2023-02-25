import { createComponent } from './component';
import { createSelectorsManager } from './selectors-manager';
import { createRulesManager } from './rules-manager';
import { createStyleManager } from './style-manager';
import elements from './elements';
import type { Atyled, AtyledElements, AtyledReactNode } from './type';

export function createAtyled() {
  const styleElement = document.createElement('style');
  document.head.append(styleElement);

  const rulesManager = createRulesManager(styleElement);
  const selectorsManager = createSelectorsManager();
  const styleManager = createStyleManager(selectorsManager, rulesManager);

  function atyled(element: AtyledReactNode) {
    return ([declarationBlock]: TemplateStringsArray) => {
      if (element.__ATYLED__) {
        const splitter = (content: string, index = content.indexOf('&')) => [
          content.substring(0, index),
          content.substring(index),
        ];

        const [originalDeclarationBlock, restOfOriginalDeclarationBlocks] = splitter(
          element.__ATYLED__.declarationBlock
        );
        const [overwriteDeclarationBlock, restOfOverwriteDeclarationBlocks] = splitter(
          declarationBlock
        );

        return createComponent(
          styleManager,
          element.__ATYLED__.element,
          `atyled(${element.displayName})`,
          `
            ${originalDeclarationBlock}
            ${overwriteDeclarationBlock}
            ${restOfOriginalDeclarationBlocks}
            ${restOfOverwriteDeclarationBlocks}
          `
        );
      } else {
        return createComponent(
          styleManager,
          element,
          `atyled(${element.displayName || (element as any).name})`,
          declarationBlock
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
          element,
          `atyled(${element})`,
          declarationBlock
        ))
  );

  return atyled as Atyled;
}
