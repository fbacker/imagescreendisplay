import moment from "moment";
import { REQUESTS_CLEAR, REQUEST_BEGIN, REQUEST_RESPONSE } from "../types";

/*
interface IRequest {
  running: boolean;
  success: boolean;
  message: string;
  updated: number;
  requestId: string;
}
*/
const initialState = {};
export default function requests(state = initialState, action) {
  switch (action.type) {
    case REQUESTS_CLEAR:
      return Object.assign({}, initialState);
    case REQUEST_BEGIN:
      return {
        ...state,
        [action.id]: {
          isRequest: true,
          success: false,
          message: null,
          updated: moment().unix(),
          requestId: action.requestId
        }
      };
    case REQUEST_RESPONSE:
      return {
        ...state,
        [action.id]: {
          isRequest: false,
          success: action.success,
          message: action.message,
          updated: moment().unix()
        }
      };
    default:
      return state;
  }
}
