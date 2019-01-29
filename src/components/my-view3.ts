import { html } from "lit-element";

import { PageViewElement } from "./page-view-element.js";

import { SharedStyles } from "./shared-styles.js";

import { i18nextApp, localize } from "../localisation.js";

class MyView3 extends localize(i18nextApp)(PageViewElement) {
  protected render() {
    return html`
      ${SharedStyles}
      <style>
        sample-element {
          width: 100%;
        }
      </style>
      <sample-element></sample-element>
    `;
  }
}

window.customElements.define("my-view3", MyView3);
