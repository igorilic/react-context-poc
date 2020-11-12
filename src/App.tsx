import * as React from "react";
import {
  CountProvider,
  useCountDispatch,
  useCountState
} from "./FeatureToggle";

const CountDisplay = () => {
  const count = useCountState();
  return <div>{`The current count is ${count.count}`}</div>;
};

const Counter = () => {
  const dispatch = useCountDispatch();
  return (
    <div>
      <button onClick={() => dispatch({ type: "increment" })}>+ 1</button>
      <button onClick={() => dispatch({ type: "decrement" })}>- 1</button>
    </div>
  );
};

export default function App() {
  return (
    <CountProvider>
      <CountDisplay />
      <Counter />
    </CountProvider>
  );
}
