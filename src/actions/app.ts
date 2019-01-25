import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store.js";

import { i18next } from "../localisation.js";

export const UPDATE_PAGE = "UPDATE_PAGE";
export const UPDATE_OFFLINE = "UPDATE_OFFLINE";
export const UPDATE_DRAWER_STATE = "UPDATE_DRAWER_STATE";
export const OPEN_SNACKBAR = "OPEN_SNACKBAR";
export const CLOSE_SNACKBAR = "CLOSE_SNACKBAR";
export const UPDATE_APP_LANGUAGE = "UPDATE_APP_LANGUAGE";
export const UPDATE_CUSTOMER_LANGUAGE = "UPDATE_CUSTOMER_LANGUAGE";

export interface AppActionUpdatePage extends Action<"UPDATE_PAGE"> {
  page: string;
}
export interface AppActionUpdateOffline extends Action<"UPDATE_OFFLINE"> {
  offline: boolean;
}
export interface AppActionUpdateDrawerState
  extends Action<"UPDATE_DRAWER_STATE"> {
  opened: boolean;
}
export interface AppActionOpenSnackbar extends Action<"OPEN_SNACKBAR"> {}
export interface AppActionCloseSnackbar extends Action<"CLOSE_SNACKBAR"> {}
export interface AppActionUpdateAppLanguage
  extends Action<"UPDATE_APP_LANGUAGE"> {
  appLanguage: string;
}
export interface AppActionUpdateCustomerLanguage
  extends Action<"UPDATE_CUSTOMER_LANGUAGE"> {
  customerLanguage: string;
}
export type AppAction =
  | AppActionUpdatePage
  | AppActionUpdateOffline
  | AppActionUpdateDrawerState
  | AppActionOpenSnackbar
  | AppActionCloseSnackbar
  | AppActionUpdateAppLanguage
  | AppActionUpdateCustomerLanguage;

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

export const navigate: ActionCreator<ThunkResult> = (
  path: string
) => dispatch => {
  // Extract the page name from path.
  const page = path === "/" ? "view1" : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  dispatch(updateDrawerState(false));
};

const loadPage: ActionCreator<ThunkResult> = (page: string) => dispatch => {
  switch (page) {
    case "view1":
      import("../components/my-view1.js").then(() => {
        // Put code in here that you want to run every time when
        // navigating to view1 after my-view1.js is loaded.
      });
      break;
    case "view2":
      import("../components/my-view2.js");
      break;
    case "view3":
      import("../components/my-view3.js");
      break;
    default:
      page = "view404";
      import("../components/my-view404.js");
  }

  dispatch(updatePage(page));
};

const updatePage: ActionCreator<AppActionUpdatePage> = (page: string) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

let snackbarTimer: number;

export const showSnackbar: ActionCreator<ThunkResult> = () => dispatch => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  window.clearTimeout(snackbarTimer);
  snackbarTimer = window.setTimeout(
    () => dispatch({ type: CLOSE_SNACKBAR }),
    3000
  );
};

export const updateOffline: ActionCreator<ThunkResult> = (offline: boolean) => (
  dispatch,
  getState
) => {
  // Show the snackbar only if offline status changes.
  if (offline !== getState().app!.offline) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateDrawerState: ActionCreator<AppActionUpdateDrawerState> = (
  opened: boolean
) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};

export const updateAppLanguage: ActionCreator<AppActionUpdateAppLanguage> = (
  appLanguage: string = "en"
) => {
  i18next.changeLanguage(appLanguage, (error, t) => {
    if (error) {
      return console.log("something went wrong loading", error);
    }

    t("title"); // -> same as i18next.t
  });

  return {
    type: UPDATE_APP_LANGUAGE,
    appLanguage
  };
};

export const updateCustomerLanguage: ActionCreator<
  AppActionUpdateCustomerLanguage
> = (customerLanguage: string = "en") => {
  i18next.changeLanguage(customerLanguage, (error, t) => {
    if (error) {
      return console.log("something went wrong loading", error);
    }

    t("title"); // -> same as i18next.t
  });

  return {
    type: UPDATE_CUSTOMER_LANGUAGE,
    customerLanguage
  };
};
