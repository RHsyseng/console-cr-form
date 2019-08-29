import * as Actions from "./actions";

export const dispatcher = dispatch => {
  return {
    dispatchUpdatePages: pages => dispatch(Actions.updatePages(pages)),
    dispatchStorePages: pages => dispatch(Actions.storePages(pages))
  };
};
