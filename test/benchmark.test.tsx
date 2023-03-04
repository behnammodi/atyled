import React from 'react';
import { renderToString } from 'react-dom/server';

describe('benchmark', () => {
  function createApp(styleEngine: any) {
    const A = (styleEngine as any).div`
    color: red;
  `;

    const B = (styleEngine as any).h1`
    background-color: blue;
    border: 1px solid green;
  `;

    const C = (styleEngine as any).h2`
    color: red;
    background-color: blue;
    border: 1px solid green;
    font-size: 12px;   
  `;

    const D = (styleEngine as any).h3`
    color: red;
    background-color: blue;
    border: 1px solid green;
    font-size: 12px;
    width: var(--e);
    height: 12px;
    z-index: 1;
    position: absolute;
    left: 12%;
    top: 12%;
    color: red;
    background-color: blue;
    border: 1px solid green;
    font-size: 12px;
    width: var(--e);
    height: 12px;
    z-index: 1;
    position: absolute;
    left: 12%;
    top: 12%;

    &:hover {
      color: blue;
      background-color: red;
    }

    &::before {
      content: ' ';      
    }

    & > div {
      display: none
    }
`;

    const E = (styleEngine as any).button``;

    renderToString(
      <>
        {[...Array(9999).fill(0)].map((value, index) => (
          <A key={index}>
            <B>
              <C>
                <D style={{ '--e': value }}>
                  <div></div>
                </D>
              </C>
              <E type="button">I'm button</E>
            </B>
          </A>
        ))}
      </>
    );
  }

  test('should render faster atyled', () => {
    console.time('atyled benchmark');

    const atyled = require('../src/index').default;
    createApp(atyled);

    console.timeEnd('atyled benchmark');
  });

  test('should not render faster than atyled', () => {
    console.time('styled benchmark');

    const styled = require('styled-components').default;
    createApp(styled);

    console.timeEnd('styled benchmark');
  });
});
