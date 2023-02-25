![atyled](https://user-images.githubusercontent.com/1549069/221021089-c41b03e0-ef6f-4835-bc10-669d44d19bb3.png)

## atomic + styled-component

### This library inspired by styled-components, but:

- It generate atomic classes
- Final stylesheet is very optimized and small
- It tiny and less than 2KB
- SSR support
- Faster than styled-components
- No overwrite rules
- No dependencies

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
    font-size: 15px;
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
