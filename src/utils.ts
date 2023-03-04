function numberOfSomething(content: string, something: string) {
  if (!content) {
    return 0;
  }

  return content.split('').reduce((a, b) => {
    if (b === something) {
      return a + 1;
    }

    return a;
  }, 0);
}

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

function finder(content: string, startWith: string, endWith: string): string[] {
  const items: string[] = [];

  let i = 0;
  while (true) {
    let startIndex = content.indexOf(startWith, i);
    if (startIndex === -1) {
      break;
    }
    let endIndex = (i = content.indexOf(endWith, startIndex));
    const item = content.substring(startIndex, endIndex + 1).trim();
    items.push(item);
  }

  return items;
}

export {
  numberOfSomething,
  createSingleDeclarationFromDeclarationBlock,
  finder,
};
