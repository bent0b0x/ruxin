/* @flow */
import { createStore, applyMiddleware } from "redux";
import Reducer from "state/index";
import thunk from "redux-thunk";
// import { composeWithDevTools } from "remote-redux-devtools";

import type { Action, RootState } from "scripts/types";
import type { Store } from "redux";

export default () => {
  // const composeEnhancers = composeWithDevTools({ realtime: true });

  const store: Store<RootState, Action<*>> = createStore(
    Reducer,
    // composeEnhancers(applyMiddleware(thunk, sagaMiddleware)) ||
    applyMiddleware(thunk)
  );

  return store;
};
