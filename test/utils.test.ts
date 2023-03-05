import {
  numberOfSomething,
  removePartOfString,
  removePartsOfString,
  finder,
  extractor,
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

  describe('removePartOfString', () => {
    test('should remove CSS', () => {
      expect(removePartOfString('Hello CSS how are you?', 6, 9)).toBe(
        'Hello  how are you?'
      );
    });

    test('should not remove anything', () => {
      expect(removePartOfString('Hello CSS how are you?', 6, 6)).toBe(
        'Hello CSS how are you?'
      );
    });
  });

  describe('removePartsOfString', () => {
    test('should remove Hello', () => {
      expect(
        removePartsOfString('Hello CSS how are you?', [
          { startIndex: 0, endIndex: 5 },
        ])
      ).toBe(' CSS how are you?');
    });

    test('should remove Hello and CSS', () => {
      expect(
        removePartsOfString('Hello CSS how are you?', [
          { startIndex: 0, endIndex: 5 },
          { startIndex: 6, endIndex: 9 },
        ])
      ).toBe('  how are you?');
    });
  });

  describe('finder', () => {
    // test('should return empty array for empty input and without startWidth and endWidth', () => {
    //   // expect(finder('')).toEqual([]);
    // });

    test('should return 1 @media', () => {
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
        {
          endIndex: 50,
          startIndex: 14,
          value: `@media (max-width:200px) {
  a: c;
}`,
        },
      ]);
    });

    test('should return 2 @media', () => {
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
        {
          endIndex: 50,
          startIndex: 14,
          value: `@media (max-width:200px) {
  a: c;
}`,
        },
        {
          endIndex: 88,
          startIndex: 52,
          value: `@media (max-width:400px) {
  a: d;
}`,
        },
      ]);
    });

    test('should return 3 pseudo', () => {
      expect(
        finder(
          `
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
`,
          '&',
          '}'
        )
      ).toEqual([
        {
          endIndex: 32,
          startIndex: 14,
          value: `&:hover {
  a: e
}`,
        },
        {
          endIndex: 91,
          startIndex: 72,
          value: `& > div {
  b: c;
}`,
        },
        {
          endIndex: 159,
          startIndex: 131,
          value: `&::before {
  a: b;
  b: c
}`,
        },
      ]);
    });
  });

  describe('extractor', () => {
    test('extract all pseudos', () => {
      expect(
        extractor(
          `
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
      `,
          '&',
          '}'
        )
      ).toEqual([
        `a: b;
c: d;



@media (max-width:200px) {
  a: c;
}



@media (max-width:400px) {
  a: d;
}`,
        [
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
        ],
      ]);
    });

    test('extract all @media', () => {
      expect(
        extractor(
          `
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
      `,
          '@',
          '}'
        )
      ).toEqual([
        `a: b;
c: d;

&:hover {
  a: e
}



& > div {
  b: c;
}



&::before {
  a: b;
  b: c
}`,
        [
          `@media (max-width:200px) {
  a: c;
}`,

          `@media (max-width:400px) {
  a: d;
}`,
        ],
      ]);
    });
  });
});
