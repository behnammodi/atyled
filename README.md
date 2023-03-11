![atyled](https://user-images.githubusercontent.com/1549069/221021089-c41b03e0-ef6f-4835-bc10-669d44d19bb3.png)

## inspired by atomic css + styled-components

### This library inspired by atomic css and styled-components, plus:

- It generate atomic classes
- Final stylesheet is very optimized and small
- It's tiny and less than 2KB
- SSR support
- Faster than `styled-components`
- No overwrite rules

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

  /* media */
  @media (max-width: 500px) {
    width: 5px;    
    overflow: hidden
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

  /* overwrite media */
  @media (max-width: 500px) {
    width: auto;
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

HTML:

```html
<div class="p0v0">
  <button
    class="p1v1 p2v2 p3v3 p4v4 p5v5 p6v6 p7v7 p8v8 p9v9 p10v10 p11v11 p12v12 p13v13 p14v14 p15v15"
  >
    Normal Button
  </button>
  <button
    class="p3v3 p4v4 p5v5 p6v6 p7v7 p8v8 p1v2 p2v16 p10v10 p11v11 p13v13 p9v17 p12v18 p15v15 p14v19"
  >
    Primary Button
  </button>
</div>
```

StyleSheet:

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
@media (max-width: 500px) {.p14v14 { width: 5px;}.p15v15 {overflow: hidden;}.p14v19 {width: auto;}}
.p1v2 { --background: #ff0000; }
.p2v16 { --color: white; }
.p9v17:hover { color: greenyellow; }
.p12v18::before { content: ' ☀︎ '; }
```

## SSR (Server Side Rendering)

```jsx
const { jsx, getStyleSheet, getStyleTags } = createStyleCollector(<App />);
      
const html = React.renderToString(jsx);

getStyleSheet() // return all style rules
getStyleTags()  // return all style rules + tag <style>...</style>
```