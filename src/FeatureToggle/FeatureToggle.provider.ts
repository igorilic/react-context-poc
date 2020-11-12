import React, { createContext, useReducer } from 'react'

type Action = {type: 'increment'} | {type: 'decrement'}
type Dispatch = (action: Action) => void
type State = {count: number}
type CountProviderProps = {children: React.ReactNode}

const CountStateContext = React.createContext<State | undefined>(undefined)
const CountDispatchContext = React.createContext<Dispatch | undefined>(undefined)

const countReducer = (state: State, action: Action) => {
  switch(action.type) {
    case 'increment':
      return {count: state.count + 1}
    case 'decrement':
      return {count: state.count - 1}
    default:
      throw new Error(`Unhandled action type: ${action.type}`) 
  }
}

const CountProvider = ({children}: CountProviderProps) => {
  const [state, dispatch] = useReducer(countReducer, {count: 0})
  return
    <CountStateContext.Provider value={state}>
      <CountDispatchContext.Provider value={dispatch}>
        {children}
      </CountDispatchContext.Provider>
}



