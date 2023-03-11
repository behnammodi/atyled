import {
  createClientStyleElement,
  createServerStyleElement,
} from '../src/style-element';

describe('style-element', () => {
  test('should add remove and read rules same on client and server', () => {
    const clientStyleElement = createClientStyleElement();
    const serverStyleElement = createServerStyleElement();

    clientStyleElement.insertRule('.a {b: c;}');
    serverStyleElement.insertRule('.a {b: c;}');

    expect(clientStyleElement.cssRules.length).toBe(1);
    expect(serverStyleElement.cssRules.length).toBe(1);

    clientStyleElement.insertRule('.d {e: f;}', 0);
    serverStyleElement.insertRule('.d {e: f;}', 0);

    expect(clientStyleElement.cssRules.length).toBe(2);
    expect(serverStyleElement.cssRules.length).toBe(2);

    expect(clientStyleElement.cssRules[0].cssText).toBe('.d {e: f;}');
    expect(serverStyleElement.cssRules[0].cssText).toBe('.d {e: f;}');

    clientStyleElement.deleteRule(0);
    serverStyleElement.deleteRule(0);

    expect(clientStyleElement.cssRules.length).toBe(1);
    expect(serverStyleElement.cssRules.length).toBe(1);

    expect(clientStyleElement.cssRules[0].cssText).toBe('.a {b: c;}');
    expect(serverStyleElement.cssRules[0].cssText).toBe('.a {b: c;}');
  });
});
