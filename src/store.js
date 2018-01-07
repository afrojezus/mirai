import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { routerMiddleware, routerReducer } from "react-router-redux";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import {
  reactReduxFirebase,
  firebaseReducer,
  getFirebase
} from "react-redux-firebase";
import firebase from "firebase";

import { fireconfig } from "./utils/config.json";

const rrfConfig = {
  userProfile: "users",
  enableLogging: true
};

firebase.initializeApp(fireconfig);

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [
  thunk.withExtraArgument(getFirebase),
  routerMiddleware(history)
];

if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  routing: routerReducer
});

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  applyMiddleware(...middleware),
  ...enhancers
)(createStore);

const store = createStoreWithFirebase(rootReducer, initialState);

export default store;
