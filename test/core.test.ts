import {
  createRulesManager,
  createSelectorsManager,
  createStyleManager,
} from '../src/core';

describe('core functionality', () => {
  describe('createRulesManager', () => {
    test('should has 2 rules', () => {
      const styleElement = document.createElement('style');
      document.head.append(styleElement);
      const rulesManager = createRulesManager(styleElement);

      // first rule
      rulesManager.add('a', 'b', 'c');
      expect(styleElement.sheet?.cssRules.length).toBe(1);
      const firstRule = (styleElement.sheet as CSSStyleSheet)
        .cssRules[0] as any;
      expect(firstRule.selectorText).toBe('.a');
      expect(firstRule.style['b']).toBe('c');

      // second rule
      rulesManager.add('d', 'e', 'f');
      expect(styleElement.sheet?.cssRules.length).toBe(2);
      const secondRule = (styleElement.sheet as CSSStyleSheet)
        .cssRules[1] as any;
      expect(secondRule.selectorText).toBe('.d');
      expect(secondRule.style['e']).toBe('f');
    });
  });

  describe('createSelectorsManager', () => {
    const selectorsManager = createSelectorsManager();

    test('should create a selector', () => {
      const selector = selectorsManager.add('a', 'b');
      expect(selector).toBe('p0v0');
    });

    test('should create a selector with same p and v as previous', () => {
      const selector = selectorsManager.add('a', 'b');
      expect(selector).toBe('p0v0');
    });

    test('should create a selector with same p but different v', () => {
      const selector = selectorsManager.add('a', 'c');
      expect(selector).toBe('p0v1');
    });

    test('should create a selector with different p but same v', () => {
      const selector = selectorsManager.add('b', 'b');
      expect(selector).toBe('p1v0');
    });

    test('should create a selector with different p and different v', () => {
      const selector = selectorsManager.add('c', 'd');
      expect(selector).toBe('p2v2');
    });
  });

  describe('createStyleManager', () => {
    const styleElement = document.createElement('style');
    document.head.append(styleElement);
    const rulesManager = createRulesManager(styleElement);

    const selectorsManager = createSelectorsManager();

    const styleManager = createStyleManager(selectorsManager, rulesManager);

    test('should create a selector', () => {
      const selectors = styleManager.add(`
      a: b;
      `);

      expect(selectors).toEqual('p0v0');
    });

    test('should create a selector with same selector as previous', () => {
      const selectors = styleManager.add(`
      a: b;
      `);

      expect(selectors).toEqual('p0v0');
    });

    test('should create second selector different selector', () => {
      const selectors = styleManager.add(`
      c: d;
      `);

      expect(selectors).toEqual('p1v1');
    });

    test('should create 2 selectors but same as 2 previous', () => {
      const selectors = styleManager.add(`
      a: b;
      c: d;
      `);

      expect(selectors).toEqual('p0v0 p1v1');
    });

    test('should create 2 selectors same as previous but order is different', () => {
      const selectors = styleManager.add(`
      c: d;
      a: b;
      `);

      expect(selectors).toEqual('p1v1 p0v0');
    });

    test('should create 3 selectors those completely different', () => {
      const selectors = styleManager.add(`
      e: f;
      g: h;
      j: i;
      `);

      expect(selectors).toEqual('p2v2 p3v3 p4v4');
    });

    test('should create 5 selectors with different p but same v', () => {
      const selectors = styleManager.add(`
      a: i;
      c: i;
      e: i;
      `);

      expect(selectors).toEqual('p0v4 p1v4 p2v4');
    });

    test('should return p0v0', () => {
      const selectors = styleManager.cleanUpSelectors('p0v0');

      expect(selectors).toBe('p0v0');
    });

    test('should return last class name p0v1', () => {
      const selectors = styleManager.cleanUpSelectors('p0v0 p0v1');

      expect(selectors).toBe('p0v1');
    });

    test('should return last class name p1v3', () => {
      const selectors = styleManager.cleanUpSelectors('p1v1 p1v2 p1v3');

      expect(selectors).toBe('p1v3');
    });

    test('should return last class name p1v3', () => {
      const selectors = styleManager.cleanUpSelectors('p1v1 p0v0 p1v3');

      expect(selectors).toBe('p0v0 p1v3');
    });
  });
});
