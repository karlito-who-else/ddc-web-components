/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import i18next from "i18next";
export const UPDATE_PAGE = "UPDATE_PAGE";
export const UPDATE_OFFLINE = "UPDATE_OFFLINE";
export const UPDATE_DRAWER_STATE = "UPDATE_DRAWER_STATE";
export const OPEN_SNACKBAR = "OPEN_SNACKBAR";
export const CLOSE_SNACKBAR = "CLOSE_SNACKBAR";
export const UPDATE_APP_LANGUAGE = "UPDATE_APP_LANGUAGE";
export const UPDATE_CUSTOMER_LANGUAGE = "UPDATE_CUSTOMER_LANGUAGE";
export const navigate = (path) => dispatch => {
    // Extract the page name from path.
    const page = path === "/" ? "view1" : path.slice(1);
    // Any other info you might want to extract from the path (like page type),
    // you can do here
    dispatch(loadPage(page));
    // Close the drawer - in case the *path* change came from a link in the drawer.
    dispatch(updateDrawerState(false));
};
const loadPage = (page) => dispatch => {
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
const updatePage = (page) => {
    return {
        type: UPDATE_PAGE,
        page
    };
};
let snackbarTimer;
export const showSnackbar = () => dispatch => {
    dispatch({
        type: OPEN_SNACKBAR
    });
    window.clearTimeout(snackbarTimer);
    snackbarTimer = window.setTimeout(() => dispatch({ type: CLOSE_SNACKBAR }), 3000);
};
export const updateOffline = (offline) => (dispatch, getState) => {
    // Show the snackbar only if offline status changes.
    if (offline !== getState().app.offline) {
        dispatch(showSnackbar());
    }
    dispatch({
        type: UPDATE_OFFLINE,
        offline
    });
};
export const updateDrawerState = (opened) => {
    return {
        type: UPDATE_DRAWER_STATE,
        opened
    };
};
export const updateAppLanguage = (appLanguage = "en") => {
    return {
        type: UPDATE_APP_LANGUAGE,
        appLanguage
    };
};
export const updateCustomerLanguage = (customerLanguage = "en") => {
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
