import { extractor, numberOfSomething } from './utils';

function createSingleDeclarationFromDeclarationBlock(
  declarationBlock: string
): string[] {
  if (process.env.NODE_ENV !== 'production') {
    const numberOfColon = numberOfSomething(declarationBlock, ':');
    const numberOfSemicolon = numberOfSomething(declarationBlock, ';');
    const mightBeEqual = numberOfColon === numberOfSemicolon;
    const mightBeColonOneMore = numberOfColon === numberOfSemicolon + 1;

    if (mightBeEqual === false && mightBeColonOneMore === false) {
      throw new Error(`Please check declaration block ; missed

        ${declarationBlock}
        
      `);
    }
  }

  return declarationBlock
    .trim()
    .split(';')
    .filter(declaration => !!declaration)
    .map(declaration => declaration.trim());
}

function extractPseudoAndAtRules(
  declarationBlock: string
): [string, string[], string[]] {
  const [restDeclarationBlock, pseudoDeclarationBlocks] = extractor(
    declarationBlock,
    '&',
    '}'
  );

  const [mainDeclarationBlock, atDeclarationBlocks] = extractor(
    restDeclarationBlock,
    '@',
    '}'
  );

  return [mainDeclarationBlock, pseudoDeclarationBlocks, atDeclarationBlocks];
}

function removeCommentsFromDeclarationBlock(declarationBlock: string) {
  return extractor(declarationBlock, '/*', '*/')[0];
}

export {
  createSingleDeclarationFromDeclarationBlock,
  extractPseudoAndAtRules,
  removeCommentsFromDeclarationBlock,
};
