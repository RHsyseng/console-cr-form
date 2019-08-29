import * as ActionTypes from "./action-types";

export const updatePages = pages => ({
  type: ActionTypes.UPDATE_PAGES,
  payload: pages
});

export const storePages = pages => ({
  type: ActionTypes.STORE_PAGES,
  payload: pages
});
