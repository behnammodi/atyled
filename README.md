![atyled](https://user-images.githubusercontent.com/1549069/221021089-c41b03e0-ef6f-4835-bc10-669d44d19bb3.png)

## atomic css + styled-component

### This library inspired by atomic css and styled-components, plus:

- It generate atomic classes
- Final stylesheet is very optimized and small
- It's tiny and less than 2KB
- SSR support
- Faster than `styled-components`
- No overwrite rules
- No dependencies (if it is a benefit :))

## Example

[Codesandbox](https://codesandbox.io/s/atyled-example-1-vxhd58)

```js
import atyled from 'atyled';

const Button = atyled.button`
  --background: transparent;
  --color: #FF0000;
  background: var(--background);
  color: var(--color);
  border-radius: 3px;
  border: 2px solid #FF0000;
  margin: 0.5em 1em;
  padding: 0.25em 1em;  

  &:hover {
    color: orange;
    background: gray;
    border: 2px solid orange;
  }

  &::before {
    content: ' ★ ';
    font-size: 15px;
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
`;

const Container = atyled.div`
  text-align: center;
`;

function App() {
  return (
    <Container>
      <Button>Normal Button</Button>
      <PrimaryButton>Primary Button</PrimaryButton>
    </Container>
  );
}
```

## Result

HTML Output:

```html
<div class="p0v0">
  <button
    class="p1v1 p2v2 p3v3 p4v4 p5v5 p6v6 p7v7 p8v8 p9v9 p10v10 p11v11 p12v12 p13v13"
  >
    Normal Button
  </button>
  <button
    class="p3v3 p4v4 p5v5 p6v6 p7v7 p8v8 p1v2 p2v14 p10v10 p11v11 p13v13 p9v15 p12v16"
  >
    Primary Button
  </button>
</div>
```

CSS Output:

```css
.p0v0 { text-align: center; }
.p1v1 { --background: transparent; }
.p2v2 { --color: #ff0000; }
.p3v3 { background: var(--background); }
.p4v4 { color: var(--color); }
.p5v5 { border-radius: 3px; }
.p6v6 { border: 2px solid rgb(255, 0, 0); }
.p7v7 { margin: 0.5em 1em; }
.p8v8 { padding: 0.25em 1em; }
.p9v9:hover { color: orange; }
.p10v10:hover { background: gray; }
.p11v11:hover { border: 2px solid orange; }
.p12v12::before { content: ' ★ '; }
.p13v13::before { font-size: 15px; }
.p2v14 { --color: white; }
.p9v15:hover { color: greenyellow; }
.p12v16::before { content: ' ☀︎ '; }
```
