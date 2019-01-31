import { createStore, compose, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import rootReducers from "../redux/reducers";

// Persist object, browser storage
const persistConfig = {
  key: "kidkview",
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: []
};
const persistedReducer = persistReducer(persistConfig, rootReducers);
const enhancer = applyMiddleware(thunk);
let composeEnhancers = compose;

if (process.env.NODE_ENV !== "production") {
  // DEV: We want redux dev tool in browser
  composeEnhancers = composeWithDevTools;
} else {
  // PROD; Add encryption and no dev tools
}

const store = createStore(persistedReducer, composeEnhancers(enhancer));
const persistor = persistStore(store, null, () => {
  // loaded and rehydrated, can occur later than rendering
});
export { store, persistor };
