import { LitElement, html, property, TemplateResult } from "lit-element";

import ValidForm from "@pageclip/valid-form";

import { SharedStyles } from "./shared-styles.js";

import { i18nextApp, i18nextCustomer, localize } from "../localisation.js";

import { jsonSchemaToFormMarkup } from "../json-schema-to-form-markup.js";

class CustomerCaptureForm extends localize(i18nextApp, i18nextCustomer)(
  LitElement
) {
  @property({ type: HTMLElement })
  private _form;

  // @property({ type: TemplateResult })
  // private _formFields;

  @property({ type: String })
  private _title = i18nextApp.t("app:title");

  private constructor() {
    super();

    this.setupForm();

    i18nextCustomer.on("languageChanged", () => {
      this.updateElement();
    });
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
      <h1>${this._title}</h1>
      ${this._form}
    `;
  }

  private async addValidation() {
    await this.updateComplete;

    const formSelector = this.shadowRoot.getElementById(
      "customer-capture-form"
    );

    ValidForm(formSelector, {
      customMessages: {
        valueMissing: "Enter something, plz",
        patternMismatch: "Just give me a's and b's",
        rangeOverflow: "Number too low!",
        rangeUnderflow: "Number too high!",
        stepMismatch: "Step doesn't fit into my notches!",
        tooLong: "Text is too long",
        tooShort: "Text is too short",
        typeMismatch: "Hey, this isn't the correct type",
        badInput: "Something bad happened",

        // Special mismatches for different input types: `${type}Mismatch`
        emailMismatch: "Hey, this isn't an email",
        urlMismatch: "Not a URL :(",
        numberMismatch: "Nope, not a number!"
      }
    });

    formSelector.addEventListener("submit", async event => {
      event.preventDefault();

      const valid = formSelector.checkValidity();

      console.log("valid", valid);

      const formData = new FormData(formSelector);

      const response = await fetch("http://localhost:8081/myForm", {
        method: "POST",
        body: formData
      });

      console.log("response.json()", response.json());
    });
  }

  private async generateFormElement() {
    const response = await fetch("schemas/customer-capture-form.json");
    const schema = await response.json();

    return html`
      <form
        dir="${i18nextCustomer.dir(i18nextCustomer.language)}"
        id="customer-capture-form"
        lang="${i18nextCustomer.language}"
        method="POST"
      >
        ${jsonSchemaToFormMarkup(schema)} <button>Submit</button>
      </form>
    `;
  }

  private async setupForm() {
    await this.updateComplete;

    this._form = await this.generateFormElement();

    await this.addValidation();
  }

  private async updateElement() {
    this._form = await this.generateFormElement();
    this._title = i18nextApp.t("app:title");
  }

  get updateComplete() {
    return (async () => {
      return await super.updateComplete;
    })();
  }
}

customElements.define("customer-capture-form", CustomerCaptureForm);
