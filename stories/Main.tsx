import React, { useState } from "react";
import atyled from "../src/index";

const Container = atyled.div`
  color: white;
  background-color: blue;
`;

const Title = atyled.h1`
  color: white;
`;

const Head = atyled.span`
  color: green;
  font-size: 50px;
`;

const Body = atyled.h3`
  --fontSize: 12px;
  color: yellow;
  font-size: var(--fontSize);
`;

const Head2 = atyled(Head)`
  color: red;
`;

const Button = atyled.button`
  color: white;
`;

const ButtonPlus = atyled(Button)`
  background-color: green;
`;

const ButtonMinus = atyled(Button)`
  background-color: red;
`;

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <Container>
      <Title>I'm title</Title>
      <Head>I'm head</Head>
      <Body>I'm body with 12px font size</Body>
      <Body
        style={{
          "--fontSize": "20px"
        }}
      >
        I'm body with 20px font size
        <br />
        <Head2>Head 2</Head2>
        <br />
        <ButtonPlus onClick={() => setCount((c) => c + 1)}>
          Plus: {count}
        </ButtonPlus>
        <br />
        <ButtonMinus onClick={() => setCount((c) => c - 1)}>
          Minus: {count}
          <span> inner </span>
        </ButtonMinus>
      </Body>
    </Container>
  );
}
