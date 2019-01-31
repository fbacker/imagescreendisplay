import moment from "moment";
import _ from "lodash";
import {
  SETTING_ASSETS_FILTER_DATE_FROM,
  SETTING_ASSETS_FILTER_DATE_TO,
  SETTING_ASSETS_FILTER_USER,
  SETTING_ASSETS_FILTER_GENERAL,
  SETTING_HISTORY_DAYS
} from "../types";

const initialState = {
  assetsFilterDateFrom: moment()
    .subtract(3, "month")
    .unix(),
  assetsFilterDateTo: moment().unix(),
  assetsFilterUsers: [],
  historyDays: 30,
  assetsFilterGeneral: "normal"
};
export default function requests(state = initialState, action) {
  switch (action.type) {
    case SETTING_ASSETS_FILTER_GENERAL:
      return Object.assign({}, state, { assetsFilterGeneral: action.payload });
    case SETTING_ASSETS_FILTER_DATE_FROM:
      return Object.assign({}, state, { assetsFilterDateFrom: action.payload });
    case SETTING_ASSETS_FILTER_DATE_TO:
      return Object.assign({}, state, { assetsFilterDateTo: action.payload });
    case SETTING_ASSETS_FILTER_USER:
      let list = [...state.assetsFilterUsers];
      const index = _.indexOf(list, action.payload);
      if (index === -1) {
        list.push(action.payload);
      } else {
        list.splice(index, 1);
      }
      return Object.assign({}, state, { assetsFilterUsers: list });
    case SETTING_HISTORY_DAYS:
      return Object.assign({}, state, { historyDays: action.payload });
    default:
      return state;
  }
}
