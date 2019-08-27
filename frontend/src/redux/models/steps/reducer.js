import * as ActionTypes from "./action-types";
import Formatter from "../../../utils/formatter";

const initialState = {
  stepList: [],
  originalStepList: []
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.STORE_STEPS:
      return Formatter.extend(state, { originalStepList: action.payload });
    case ActionTypes.UPDATE_STEPS:
      return Formatter.extend(state, { stepList: action.payload });
    default:
      return state;
  }
};
