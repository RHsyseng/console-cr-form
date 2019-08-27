import * as ActionTypes from "./action-types";

export const updateSteps = steps => ({
  type: ActionTypes.UPDATE_STEPS,
  payload: steps
});

export const storeSteps = steps => ({
  type: ActionTypes.STORE_STEPS,
  payload: steps
});
