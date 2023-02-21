import React from 'react';
import { renderToString } from 'react-dom/server';
import { createComponent } from '../src/component';
import {
  createRulesManager,
  createSelectorsManager,
  createStyleManager,
} from '../src/core';

describe('component', () => {
  const styleElement = document.createElement('style');
  document.head.append(styleElement);

  const rulesManager = createRulesManager(styleElement);
  const selectorsManager = createSelectorsManager();
  const styleManager = createStyleManager(selectorsManager, rulesManager);

  test('should render a div without any classes', () => {
    const Component = createComponent(styleManager, 'div', 'atyled(div)', ``);

    const result = renderToString(<Component />);

    expect(result).toBe('<div></div>');
    expect(Component.displayName).toBe('atyled(div)');
  });

  test('should render a div with a passed class name', () => {
    const Component = createComponent(styleManager, 'div', 'atyled(div)', ``);

    const result = renderToString(<Component className="a" />);

    expect(result).toBe('<div class="a"></div>');
    expect(Component.displayName).toBe('atyled(div)');
  });

  test('should render a div with a passed class name and 1 additional class', () => {
    const Component = createComponent(styleManager, 'div', 'atyled(div)', `
    a: b;    
    `);

    const result = renderToString(<Component className="a" />);

    expect(result).toBe('<div class="p0v0 a"></div>');
    expect(Component.displayName).toBe('atyled(div)');
  });

  test('should render a div with a passed class name and 3 additional class', () => {
    const Component = createComponent(styleManager, 'div', 'atyled(div)', `
    a: b;
    b: b;
    c: d    
    `);

    const result = renderToString(<Component className="a" />);

    expect(result).toBe('<div class="p0v0 p1v0 p2v1 a"></div>');
    expect(Component.displayName).toBe('atyled(div)');
  });

  test('should clean up selectors', () => {
    const Component = createComponent(styleManager, 'div', 'atyled(div)', ``);

    const result = renderToString(<Component className="p0v0 p1v0 p0v1 p1v1 a" />);

    expect(result).toBe('<div class="p0v1 p1v1 a"></div>');
    expect(Component.displayName).toBe('atyled(div)');
  });
});
