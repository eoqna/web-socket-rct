// 1
import { createContext, useReducer } from "react";
import { AUTH_INFO } from "./action";

// 2
const initialState = {
  userName: "",
};

// 3
const Context = createContext({});

// 4
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_INFO:
      return {
        ...state,
        userName: action.payload,
      };
    default:
      return state;
  }
};

// 5
const StoreProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Context.Provider value={value}>{children}</Context.Provider> 
};

export { Context, StoreProvider };