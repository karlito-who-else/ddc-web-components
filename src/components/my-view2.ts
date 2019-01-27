import { html } from "lit-element";

import { connect } from "pwa-helpers/connect-mixin.js";

import { PageViewElement } from "./page-view-element.js";

import { SharedStyles } from "./shared-styles.js";

import "./customer-capture-form.js";

import { i18next, localize } from "../localisation.js";
import { store, RootState } from "../store.js";

class MyView2Connected extends connect(store)(PageViewElement) {}

class MyView2 extends localize(i18next)(MyView2Connected) {
  protected render() {
    return html`
      ${SharedStyles}
      <style>
        customer-capture-form {
        }
      </style>
      <section>
        <h2>Static page 2</h2>
        <p>This is a text-only page.</p>
        <p>It doesn't do anything other than display some static text.</p>
      </section>
      <customer-capture-form></customer-capture-form>
    `;
  }

  stateChanged(state: RootState) {
    this._appLanguage = state.app!.appLanguage;
    this._customerLanguage = state.app!.customerLanguage;
  }
}

window.customElements.define("my-view2", MyView2);
