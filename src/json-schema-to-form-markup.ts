// import { dereference } from "@jdw/jst";
import { JSONSchema4 } from "json-schema";
import { html, TemplateResult } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined";
import { repeat } from "lit-html/directives/repeat";

import { dereference } from "./jst";
import { i18next } from "./localisation.js";

i18next.on("languageChanged", lng => {
  console.log("languageChanged 123", lng);
});

const getBooleanMarkup = properties => html`
  ${getLabelMarkup(properties)}<input
    type="checkbox"
    name="vehicle1"
    value="Bike"
  />
  ${getDescriptionMarkup(properties)}
`;

const getDatalistMarkup = properties => html`
  <datalist id="${properties!.id}-list">
    ${getOptionsMarkup(properties)}
  </datalist>
`;

const getDescriptionMarkup = properties =>
  html`
    <p data-description-for="${properties.id}">${properties.description}</p>
  `;

const getInputMarkup = properties => {
  const list = properties!.enum ? `${properties!.id}-list` : undefined;

  return html`
    ${getLabelMarkup(properties)}<input
      id="${properties!.id}"
      list="${ifDefined(list)}"
      name="${properties!.id}"
      placeholder="${properties!.placeholder}"
      title="${properties!.title}"
      type="${ifDefined(properties!.type)}"
    />
    ${list ? getDatalistMarkup(properties) : undefined}
    ${getDescriptionMarkup(properties)}
  `;
};

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
    id="${properties!.id}"
    name="${properties!.id}"
    placeholder="${properties!.placeholder}"
    title="${properties!.title}"
    type="${properties!.properties!.type}"
  ></select>
  ${getDescriptionMarkup(properties)}
`; // handle options

const getDefaultMarkup = properties =>
  html`
    <span id="${properties!.id}">borked: ${properties!.label}</span> ${
      getDescriptionMarkup(properties)
    }
  `;

const getLabelMarkup = properties =>
  html`
    <label for="${properties!.id}">${properties!.label}</label>
  `;

const getTextareaMarkup = properties => html`
  ${getLabelMarkup(properties)}<textarea
    id="${properties!.id}"
    name="${properties!.id}"
    placeholder="${properties!.placeholder}"
    title="${properties!.title}"
  ></textarea>
  ${getDescriptionMarkup(properties)}
`;

// const dereference = schema => {
//   for (var property in schema.properties) {
//     const $ref = schema.properties[property].$ref;

//     if ($ref[0] == "#/") {
//       const  = $ref.substring(1);

//       const referencedProperties = `${property}.$ref`;
//     } else {
//       console.error("broken reference");
//     }

//     Object.assign(schema.properties[property].$ref, {
//       description,
//       id,
//       label,
//       placeholder,
//       title
//     });
//   }
// };

export const jsonSchemaToFormMarkup = (schema: JSONSchema4) => {
  const dereferenced = dereference(schema);
  console.log("dereferenced", dereferenced);

  let fields: TemplateResult[] = [];

  for (var property in dereferenced.properties) {
    const id = property;

    const description = i18next.t(`form:${property}.description`);
    const label = i18next.t(`form:${property}.label`);
    const placeholder = i18next.t(`form:${property}.placeholder`);
    const title = i18next.t(`form:${property}.title`);

    const properties = Object.assign(dereferenced.properties[property], {
      description,
      id,
      label,
      placeholder,
      title
    });

    let field: TemplateResult;

    switch (properties!.properties!.element!.const) {
      case "input":
        switch (properties!.type) {
          case "boolean":
            field = getBooleanMarkup(properties);
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
