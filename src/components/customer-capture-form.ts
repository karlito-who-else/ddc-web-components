import { LitElement, html, property, TemplateResult } from "lit-element";

import { connect } from "pwa-helpers/connect-mixin.js";

import { Validation } from "bunnyjs/src/Validation";

import { SharedStyles } from "./shared-styles.js";

import { i18next, localize } from "../localisation.js";
import { store, RootState } from "../store.js";

import { jsonSchemaToFormMarkup } from "../json-schema-to-form-markup.js";

class CustomerCaptureFormConnected extends connect(store)(LitElement) {}

class CustomerCaptureForm extends localize(i18next)(
  CustomerCaptureFormConnected
) {
  //   @property({ type: String })
  //   private _appLanguage = "en";

  //   @property({ type: String })
  //   private _customerLanguage = "en";

  @property({ type: TemplateResult })
  private _formFields;

  @property({ type: HTMLElement })
  private _formElement;

  private constructor() {
    super();

    this.renderForm();

    this.addValidation();
  }

  public render(): TemplateResult {
    return html`
      ${SharedStyles}
      <style>
        :host {
          box-sizing: border-box;
          display: inline-grid;
          padding: 2rem;
        }
      </style>
      <form
        dir="${i18next.dir(this._customerLanguage)}"
        id="customer-capture-form"
        method="POST"
      >
        ${this._formFields} <button>Submit</button>
      </form>
    `;
  }

  private renderForm: Function = async () => {
    await this.updateComplete;

    this._formFields = await this.formFields();

    i18next.on("languageChanged", () => {
      this.renderForm();
    });
  };

  get updateComplete() {
    return (async () => {
      return await super.updateComplete;
    })();
  }

  async loadFormSchema() {
    const response = await fetch("schemas/customer-capture-form.json");

    const json = await response.json();

    return json;
  }

  async formFields() {
    const schema = await this.loadFormSchema();

    const markup = jsonSchemaToFormMarkup(schema);

    return markup;
  }

  private addValidation: Function = async () => {
    await this.updateComplete;

    this._formElement = this.shadowRoot.getElementById("customer-capture-form");
    // this._formElement = this.shadowRoot.querySelector("#customer-capture-form");

    console.log(this._formElement);

    this._formElement.onsubmit = event => {
      console.log("submit", event);
      event.preventDefault();
    };

    this._formElement.addEventListener("submit", event => {
      console.log("submit", event);
      event.preventDefault();
    });

    // this._formElement.on("submit", event => {
    //   console.log("submit", event);
    //   event.preventDefault();
    // });

    Validation.init(this._formElement, true);
    // Validation.init(this.shadowRoot.form[0], true);
  };

  stateChanged(state: RootState) {
    this._appLanguage = state.app!.appLanguage;
    this._customerLanguage = state.app!.customerLanguage;
    // this._nameLastRomajiHidden = nameLastRomajiHiddenSelector(state);
  }
}

customElements.define("customer-capture-form", CustomerCaptureForm);
