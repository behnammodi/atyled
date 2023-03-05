import {
  createSingleDeclarationFromDeclarationBlock,
  extractPseudoAndAtRules,
} from '../src/style-manager-utils';

describe('style-manager-utils', () => {
  describe('createSingleDeclarationFromDeclarationBlock', () => {
    test('should return 1 declarations', () => {
      expect(
        createSingleDeclarationFromDeclarationBlock(`
      a:b;
    `)
      ).toEqual(['a:b']);
    });

    test('should return 2 declarations', () => {
      expect(
        createSingleDeclarationFromDeclarationBlock(`
      a:b;
      c:d;
    `)
      ).toEqual(['a:b', 'c:d']);
    });

    test('should return 2 declarations without last ;', () => {
      expect(
        createSingleDeclarationFromDeclarationBlock(`
      a:b;
      c:d
    `)
      ).toEqual(['a:b', 'c:d']);
    });

    test('should throw an error', () => {
      try {
        createSingleDeclarationFromDeclarationBlock(`
      a:b
      c:d
    `);
      } catch (e) {
        expect((e as Error).message).toContain(
          'Please check declaration block ; missed'
        );
      }
    });
  });

  describe('extractPseudoAndAtRules', () => {
    test('should extract pseudo, @media and main declaration block', () => {
      const [
        mainDeclarationBlock,
        pseudoDeclarationBlocks,
        atDeclarationBlocks,
      ] = extractPseudoAndAtRules(`
a: b;
c: d;

&:hover {
  a: e
}

@media (max-width:200px) {
  a: c;
}

& > div {
  b: c;
}

@media (max-width:400px) {
  a: d;
}

&::before {
  a: b;
  b: c
}
      `);

      expect(mainDeclarationBlock).toBe(`a: b;
c: d;`);
      expect(pseudoDeclarationBlocks).toEqual([
        `&:hover {
  a: e
}`,
        `& > div {
  b: c;
}`,
        `&::before {
  a: b;
  b: c
}`,
      ]);
      expect(atDeclarationBlocks).toEqual([
        `@media (max-width:200px) {
  a: c;
}`,
        `@media (max-width:400px) {
  a: d;
}`,
      ]);
    });
  });
});
