import {
  LitElement,
  html,
  // property,
  TemplateResult
} from "lit-element";

import { connect } from "pwa-helpers/connect-mixin.js";

import { SharedStyles } from "./shared-styles.js";

import { i18next, localize } from "../localisation.js";
import { store, RootState } from "../store.js";

import "@json-editor/json-editor";

class CustomerCaptureFormConnected extends connect(store)(LitElement) {}

class CustomerCaptureForm extends localize(i18next)(
  CustomerCaptureFormConnected
) {
  //   @property({ type: String })
  //   private _appLanguage = "en";

  //   @property({ type: String })
  //   private _customerLanguage = "en";

  private constructor() {
    super();

    this.renderForm();
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
      <div id="editor"></div>
    `;
  }

  private renderForm: Function = async () => {
    await this.updateComplete;

    const element = this.shadowRoot!.querySelector("#editor");

    const schema = await this.formFields();

    JSONEditor.defaults.themes.clean = function() {
      const theme = new JSONEditor.defaults.themes.barebones();

      theme.getIndentedPanel = function() {
        const el = document.createElement("form");

        el.id = "capture";
        el.style = el.style || {};

        return el;
      };

      return theme;
    };

    const myengine = {
      compile: function(template) {
        console.log("template", template);
        const translated = i18next.t(template);
        console.log("translated", translated);
        return translated;
      }
    };

    JSONEditor.defaults.editors.object.options.hidden = true;
    // JSONEditor.defaults.editors.object.options.disable_array_add = true;
    // JSONEditor.defaults.editors.object.options.disable_array_delete = true;
    // JSONEditor.defaults.editors.object.options.disable_array_reorder = true;
    // JSONEditor.defaults.editors.object.options.disable_collapse = true;
    // JSONEditor.defaults.editors.object.options.disable_edit_json = true;
    // JSONEditor.defaults.editors.object.options.disable_properties = true;
    JSONEditor.defaults.options.theme = "clean";
    JSONEditor.defaults.options.template = myengine;

    const options = {
      compact: true,
      disable_array_add: true,
      disable_array_delete: true,
      disable_array_reorder: true,
      disable_collapse: true,
      disable_edit_json: true,
      disable_properties: true,
      form_name_root: "capture",
      schema
    };

    const editor = new JSONEditor(element, options);

    editor.on("ready", () => {
      const errors = editor.validate();

      if (errors.length) {
        console.error(errors);
      } else {
        console.info("It's valid!");
      }

      // editor.disable();

      const name = editor.getEditor("root.first_name");

      if (name) {
        name.setValue("John Smith");

        console.log(name.getValue());
      }

      // editor.on("change", event => {
      //   console.log("change", event);
      // });

      // editor.watch("path.to.field", event => {
      //   console.log("watch", event);
      // });
    });
  };

  get updateComplete() {
    return (async () => {
      return await super.updateComplete;
    })();
  }

  async formFields() {
    const response = await fetch("schemas/customer-capture-form.json");

    const json = await response.json();

    return json;
  }

  stateChanged(state: RootState) {
    this._appLanguage = state.app!.appLanguage;
    this._customerLanguage = state.app!.customerLanguage;
    // this._nameLastRomajiHidden = nameLastRomajiHiddenSelector(state);
  }
}

customElements.define("customer-capture-form", CustomerCaptureForm);
