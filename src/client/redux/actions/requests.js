
import uniqid from "uniqid";
import { REQUESTS_CLEAR, REQUEST_BEGIN, REQUEST_RESPONSE } from "../types";

export const requestClear = () => dispatch => {
  dispatch({ type: REQUESTS_CLEAR });
};

export const requestBegin = (id) => dispatch => {
  dispatch({
    type: REQUEST_BEGIN,
    id,
    requestId: uniqid()
  });
};

export const requestResponse = (
  id,
  success = false,
  message = null
) => dispatch => {
  dispatch({ type: REQUEST_RESPONSE, id, success, message });
};
