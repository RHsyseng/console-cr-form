import * as ActionTypes from "./action-types";
import Formatter from "../../../utils/formatter";

const initialState = {
  pageList: [],
  originalPageList: []
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.STORE_PAGES:
      return Formatter.extend(state, { originalPageList: action.payload });
    case ActionTypes.UPDATE_PAGES:
      return Formatter.extend(state, { pageList: action.payload });
    default:
      return state;
  }
};
