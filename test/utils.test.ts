import {
  numberOfSomething,
  createSingleDeclarationFromDeclarationBlock,
  finder,
} from '../src/utils';

describe('utils', () => {
  describe('numberOfSomething', () => {
    test('should return 1', () => {
      expect(numberOfSomething('a:a', ':')).toBe(1);
    });

    test('should return 0', () => {
      expect(numberOfSomething('a:a', '')).toBe(0);
      const noop = (undefined as unknown) as string;
      expect(numberOfSomething('a:a', noop)).toBe(0);
      expect(numberOfSomething('', noop)).toBe(0);
      expect(numberOfSomething(noop, noop)).toBe(0);
    });

    test('should return 5', () => {
      expect(
        numberOfSomething(
          `
      a:a;
      b:b;
      c:c;
      d:d;
      e:e;
      `,
          ';'
        )
      ).toBe(5);
    });
  });

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

  describe('finder', () => {
    // test('should return empty array for empty input and without startWidth and endWidth', () => {
    //   // expect(finder('')).toEqual([]);
    // });

    test('should return 1 item', () => {
      expect(
        finder(
          `
a: b;
c: d;

@media (max-width:200px) {
  a: c;
}`,
          '@media',
          '}'
        )
      ).toEqual([
        `@media (max-width:200px) {
  a: c;
}`,
      ]);
    });

    test('should return 2 item', () => {
      expect(
        finder(
          `
a: b;
c: d;

@media (max-width:200px) {
  a: c;
}

@media (max-width:400px) {
  a: d;
}`,
          '@media',
          '}'
        )
      ).toEqual([
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
