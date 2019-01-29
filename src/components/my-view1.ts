import { html } from "lit-element";

import { PageViewElement } from "./page-view-element.js";

import { SharedStyles } from "./shared-styles.js";

import "./customer-capture-form.js";

import { i18nextApp, localize } from "../localisation.js";

class MyView1 extends localize(i18nextApp)(PageViewElement) {
  protected render() {
    return html`
      ${SharedStyles}
      <customer-capture-form></customer-capture-form>
    `;
  }
}

window.customElements.define("my-view1", MyView1);
