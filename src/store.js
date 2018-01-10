import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { routerMiddleware, routerReducer } from "react-router-redux";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import { composeWithDevTools } from "remote-redux-devtools";
import {
  reactReduxFirebase,
  firebaseReducer,
  getFirebase
} from "react-redux-firebase";
import firebase from "firebase";
import mirReducer from "./modules";
import { MIR_TWIST_LOAD } from "./constants";
import { fireconfig } from "./utils/config.json";
import Twist from "./twist-api";

const rrfConfig = {
  userProfile: "users",
  enableLogging: false,
  fileMetadataFactory: uploadRes => {
    // upload response from Firebase's storage upload
    const { metadata: { downloadURLs } } = uploadRes;
    // default factory includes name, fullPath, downloadURL
    return downloadURLs[0];
  },
  resetBeforeLogin: false
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
  routing: routerReducer,
  mir: mirReducer
});

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  applyMiddleware(...middleware),
  ...enhancers
)(createStore);

const store = createStoreWithFirebase(rootReducer, initialState);

const twistInit = twist => {
  return {
    type: MIR_TWIST_LOAD,
    twist
  };
};

const twistLoad = async () => {
  let state = store.getState();
  if (state.mir && state.mir.twist) return null;
  else Twist.load().then(twist => store.dispatch(twistInit(twist)));
};

twistLoad();

export default store;
