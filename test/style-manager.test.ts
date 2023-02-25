import { createSelectorsManager } from '../src/selectors-manager';
import { createRulesManager } from '../src/rules-manager';
import { createStyleManager } from '../src/style-manager';

describe('createStyleManager', () => {
  function createStyleManagerForEachTest() {
    const styleElement = document.createElement('style');
    document.head.append(styleElement);
    const rulesManager = createRulesManager(styleElement);

    const selectorsManager = createSelectorsManager();

    const styleManager = createStyleManager(selectorsManager, rulesManager);

    return styleManager;
  }

  test('should create a selector', () => {
    const styleManager = createStyleManagerForEachTest();
    const selectors = styleManager.add(`
    a: b;
    `);

    expect(selectors).toEqual('p0v0');
  });

  test('should create same selector', () => {
    const styleManager = createStyleManagerForEachTest();
    const selectors1 = styleManager.add(`
    a: b;
    `);

    const selectors2 = styleManager.add(`
    a: b;
    `);

    expect(selectors1).toEqual('p0v0');
    expect(selectors1).toEqual(selectors2);
  });

  test('should create different selector for different property and value', () => {
    const styleManager = createStyleManagerForEachTest();
    const selectors1 = styleManager.add(`
    a: b;
    `);

    const selectors2 = styleManager.add(`
    c: d;
    `);

    expect(selectors2).toEqual('p1v1');
    expect(selectors1).not.toBe(selectors2);
  });

  test('should create 2 selectors', () => {
    const styleManager = createStyleManagerForEachTest();
    const selectors = styleManager.add(`
    a: b;
    c: d;
    `);

    expect(selectors).toEqual('p0v0 p1v1');
  });

  test('should create 2 selectors same to each other but order should be different', () => {
    const styleManager = createStyleManagerForEachTest();

    const selectors1 = styleManager.add(`
    a: b;
    c: d;
    `);

    const selectors2 = styleManager.add(`
    c: d;
    a: b;
    `);

    expect(selectors1).toEqual('p0v0 p1v1');
    expect(selectors2).toEqual('p1v1 p0v0');
  });

  test('should create 3 selectors those completely different', () => {
    const styleManager = createStyleManagerForEachTest();
    const selectors = styleManager.add(`
    e: f;
    g: h;
    j: i;
    `);

    expect(selectors).toEqual('p0v0 p1v1 p2v2');
  });

  test('should create 3 selectors with different p but same v', () => {
    const styleManager = createStyleManagerForEachTest();
    const selectors = styleManager.add(`
    a: i;
    c: i;
    e: i;
    `);

    expect(selectors).toEqual('p0v0 p1v0 p2v0');
  });

  // test('should create 5 selectors with different p but same v', () => {

  //   const selectors = styleManager.add(`
  //   a: b;

  //   &:hover {
  //     a: c;
  //   }
  //   `);

  //   expect(selectors).toEqual('p0v0');
  // });

  test('should return p0v0', () => {
    const styleManager = createStyleManagerForEachTest();
    const selectors = styleManager.cleanUpSelectors('p0v0');

    expect(selectors).toBe('p0v0');
  });

  test('should return last class name p0v1', () => {
    const styleManager = createStyleManagerForEachTest();
    const selectors = styleManager.cleanUpSelectors('p0v0 p0v1');

    expect(selectors).toBe('p0v1');
  });

  test('should return last class name p1v3', () => {
    const styleManager = createStyleManagerForEachTest();
    const selectors = styleManager.cleanUpSelectors('p1v1 p1v2 p1v3');

    expect(selectors).toBe('p1v3');
  });

  test('should return last class name p1v3', () => {
    const styleManager = createStyleManagerForEachTest();
    const selectors = styleManager.cleanUpSelectors('p1v1 p0v0 p1v3');

    expect(selectors).toBe('p0v0 p1v3');
  });
});
