import {
  SETTING_ASSETS_FILTER_DATE_FROM,
  SETTING_ASSETS_FILTER_DATE_TO,
  SETTING_ASSETS_FILTER_USER,
  SETTING_ASSETS_FILTER_GENERAL,
  SETTING_HISTORY_DAYS
} from "../types";

export const assetsFilterDateFrom = date => dispatch => {
  dispatch({ type: SETTING_ASSETS_FILTER_DATE_FROM, payload: date });
};
export const assetsFilterDateTo = date => dispatch => {
  dispatch({ type: SETTING_ASSETS_FILTER_DATE_TO, payload: date });
};
export const assetsFilterUser = id => dispatch => {
  dispatch({ type: SETTING_ASSETS_FILTER_USER, payload: id });
};
export const changeAssetsFilterGeneral = setting => dispatch => {
  dispatch({ type: SETTING_ASSETS_FILTER_GENERAL, payload: setting });
};
export const historyDays = numOfDays => dispatch => {
  dispatch({ type: SETTING_HISTORY_DAYS, payload: numOfDays });
};
