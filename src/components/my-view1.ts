import { html } from "lit-element";

import { connect } from "pwa-helpers/connect-mixin.js";

import { PageViewElement } from "./page-view-element.js";

import { SharedStyles } from "./shared-styles.js";

import "./customer-capture-form.js";

import { i18next, localize } from "../localisation.js";
import { store, RootState } from "../store.js";

class MyView1Connected extends connect(store)(PageViewElement) {}

class MyView1 extends localize(i18next)(MyView1Connected) {
  protected render() {
    return html`
      ${SharedStyles}
      <style>
        customer-capture-form {
        }
      </style>
      <customer-capture-form></customer-capture-form>
    `;
  }

  stateChanged(state: RootState) {
    this._appLanguage = state.app!.appLanguage;
    this._customerLanguage = state.app!.customerLanguage;
  }
}

window.customElements.define("my-view1", MyView1);
