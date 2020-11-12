import * as React from "react";
import axios, { AxiosResponse } from "axios";
import { Feature } from "./types";

const REQUEST = "request";
const SUCCESS = "success";
const FAILURE = "failure";
const INCREMENT = "increment";
const DECREMENT = "decrement";

const api = axios.create();

const fetchFeaturesRequest = (): Action => ({
  type: REQUEST
});
const fetchFeaturesFailure = (error: string): Action => ({
  type: FAILURE,
  payload: error
});
const fetchFeatureSuccess = (features: Feature[]): Action => ({
  type: SUCCESS,
  payload: features
});

type Action =
  | { type: typeof INCREMENT }
  | { type: typeof DECREMENT }
  | {
      type: typeof REQUEST;
    }
  | {
      type: typeof FAILURE;
      payload: string;
    }
  | {
      type: typeof SUCCESS;
      payload: Feature[];
    };
type Dispatch = (action: Action) => void;
interface NormalizedFeatures {
  [key: string]: Feature[];
}
type State = {
  count: number;
  isFetching: boolean;
  entities: Feature[];
  normalized: NormalizedFeatures;
  error: any;
};
type CountProviderProps = { children: React.ReactNode };

const CountStateContext = React.createContext<State | undefined>(undefined);
const CountDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
);

const countReducer = (state: State, action: Action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    case REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case SUCCESS: {
      const normalized = action.payload.reduce<NormalizedFeatures>(
        (acc, curr) => {
          curr.tags.forEach((tag) => {
            if (Object.keys(acc).includes(tag)) {
              acc[tag] = [...acc[tag], curr];
            } else {
              acc[tag] = [curr];
            }
          });
          return acc;
        },
        {}
      );
      return {
        ...state,
        isFetching: false,
        entities: action.payload,
        error: null,
        normalized
      };
    }
    default:
      throw new Error("Unhandled action type");
  }
};

const res: Feature[] = [
  {
    name: "Decrement",
    description: "Decrement enabler",
    tags: ["decrement"],
    constraints: [
      {
        dataScope: '{"countryId": "AU"}',
        enabled: true
      }
    ]
  }
];
const fetchFeatures = async (dispatch: Dispatch) => {
  dispatch(fetchFeaturesRequest());
  try {
    let returns: Feature[];

    console.info(process.env);
    if (process.env.NODE_ENV === "production") {
      const response: AxiosResponse<Feature[]> = await api.get("/api/features");
      returns = response.data;
    } else {
      returns = res;
    }
    dispatch(fetchFeatureSuccess(returns));
  } catch (error) {
    dispatch(fetchFeaturesFailure("some error"));
  }
};

const CountProvider = ({ children }: CountProviderProps) => {
  const [state, dispatch] = React.useReducer(countReducer, {
    count: 0,
    isFetching: false,
    entities: [],
    normalized: {},
    error: null
  });
  return (
    <CountStateContext.Provider value={state}>
      <CountDispatchContext.Provider value={dispatch}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  );
};

const useCountState = () => {
  const context = React.useContext(CountStateContext);
  if (context === undefined) {
    throw new Error("useCountState must be used withing a CountProvider");
  }
  return context;
};

const useCountDispatch = () => {
  const context = React.useContext(CountDispatchContext);
  if (context === undefined) {
    throw new Error("useCountState must be used withing a CountProvider");
  }
  return context;
};

export { CountProvider, useCountState, useCountDispatch, fetchFeatures };
