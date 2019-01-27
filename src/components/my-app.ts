import { LitElement, html, property, PropertyValues } from "lit-element";
import { setPassiveTouchGestures } from "@polymer/polymer/lib/utils/settings.js";
import { connect } from "pwa-helpers/connect-mixin.js";
import { installMediaQueryWatcher } from "pwa-helpers/media-query.js";
import { installOfflineWatcher } from "pwa-helpers/network.js";
import { installRouter } from "pwa-helpers/router.js";
import { updateMetadata } from "pwa-helpers/metadata.js";

import { SharedStyles } from "./shared-styles.js";

// This element is connected to the Redux store.
import { store, RootState } from "../store.js";

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState,
  updateAppLanguage,
  updateCustomerLanguage
} from "../actions/app.js";

// The following line imports the type only - it will be removed by tsc so
// another import for app-drawer.js is required below.
import { AppDrawerElement } from "@polymer/app-layout/app-drawer/app-drawer.js";

// These are the elements needed by this element.
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-scroll-effects/effects/waterfall.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import { menuIcon } from "./my-icons.js";
import "./snack-bar.js";

import { i18next, localize } from "../localisation.js";

class MyAppConnected extends connect(store)(LitElement) {}

class MyApp extends localize(i18next)(MyAppConnected) {
  protected render() {
    // Anything that's related to rendering should be done in here.
    return html`
      ${SharedStyles}
      <style>
        :host {
          --app-drawer-width: 256px;
          display: block;

          --app-primary-color: #e91e63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: #78909c;
        }
      </style>

      <!-- Header -->
      <app-header condenses reveals effects="waterfall">
        <app-toolbar class="toolbar-top">
          <button
            class="menu-btn"
            title="Menu"
            @click="${this._menuButtonClicked}"
          >
            ${menuIcon}
          </button>
          <div main-title>${this.appTitle}</div>
        </app-toolbar>

        <!-- This gets hidden on a small screen-->
        <nav class="toolbar-list">
          <a ?selected="${this._page === "view1"}" href="/view1">View One</a>
          <a ?selected="${this._page === "view2"}" href="/view2">View Two</a>
          <a ?selected="${this._page === "view3"}" href="/view3">View Three</a>
        </nav>

        <div language-settings>
          <label for="app-language-selector">App language</label>
          <select
            id="app-language-selector"
            @change="${this._appLanguageSelectChanged}"
          >
            <option value="en-GB">English (British)</option>
            <option value="en-US">English (American)</option>
            <option value="ar-SA">Arabic (Saudi Arabia)</option>
          </select>

          <label for="customer-language-selector">Customer language</label>
          <select
            id="customer-language-selector"
            @change="${this._customerLanguageSelectChanged}"
          >
            <option value="en-GB">English (British)</option>
            <option value="en-US">English (American)</option>
            <option value="ar-SA">Arabic (Saudi Arabia)</option>
          </select>
        </div>
      </app-header>

      <!-- Drawer content -->
      <app-drawer
        .opened="${this._drawerOpened}"
        @opened-changed="${this._drawerOpenedChanged}"
      >
        <nav class="drawer-list">
          <a ?selected="${this._page === "view1"}" href="/view1">View One</a>
          <a ?selected="${this._page === "view2"}" href="/view2">View Two</a>
          <a ?selected="${this._page === "view3"}" href="/view3">View Three</a>
        </nav>
      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
        <my-view1 class="page" ?active="${this._page === "view1"}"></my-view1>
        <my-view2 class="page" ?active="${this._page === "view2"}"></my-view2>
        <my-view3 class="page" ?active="${this._page === "view3"}"></my-view3>
        <my-view404
          class="page"
          ?active="${this._page === "view404"}"
        ></my-view404>
      </main>

      <footer><p>&copy; brand name</p></footer>

      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? "offline" : "online"}.</snack-bar
      >

      <span>App language is ${this._appLanguage}</span>
      <span>Customer language is ${this._customerLanguage}</span>
    `;
  }

  @property({ type: String })
  appTitle = "";

  @property({ type: String })
  private _page = "";

  @property({ type: Boolean })
  private _drawerOpened = false;

  @property({ type: Boolean })
  private _snackbarOpened = false;

  @property({ type: Boolean })
  private _offline = false;

  @property({ type: String })
  private _appLanguage = "en";

  @property({ type: String })
  private _customerLanguage = "en";

  constructor() {
    super();

    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  protected firstUpdated() {
    installRouter(location =>
      store.dispatch(navigate(decodeURIComponent(location.pathname)))
    );
    installOfflineWatcher(offline => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`, () =>
      store.dispatch(updateDrawerState(false))
    );
  }

  protected updated(changedProps: PropertyValues) {
    if (changedProps.has("_page")) {
      const pageTitle = this.appTitle + " - " + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  private _menuButtonClicked() {
    store.dispatch(updateDrawerState(true));
  }

  private _drawerOpenedChanged(e: Event) {
    store.dispatch(updateDrawerState((e.target as AppDrawerElement).opened));
  }

  private _appLanguageUpdated(language) {
    store.dispatch(updateAppLanguage(language));
  }

  private _customerLanguageUpdated(language) {
    store.dispatch(updateCustomerLanguage(language));
  }

  private _appLanguageSelectChanged(event) {
    // console.log("event", event);
    this._appLanguageUpdated(event.target.value);
  }

  private _customerLanguageSelectChanged(event) {
    // console.log("event", event);
    this._customerLanguageUpdated(event.target.value);
  }

  stateChanged(state: RootState) {
    this._page = state.app!.page;
    this._offline = state.app!.offline;
    this._snackbarOpened = state.app!.snackbarOpened;
    this._drawerOpened = state.app!.drawerOpened;
    this._appLanguage = state.app!.appLanguage;
    this._customerLanguage = state.app!.customerLanguage;
  }
}

window.customElements.define("my-app", MyApp);
