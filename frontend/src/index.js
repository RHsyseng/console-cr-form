// prettier-ignore
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { Reducers } from "./redux";
import "@patternfly/react-core/dist/styles/base.css";
import OperatorWizard from "./component/operator-wizard/OperatorWizard";

let reducers = combineReducers(Reducers);
let store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

document.addEventListener("DOMContentLoaded", function() {
  ReactDOM.render(
    <Provider store={store}>
      <OperatorWizard />
    </Provider>,
    document.getElementById("mount")
  );
});
