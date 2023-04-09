import * as React from 'react';
import { renderToString } from 'react-dom/server';
import atyled, { createStyleCollector } from '../src';

describe('main test', () => {
  test('should have same result on client and server', () => {
    const Button = atyled.button`
    --background: transparent;
    --color: #FF0000;
    background: var(--background);
    color: var(--color);
    border-radius: 3px;
    border: 2px solid #FF0000;
    margin: 8px;
    padding: 4px 8px;  
  
    &:hover {
      color: orange;
      background: gray;
      border: 2px solid orange;
    }
  
    &::before {
      content: ' ★ ';
      font-size: 15px;
    }
  
    /* media */
    @media (max-width: 500px) {    
      padding: 8px 16px;  
  
      & > span {
        display: none;
      }
    }
  `;

    const PrimaryButton = atyled(Button)`
    --background: #FF0000;
    --color: white;
  
    &:hover {
      color: greenyellow;
    }
  
    &::before {
      content: ' ☀︎ ';
    }
  
    /* overwrite base media */
    @media (max-width: 500px) {
      & > span {
        display: unset;
      }   
    }
  `;

    const Container = atyled.div`
    text-align: center;
  `;

    function App() {
      return (
        <Container>
          <Button>
            <span>Normal Button</span>
          </Button>
          <PrimaryButton>
            <span>Primary Button</span>
          </PrimaryButton>
        </Container>
      );
    }

    const { jsx, getStyleSheet } = createStyleCollector(<App />);
    const markup = renderToString(jsx);

    expect(markup).toBe(
      '<div class="p0v0"><button class="p1v1 p2v2 p3v3 p4v4 p5v5 p6v6 p7v7 p8v8 p9v9 p10v10 p11v11 p12v12 p13v13 p14v14 p15v15"><span>Normal Button</span></button><button class="p3v3 p4v4 p5v5 p6v6 p7v7 p8v8 p1v2 p2v16 p10v10 p11v11 p13v13 p9v17 p12v18 p14v14 p15v19"><span>Primary Button</span></button></div>'
    );
    expect(getStyleSheet()).toBe(`.p0v0 {text-align: center;}
.p1v1 {--background: transparent;}
.p2v2 {--color: #FF0000;}
.p3v3 {background: var(--background);}
.p4v4 {color: var(--color);}
.p5v5 {border-radius: 3px;}
.p6v6 {border: 2px solid #FF0000;}
.p7v7 {margin: 8px;}
.p8v8 {padding: 4px 8px;}
.p9v9:hover {color: orange;}
.p10v10:hover {background: gray;}
.p11v11:hover {border: 2px solid orange;}
.p12v12::before {content: ' ★ ';}
.p13v13::before {font-size: 15px;}
@media (max-width: 500px) {.p14v14 {padding: 8px 16px;}.p15v15>span {display: none;}.p15v19>span {display: unset;}}
.p1v2 {--background: #FF0000;}
.p2v16 {--color: white;}
.p9v17:hover {color: greenyellow;}
.p12v18::before {content: ' ☀︎ ';}`);
  });
});
