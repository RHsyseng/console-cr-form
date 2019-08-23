import * as ActionTypes from "./action-types";

export const updateSteps = steps => ({
  type: ActionTypes.UPDATE_STEPS,
  payload: steps
});
