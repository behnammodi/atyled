import { compile } from 'stylis';
import { createSelectorsManager } from '../src/selectors-manager';
import { createRulesManager } from '../src/rules-manager';
import { createStyleManager } from '../src/style-manager';
import { createClientStyleElement } from '../src/style-element';

describe('createStyleManager', () => {
  function createStyleManagerForEachTest() {
    const styleElement = createClientStyleElement();
    const rulesManager = createRulesManager(styleElement);

    const selectorsManager = createSelectorsManager();

    const styleManager = createStyleManager();

    return {
      styleManager,
      rulesManager,
      selectorsManager,
      styleElement: styleElement,
    };
  }

  test('should create a selector', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;
    `)
      );

    expect(selectors).toEqual('p0v0');
  });

  test('should create same selector', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
    } = createStyleManagerForEachTest();
    const selectors1 = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;
    `)
      );

    const selectors2 = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;
    `)
      );

    expect(selectors1).toEqual('p0v0');
    expect(selectors1).toEqual(selectors2);
  });

  test('should create different selector for different property and value', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
    } = createStyleManagerForEachTest();
    const selectors1 = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;
    `)
      );

    const selectors2 = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    c: d;
    `)
      );

    expect(selectors2).toEqual('p1v1');
    expect(selectors1).not.toBe(selectors2);
  });

  test('should create 2 selectors', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;
    c: d;
    `)
      );

    expect(selectors).toEqual('p0v0 p1v1');
  });

  test('should create 2 selectors with same name cause of same p and v', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;
    a: b;
    `)
      );

    expect(selectors).toEqual('p0v0 p0v0');
  });

  test('should create 2 selectors same to each other but order should be different', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
    } = createStyleManagerForEachTest();

    const selectors1 = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;
    c: d;
    `)
      );

    const selectors2 = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    c: d;
    a: b;
    `)
      );

    expect(selectors1).toEqual('p0v0 p1v1');
    expect(selectors2).toEqual('p1v1 p0v0');
  });

  test('should create 3 selectors those completely different', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    e: f;
    g: h;
    j: i;
    `)
      );

    expect(selectors).toEqual('p0v0 p1v1 p2v2');
  });

  test('should create 3 selectors with different p but same v', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: i;
    c: i;
    e: i;
    `)
      );

    expect(selectors).toEqual('p0v0 p1v0 p2v0');
  });

  test('should create additional class for :hover', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
      styleElement,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;

    &:hover {
      a: c;
    }
    `)
      );

    expect(selectors).toEqual('p0v0 p1v1');
    expect((styleElement.cssRules[0] as any).selectorText).toBe('.p0v0');
    expect((styleElement.cssRules[1] as any).selectorText).toBe('.p1v1:hover');
  });

  test('should create 2 classes for :hover', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
      styleElement,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;

    &:hover {
      a: c;
      d: e;
    }
    `)
      );

    expect(selectors).toEqual('p0v0 p1v1 p2v2');
    expect((styleElement.cssRules[0] as any).selectorText).toBe('.p0v0');
    expect((styleElement.cssRules[1] as any).selectorText).toBe('.p1v1:hover');
    expect((styleElement.cssRules[2] as any).selectorText).toBe('.p2v2:hover');
  });

  test('should create 1 classes for :hover cause of duplication', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
      styleElement,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;

    &:hover {
      a: c;
      a: c;
    }
    `)
      );

    expect(selectors).toEqual('p0v0 p1v1 p1v1');
    expect((styleElement.cssRules[0] as any).selectorText).toBe('.p0v0');
    expect((styleElement.cssRules[1] as any).selectorText).toBe('.p1v1:hover');
    expect(styleElement.cssRules).toHaveLength(2);
  });

  test('should create additional class for ::before', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
      styleElement,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;

    &::before {
      a: c;
    }
    `)
      );

    expect(selectors).toEqual('p0v0 p1v1');
    expect((styleElement.cssRules[0] as any).selectorText).toBe('.p0v0');
    expect((styleElement.cssRules[1] as any).selectorText).toBe(
      '.p1v1::before'
    );
    expect(styleElement.cssRules).toHaveLength(2);
  });

  test('should create 2 additional class for :hover and ::before', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
      styleElement,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;

    &:hover {
      a: c;
    }

    &::before {
      a: c;
    }
    `)
      );

    expect(selectors).toEqual('p0v0 p1v1 p2v1');
    expect((styleElement.cssRules[0] as any).selectorText).toBe('.p0v0');
    expect((styleElement.cssRules[1] as any).selectorText).toBe('.p1v1:hover');
    expect((styleElement.cssRules[2] as any).selectorText).toBe(
      '.p2v1::before'
    );
    expect(styleElement.cssRules).toHaveLength(3);
  });

  test('should create 3 additional class for :hover ::before > div and additional composition', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
      styleElement,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;

    &:hover {
      a: c;
    }

    &::before {
      a: c;
    }

    & > div {
      b: c;
    }

    & {
      a: b;
      c: d;
    }
    `)
      );

    expect(selectors).toEqual('p0v0 p1v1 p2v1 p3v1 p0v0 p4v2');
    expect((styleElement.cssRules[0] as any).selectorText).toBe('.p0v0');
    expect((styleElement.cssRules[1] as any).selectorText).toBe('.p1v1:hover');
    expect((styleElement.cssRules[2] as any).selectorText).toBe(
      '.p2v1::before'
    );
    expect((styleElement.cssRules[3] as any).selectorText).toBe('.p3v1>div');
    expect((styleElement.cssRules[4] as any).selectorText).toBe('.p4v2');
    expect(styleElement.cssRules).toHaveLength(5);
  });

  test('should return 5 classes for @media and remove their comments', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
      styleElement,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
  /* comment 1 */
  @media (max-width:200px) {
    a: b;
  }

  @media (max-width:400px) {
    /* comment 2 */
    a: b;
    a: c;
  }

  @media (max-width:200px) {
    a: c;
    /* comment 3 */
  }

  @media (max-width:300px) {
    a: b;
    /* 
    comment 4 
    */
  }
      `)
      );

    expect(selectors).toBe('p0v0 p1v0 p1v1 p0v1 p2v0');
    expect(styleElement.cssRules[0].cssText).toBe(
      '@media (max-width:200px) {.p0v0 {a: b;}.p0v1 {a: c;}}'
    );
    expect(styleElement.cssRules[1].cssText).toBe(
      '@media (max-width:400px) {.p1v0 {a: b;}.p1v1 {a: c;}}'
    );
    expect(styleElement.cssRules[2].cssText).toBe(
      '@media (max-width:300px) {.p2v0 {a: b;}}'
    );
  });

  test('should return p0v0', () => {
    const { styleManager } = createStyleManagerForEachTest();
    const selectors = styleManager.cleanUpSelectors('p0v0');

    expect(selectors).toBe('p0v0');
  });

  test('should return last class name p0v1', () => {
    const { styleManager } = createStyleManagerForEachTest();
    const selectors = styleManager.cleanUpSelectors('p0v0 p0v1');

    expect(selectors).toBe('p0v1');
  });

  test('should return last class name p1v3', () => {
    const { styleManager } = createStyleManagerForEachTest();
    const selectors = styleManager.cleanUpSelectors('p1v1 p1v2 p1v3');

    expect(selectors).toBe('p1v3');
  });

  test('should return last class name p1v3', () => {
    const { styleManager } = createStyleManagerForEachTest();
    const selectors = styleManager.cleanUpSelectors('p1v1 p0v0 p1v3');

    expect(selectors).toBe('p0v0 p1v3');
  });

  test('should create a selector for nested query', () => {
    const {
      styleManager,
      rulesManager,
      selectorsManager,
    } = createStyleManagerForEachTest();
    const selectors = styleManager
      .attache({ rulesManager, selectorsManager })
      .add(
        compile(`
    a: b;    
    
    &::before {
      x: y;
    }

    @media (max-width:300px) {
      a: c;
      &::before {
        x: z;
      }
    }

    @media (max-width:300px) {
      &::before {
        x: x;
      }
    }
    `)
      );

    expect(selectors).toEqual('p0v0 p1v1 p2v2 p3v3 p3v4');
    expect(rulesManager.getStyleSheet()).toBe(`.p0v0 {a: b;}
.p1v1::before {x: y;}
@media (max-width:300px) {.p2v2 {a: c;}.p3v3::before {x: z;}.p3v4::before {x: x;}}`);
  });
});
