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

[Edit on Codesandbox](https://codesandbox.io/s/atyled-readme-sample-79rco6)

```js
import atyled from 'atyled';

const Button = atyled.button`
  --background: transparent;
  --color: #FF0000;
  background: var(--background);
  color: var(--color);

  &:hover {
    color: orange;
  }

  &::before {
    content: ' ★ ';
  }
`;

const PrimaryButton = atyled(Button)`
  --background: #FF0000;
  --color: white;

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

HTML:

```html
<div class="p0v0">
  <button class="p1v1 p2v2 p3v3 p4v4 p5v5 p6v6">Normal Button</button>
  <button class="p3v3 p4v4 p1v2 p2v7 p5v5 p6v8">Primary Button</button>
</div>
```

StyleSheet:

```css
.p0v0 { text-align: center; }
.p1v1 { --background: transparent; }
.p2v2 { --color: #FF0000; }
.p3v3 { background: var(--background); }
.p4v4 { color: var(--color); }
.p5v5:hover { color: orange; }
.p6v6::before { content: " ★ "; }
.p1v2 { --background: #FF0000; }
.p2v7 { --color: white; }
.p6v8::before { content: " ☀︎ "; }
```

## SSR (Server Side Rendering)

```jsx
import { createStyleCollector } from 'atyled';

const { jsx, getStyleSheet, getStyleTags } = createStyleCollector(<App />);
const html = React.renderToString(jsx);

getStyleSheet() // return all style rules
// or
getStyleTags()  // return all style rules + tag <style>...</style>
```

## Examples

[atyled](https://codesandbox.io/s/atyled-example-1-vxhd58)

[atyled + nodejs](https://codesandbox.io/p/sandbox/cold-rain-i0b7q4?file=%2FREADME.md)

[atyled + express](https://codesandbox.io/p/sandbox/gracious-lucy-51542e?file=%2FREADME.md)

[atyled + nextjs](https://codesandbox.io/p/sandbox/fast-breeze-4bxfz1?file=%2FREADME.md)

[atyled + remix](https://codesandbox.io/p/sandbox/atyled-gxp00f?file=%2FREADME.md)