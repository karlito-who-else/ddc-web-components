import { Reducer } from "redux";
import {
  UPDATE_PAGE,
  UPDATE_OFFLINE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  UPDATE_DRAWER_STATE,
  UPDATE_APP_LANGUAGE,
  UPDATE_CUSTOMER_LANGUAGE
} from "../actions/app.js";
import { RootAction } from "../store.js";

export interface AppState {
  page: string;
  offline: boolean;
  drawerOpened: boolean;
  snackbarOpened: boolean;
  appLanguage: string;
  customerLanguage: string;
}

const INITIAL_STATE: AppState = {
  page: "",
  offline: false,
  drawerOpened: false,
  snackbarOpened: false,
  appLanguage: "en",
  customerLanguage: "en"
};

const app: Reducer<AppState, RootAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page
      };
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      };
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened
      };
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true
      };
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false
      };
    case UPDATE_APP_LANGUAGE:
      return {
        ...state,
        appLanguage: action.appLanguage
      };
    case UPDATE_CUSTOMER_LANGUAGE:
      return {
        ...state,
        customerLanguage: action.customerLanguage
      };
    default:
      return state;
  }
};

export default app;
