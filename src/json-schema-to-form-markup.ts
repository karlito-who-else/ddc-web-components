// import { dereference } from "@jdw/jst";
import { JSONSchema4 } from "json-schema";
import { html, TemplateResult } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined";
import { repeat } from "lit-html/directives/repeat";

import { dereference } from "./jst";
import { i18nextCustomer } from "./localisation.js";

const getDatalistMarkup = properties => html`
  <datalist id="${properties!.id}-list">
    ${getOptionsMarkup(properties)}
  </datalist>
`;

const getDefaultMarkup = properties =>
  html`
    <span
      class="${ifDefined(properties!.properties!.class!.const)}"
      id="${properties!.id}"
      >borked: ${properties!.label}</span
    >
    ${getDescriptionMarkup(properties)}${getFeedbackMarkup(properties)}
  `;

const getDescriptionMarkup = properties =>
  html`
    <p
      class="${ifDefined(properties!.properties!.class!.const)}"
      data-for="${properties.id}"
    >
      ${properties.description}
    </p>
  `;

const getFeedbackMarkup = properties =>
  html`
    <div
      class="${ifDefined(properties!.properties!.class!.const)}"
      data-for="${properties!.id}"
    >
      Feedback
    </div>
  `;

const getInputMarkup = properties => {
  const list = properties!.enum ? `${properties!.id}-list` : undefined;

  return html`
    ${getLabelMarkup(properties)}<input
      class="${ifDefined(properties!.properties!.class!.const)}"
      disabled="${ifDefined(properties!.properties!.disabled!.const)}"
      id="${ifDefined(properties!.id)}"
      list="${ifDefined(list)}"
      maxlength="${ifDefined(properties!.maxlength)}"
      minlength="${ifDefined(properties!.minlength)}"
      name="${ifDefined(properties!.id)}"
      placeholder="${ifDefined(properties!.placeholder)}"
      required="${ifDefined(properties!.required)}"
      title="${ifDefined(properties!.title)}"
      type="${ifDefined(properties!.properties!.type!.const)}"
    />
    ${list ? getDatalistMarkup(properties) : undefined}
    ${getDescriptionMarkup(properties)}${getFeedbackMarkup(properties)}
  `;
};

const getLabelMarkup = properties =>
  html`
    <label
      class="${ifDefined(properties!.properties!.class!.const)}"
      for="${properties!.id}"
      >${properties!.label}</label
    >
  `;

const getOptionsMarkup = (properties: {
  enum: Array<{ text: string; value: string }>;
}) => html`
  ${
    repeat(
      properties!.enum,
      (i, index) =>
        html`
          <option data-index="${index}" value="${i.value}">${i.text}</option>
        `
    )
  }
`;

const getSelectMarkup = properties => html`
  ${getLabelMarkup(properties)}<select
    class="${ifDefined(properties!.properties!.class!.const)}"
    disabled="${ifDefined(properties!.properties!.disabled!.const)}"
    id="${ifDefined(properties!.id)}"
    name="${ifDefined(properties!.id)}"
    placeholder="${ifDefined(properties!.placeholder)}"
    required="${ifDefined(properties!.required)}"
    title="${ifDefined(properties!.title)}"
  >
    ${getOptionsMarkup(properties)}
  </select>
  ${getDescriptionMarkup(properties)}${getFeedbackMarkup(properties)}
`;

const getTextareaMarkup = properties => html`
  ${getLabelMarkup(properties)}<textarea
    class="${ifDefined(properties!.properties!.class!.const)}"
    disabled="${ifDefined(properties!.properties!.disabled!.const)}"
    id="${ifDefined(properties!.id)}"
    name="${ifDefined(properties!.id)}"
    placeholder="${ifDefined(properties!.placeholder)}"
    required="${ifDefined(properties!.required)}"
    title="${ifDefined(properties!.title)}"
    type="${ifDefined(properties!.properties!.type!.const)}"
  ></textarea>
  ${getDescriptionMarkup(properties)}${getFeedbackMarkup(properties)}
`;

export const jsonSchemaToFormMarkup = (
  schema: JSONSchema4,
  customerLanguage: string
) => {
  const dereferenced = dereference(schema);

  let fields: TemplateResult[] = [];

  for (var property in dereferenced.properties) {
    const id = property;

    const description = i18nextCustomer.t(
      `customer-capture-form:${property}.description`,
      { lng: customerLanguage }
    );
    const label = i18nextCustomer.t(`customer-capture-form:${property}.label`);
    const placeholder = i18nextCustomer.t(
      `customer-capture-form:${property}.placeholder`,
      { lng: customerLanguage }
    );
    const title = i18nextCustomer.t(`customer-capture-form:${property}.title`);

    const required = dereferenced.required.includes(property)
      ? true
      : undefined;

    const properties = Object.assign(dereferenced.properties[property], {
      description,
      id,
      label,
      placeholder,
      required,
      title
    });

    properties!.properties!.disabled!.const =
      properties!.properties!.disabled!.const === "true" ? true : undefined;

    let field: TemplateResult;

    switch (properties!.properties!.element!.const) {
      case "input":
        switch (properties!.type) {
          case "boolean":
            field = getInputMarkup(properties);
            break;
          case "date":
            field = getInputMarkup(properties);
            break;
          case "object":
            if (Array.isArray(properties!.enum)) {
              field = getInputMarkup(properties);
            } else {
              field = getDefaultMarkup(properties);
              console.error("properties.type not set");
            }
            break;
          case "string":
            field = getInputMarkup(properties);
            break;
          default:
            field = getDefaultMarkup(properties);
            console.error("properties.type not set");
            break;
        }
        break;
      case "select":
        field = getSelectMarkup(properties);
        break;
      case "textarea":
        field = getTextareaMarkup(properties);
        break;
      default:
        field = getDefaultMarkup(properties);
        console.error("properties.properties.element.const not set");
        break;
    }

    fields.push(field);
  }

  return fields;
};
