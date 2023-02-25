import React from 'react';
import { renderToString } from 'react-dom/server';
import { createAtyled } from '../src/atyled';

describe('main', () => {

  test('should render a div without any classes', () => {
    const atyled = createAtyled();
    const Component = atyled.div``

    const result = renderToString(<Component />);

    expect(result).toBe('<div></div>');
  });

  test('should render a div with a passed class name', () => {
    const atyled = createAtyled();
    const Component = atyled.div``

    const result = renderToString(<Component className="a" />);

    expect(result).toBe('<div class="a"></div>');
  });

  test('should render a div with a passed class name and 1 additional class', () => {
    const atyled = createAtyled();
    const Component = atyled.div`
    a: b;    
    `

    const result = renderToString(<Component className="a" />);

    expect(result).toBe('<div class="p0v0 a"></div>');
  });

  test('should render a div with a passed class name and 3 additional class', () => {
    const atyled = createAtyled();
    const Component = atyled.div`
    a: b;
    b: b;
    c: d    
    `;

    const result = renderToString(<Component className="a" />);

    expect(result).toBe('<div class="p0v0 p1v0 p2v1 a"></div>');
  });

  test('should has atyled(atyled(div)) as displayName', () => {
    const atyled = createAtyled();
    const Component = atyled.div``;

    const Component2 = atyled(Component)``

    renderToString(<Component2 />);

    expect(Component2.displayName).toBe('atyled(atyled(div))');
  });

  test('should render a div with 2 classes cause of :hover', () => {
    const atyled = createAtyled();
    const Component = atyled.div`
    a: b;
    &:hover {
      a: b
    }
    `;

    const result = renderToString(<Component />);

    expect(result).toBe('<div class="p0v0 p1v0"></div>');
  });

  test('should render 2 div inside each other with 5 classes cause of :hover ::before > div and passed className', () => {
    const atyled = createAtyled();
    const Component = atyled.div`
    a: b;
    &:hover {
      a: b
    }
    &::before {
      a: b
    }
    & > div {
      a: b
    }
    `;

    const result = renderToString(<Component className="a"><div></div></Component>);

    expect(result).toBe('<div class="p0v0 p1v0 p2v0 p3v0 a"><div></div></div>');
  });
});
