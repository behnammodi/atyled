import * as React from 'react';
import { renderToString } from 'react-dom/server';
import atyled from '../src';
import { createStyleCollector } from '../src/sheet-manager';

describe('createServerStyleSheet', () => {
  test('should return getStyleSheet and getStyleTags', () => {
    const Container = atyled.div`
      display: flex;
      flex: 1;
    `;

    const Item = atyled.div`
      margin: 8px;
    `;

    function App({ showItem = true }) {
      return <Container>{showItem && <Item>Atyled</Item>}</Container>;
    }

    const { jsx, getStyleSheet, getStyleTags } = createStyleCollector(<App />);
    renderToString(jsx);

    expect(getStyleSheet()).toBe(
      '.p0v0 {display: flex;}\n.p1v1 {flex: 1;}\n.p2v2 {margin: 8px;}'
    );
    expect(getStyleTags()).toBe(
      '<style>\n' +
        '.p0v0 {display: flex;}\n' +
        '.p1v1 {flex: 1;}\n' +
        '.p2v2 {margin: 8px;}\n' +
        '</style>'
    );
  });

  test('should return fresh getStyleSheet and getStyleTags', () => {
    const Container = atyled.div`
      display: flex;
      flex: 1;
    `;

    const Item = atyled.div`
      margin: 8px;
    `;

    function App({ showItem = true }) {
      return <Container>{showItem && <Item>Atyled</Item>}</Container>;
    }

    // first run
    {
      const { jsx, getStyleSheet, getStyleTags } = createStyleCollector(
        <App />
      );
      renderToString(jsx);

      expect(getStyleSheet()).toBe(
        '.p0v0 {display: flex;}\n.p1v1 {flex: 1;}\n.p2v2 {margin: 8px;}'
      );
      expect(getStyleTags()).toBe(
        '<style>\n' +
          '.p0v0 {display: flex;}\n' +
          '.p1v1 {flex: 1;}\n' +
          '.p2v2 {margin: 8px;}\n' +
          '</style>'
      );
    }

    // second run
    {
      const { jsx, getStyleSheet, getStyleTags } = createStyleCollector(
        <App />
      );
      renderToString(jsx);

      expect(getStyleSheet()).toBe(
        '.p0v0 {display: flex;}\n.p1v1 {flex: 1;}\n.p2v2 {margin: 8px;}'
      );
      expect(getStyleTags()).toBe(
        '<style>\n' +
          '.p0v0 {display: flex;}\n' +
          '.p1v1 {flex: 1;}\n' +
          '.p2v2 {margin: 8px;}\n' +
          '</style>'
      );
    }

    // third run with different structure
    {
      const { jsx, getStyleSheet, getStyleTags } = createStyleCollector(
        <App showItem={false} />
      );
      renderToString(jsx);

      expect(getStyleSheet()).toBe('.p0v0 {display: flex;}\n.p1v1 {flex: 1;}');
      expect(getStyleTags()).toBe(
        '<style>\n' +
          '.p0v0 {display: flex;}\n' +
          '.p1v1 {flex: 1;}\n' +
          '</style>'
      );
    }
  });
});
