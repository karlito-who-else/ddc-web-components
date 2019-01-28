import { LitElement, html, property, TemplateResult } from "lit-element";

import { connect } from "pwa-helpers/connect-mixin.js";

import { SharedStyles } from "./shared-styles.js";

import { i18next, localize } from "../localisation.js";
import { store, RootState } from "../store.js";

import { jsonSchemaToFormMarkup } from "../json-schema-to-form-markup.js";

class CustomerCaptureFormConnected extends connect(store)(LitElement) {}

class CustomerCaptureForm extends localize(i18next)(
  CustomerCaptureFormConnected
) {
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
      <link rel="stylesheet" href="/styles/customer-capture-form.css" />
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

    this._formElement.addEventListener("submit", async event => {
      event.preventDefault();

      // const valid = event.path[0].checkValidity();
      const valid = this._formElement.checkValidity();
      console.log("valid", valid);

      // const formData = new FormData(event.path[0]);
      const formData = new FormData(this._formElement);

      const response = await fetch("http://localhost:8081/myForm", {
        method: "POST",
        body: formData
      });

      console.log("response.json()", response.json());
    });

    setTimeout(() => {
      this._emailPrompt = this.shadowRoot.getElementById(
        "email.address.prompt"
      );

      this._emailPrompt.addEventListener("invalid", event => {
        console.log("event", event);
      });
    }, 500);
  };

  stateChanged(state: RootState) {
    this._appLanguage = state.app!.appLanguage;
    this._customerLanguage = state.app!.customerLanguage;
  }
}

customElements.define("customer-capture-form", CustomerCaptureForm);
