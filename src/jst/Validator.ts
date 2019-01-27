import Ajv from "ajv";
// import { JSONSchema7 } from "json-schema";

/**
 * Validator is a generic & re-usable schema validation system. It's primary
 * purpose is to supply AJV with some given schema set and make it convientent
 * for users to validate JSON objects against the said schema set.
 *
 */
export default class Validator extends Ajv {
  private loadedSchema;

  constructor(
    schema: object | object[],
    // key?: string | undefined = [],
    config = {}
  ) {
    // sane default config
    const cnf: {
      extendRefs: true | "ignore" | "fail" | undefined;
      allErrors: boolean;
    } = {
      extendRefs: true,
      allErrors: true
    };

    if (config) Object.assign(cnf, config);

    super(cnf);

    this.loadedSchema = [];

    // process an array of schema
    if (Array.isArray(schema)) {
      schema.forEach((v: object) => {
        this.setSchema(v);
      });
    }
    // process a single schema
    else if (typeof schema === "object") {
      this.setSchema(schema);
    }
  }

  setSchema(schema) {
    super.addSchema(schema);
    this.loadedSchema.push(schema.id);
  }

  getLoadedSchema() {
    return this.loadedSchema;
  }
}
