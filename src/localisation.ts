import i18next from "i18next";
// import ChainedBackend from "i18next-chained-backend";
// import LocalStorageBackend from "i18next-localstorage-backend"; // primary use cache
import XHRBackend from "i18next-xhr-backend"; // fallback xhr load

let _i18nextInitialized = false;

i18next
  // .use(ChainedBackend)
  .use(XHRBackend)
  .init({
    fallbackLng: "en",
    // debug: true,
    ns: ["app", "customer-capture-form", "general"],
    // ns: ["app"],
    // defaultNS: "app",
    backend: {
      loadPath: "locales/{{lng}}/{{ns}}.json"
      // backends: [
      //   LocalStorageBackend, // primary
      //   XHRBackend // fallback
      // ],
      // backendOptions: [
      //   {
      //     loadPath: `/locales/{{lng}}/{{ns}}.json`
      //   }
      // ]
    }
  });

export { i18next };

export const localize = i18next => baseElement =>
  class extends baseElement {
    _shouldRender(props, changedProps, old) {
      console.log("old", old);
      // Also check active property used by PageViewElement
      return changedProps && changedProps.active
        ? props.active && _i18nextInitialized
        : _i18nextInitialized;
    }

    connectedCallback() {
      if (!_i18nextInitialized) {
        i18next.on("initialized", () => {
          _i18nextInitialized = true;
          this.requestUpdate();
        });
      }

      i18next.on("languageChanged", () => {
        this.requestUpdate();
      });

      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }
  };
