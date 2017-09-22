/* @flow */
import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import MainContainer from "containers/MainContainer";
import createStore from "scripts/createStore";

import type { Store } from "redux";
import type { Action, RootState } from "scripts/types";

const store: Store<RootState, Action<*>> = createStore();

ReactDOM.render(
  <Provider store={store}>
    <MainContainer />
  </Provider>,
  document.getElementById("app")
);
