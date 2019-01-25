import { html } from "@polymer/lit-element";

import { connect } from "pwa-helpers/connect-mixin.js";

import { PageViewElement } from "./page-view-element.js";

import { SharedStyles } from "./shared-styles.js";

import "./sample-element.js";

import { i18next, localize } from "../localisation.js";
import { store, RootState } from "../store.js";

class MyView3Connected extends connect(store)(PageViewElement) {}

class MyView3 extends localize(i18next)(MyView3Connected) {
  protected render() {
    return html`
      ${SharedStyles}
      <style>
        sample-element {
          background-color: #eee;
          width: 100%;
        }
      </style>
      <section>
        <h2>Static page 3</h2>
        <p>This is a text-only page.</p>
        <p>It doesn't do anything other than display some static text.</p>
      </section>
    `;
  }

  stateChanged(state: RootState) {
    this._appLanguage = state.app!.appLanguage;
    this._customerLanguage = state.app!.customerLanguage;
  }
}

window.customElements.define("my-view3", MyView3);
