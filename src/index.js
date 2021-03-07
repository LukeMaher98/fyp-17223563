import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "./containers/AppContainer";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import * as serviceWorker from "./serviceWorker";
import Firebase, { FirebaseContext } from "./firebase";
import AWS, { AWSContext } from "./AWS";

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <AWSContext.Provider value={new AWS()}>
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </AWSContext.Provider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
