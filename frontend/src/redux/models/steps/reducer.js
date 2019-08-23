import * as ActionTypes from "./action-types";
import Formatter from "../../../utils/formatter";

const initialState = {
  stepList: []
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_STEPS:
      return Formatter.extend(state, { stepList: action.payload });
    default:
      return state;
  }
};
