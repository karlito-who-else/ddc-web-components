/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { UPDATE_PAGE, UPDATE_OFFLINE, OPEN_SNACKBAR, CLOSE_SNACKBAR, UPDATE_DRAWER_STATE, UPDATE_APP_LANGUAGE, UPDATE_CUSTOMER_LANGUAGE } from "../actions/app.js";
const INITIAL_STATE = {
    page: "",
    offline: false,
    drawerOpened: false,
    snackbarOpened: false,
    appLanguage: "en",
    customerLanguage: "en"
};
const app = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_PAGE:
            return Object.assign({}, state, { page: action.page });
        case UPDATE_OFFLINE:
            return Object.assign({}, state, { offline: action.offline });
        case UPDATE_DRAWER_STATE:
            return Object.assign({}, state, { drawerOpened: action.opened });
        case OPEN_SNACKBAR:
            return Object.assign({}, state, { snackbarOpened: true });
        case CLOSE_SNACKBAR:
            return Object.assign({}, state, { snackbarOpened: false });
        case UPDATE_APP_LANGUAGE:
            return Object.assign({}, state, { appLanguage: action.appLanguage });
        case UPDATE_CUSTOMER_LANGUAGE:
            return Object.assign({}, state, { customerLanguage: action.customerLanguage });
        default:
            return state;
    }
};
export default app;
