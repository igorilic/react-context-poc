import * as React from "react";
import {
  CountProvider,
  fetchFeatures,
  useCountDispatch,
  useCountState
} from "./FeatureToggle";

const CountDisplay = () => {
  const count = useCountState();
  return <div>{`The current count is ${count.count}`}</div>;
};

const Counter = () => {
  const dispatch = useCountDispatch();
  const state = useCountState();
  React.useEffect(() => {
    fetchFeatures(dispatch);
  }, [dispatch]);
  if (state.isFetching) {
    return <div>Loading...</div>;
  }
  console.log(state.normalized);
  return (
    <div>
      <div>
        {state.entities.map((e) => (
          <div key={e.name}>{e.name}</div>
        ))}
      </div>
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
