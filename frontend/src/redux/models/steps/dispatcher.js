import * as Actions from "./actions";

export const dispatcher = dispatch => {
  return {
    dispatchUpdateSteps: steps => dispatch(Actions.updateSteps(steps))
  };
};
