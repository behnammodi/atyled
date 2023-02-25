import { createSelectorsManager } from '../src/selectors-manager';

describe('createSelectorsManager', () => {
  test('should create a selector', () => {
    const selectorsManager = createSelectorsManager();
    const selector = selectorsManager.add('a', 'b');
    expect(selector).toBe('p0v0');
  });

  test('should create a selector with same p and v', () => {
    const selectorsManager = createSelectorsManager();
    const selector1 = selectorsManager.add('a', 'b');

    const selector2 = selectorsManager.add('a', 'b');

    expect(selector2).toBe('p0v0');
    expect(selector1).toBe(selector2);
  });

  test('should create a selector with same p but different v', () => {
    const selectorsManager = createSelectorsManager();
    const selector1 = selectorsManager.add('a', 'b');
    const selector2 = selectorsManager.add('a', 'c');

    expect(selector1).toBe('p0v0');
    expect(selector2).toBe('p0v1');
  });

  test('should create a selector with different p but same v', () => {
    const selectorsManager = createSelectorsManager();
    const selector1 = selectorsManager.add('a', 'b');
    const selector2 = selectorsManager.add('b', 'b');

    expect(selector1).toBe('p0v0');
    expect(selector2).toBe('p1v0');
  });

  test('should create a selector with different p and different v', () => {
    const selectorsManager = createSelectorsManager();
    const selector1 = selectorsManager.add('a', 'b');
    const selector2 = selectorsManager.add('c', 'd');

    expect(selector1).toBe('p0v0');
    expect(selector2).toBe('p1v1');
  });

  test('should not refers to pseudo class', () => {
    const selectorsManager = createSelectorsManager();
    const selector = selectorsManager.add('a', 'b', ':hover');

    expect(selector).toBe('p0v0');
  });

  test('should keep same p as previous but value should be different', () => {
    const selectorsManager = createSelectorsManager();
    const selector1 = selectorsManager.add('a', 'b', ':hover');
    const selector2 = selectorsManager.add('a', 'c', ':hover');

    expect(selector1).toBe('p0v0');
    expect(selector2).toBe('p0v1');
  });

  test('should not refers to pseudo element', () => {
    const selectorsManager = createSelectorsManager();
    const selector = selectorsManager.add('a', 'b', '::before');

    expect(selector).toBe('p0v0');
  });

  test('should not refers to nested tag', () => {
    const selectorsManager = createSelectorsManager();
    const selector = selectorsManager.add('a', 'b', ' > div');

    expect(selector).toBe('p0v0');
  });
});
