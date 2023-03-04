function numberOfSomething(value: string, something: string) {
  if (!value) {
    return 0;
  }

  return value.split('').reduce((a, b) => {
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

function removePartOfString(
  value: string,
  startWith: number,
  endWith: number
): string {
  return value.substring(0, startWith) + value.substring(endWith);
}

function removePartsOfString(
  value: string,
  positions: {
    startIndex: number;
    endIndex: number;
  }[]
): string {
  return positions.reduce(
    (a, b) => {
      const startIndex = b.startIndex - a.removedLength;
      const endIndex = b.endIndex - a.removedLength;
      const value = removePartOfString(a.value, startIndex, endIndex);
      const removedLength = a.removedLength + (endIndex - startIndex);
      return { value, removedLength };
    },
    { value, removedLength: 0 }
  ).value;
}

function finder(value: string, startWith: string, endWith: string) {
  const items: {
    value: string;
    startIndex: number;
    endIndex: number;
  }[] = [];

  let i = 0;
  while (true) {
    let startIndex = value.indexOf(startWith, i);
    if (startIndex === -1) {
      break;
    }
    let endIndex = (i = value.indexOf(endWith, startIndex));
    items.push({
      value: value.substring(startIndex, endIndex + 1).trim(),
      startIndex,
      endIndex,
    });
  }

  return items;
}

function extractor(
  value: string,
  startWith: string,
  endWith: string
): [
  string,
  {
    value: string;
    startIndex: number;
    endIndex: number;
  }[]
] {
  const items = finder(value, startWith, endWith);
  const positions = items.map(({ startIndex, endIndex }) => ({
    startIndex,
    endIndex: endIndex + 1,
  }));
  const rest = removePartsOfString(value, positions).trim();

  return [rest, items];
}

export {
  numberOfSomething,
  createSingleDeclarationFromDeclarationBlock,
  removePartOfString,
  removePartsOfString,
  finder,
  extractor,
};
