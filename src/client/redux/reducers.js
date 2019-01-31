import { combineReducers } from "redux";
import server from "./reducers/server";
import requests from "./reducers/requests";
import settings from "./reducers/settings";

export default combineReducers({
  server,
  requests,
  settings
});
