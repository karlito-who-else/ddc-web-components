import i18next from "i18next";
// import ChainedBackend from "i18next-chained-backend";
// import LocalStorageBackend from "i18next-localstorage-backend"; // primary use cache
import XHRBackend from "i18next-xhr-backend"; // fallback xhr load

const options = {
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
  },
  // debug: true,
  // defaultNS: "app",
  fallbackLng: "en",
  ns: ["app", "customer-capture-form", "general"]
};

// i18next
//   .use(ChainedBackend)
//   .use(XHRBackend)
//   .init(options);

const i18nextApp = i18next.createInstance();
i18nextApp.use(XHRBackend).init(options, (err, t) => {
  if (err) {
    console.error(err);
  }

  console.log(t("app:title")); // key in common namespace
});

const i18nextCustomer = i18next.createInstance();
i18nextCustomer.use(XHRBackend).init(options, (err, t) => {
  if (err) {
    console.error(err);
  }

  console.log(t("app:title")); // key in common namespace
});

export { i18nextApp, i18nextCustomer };

export const localize = i18next => baseElement =>
  class extends baseElement {
    private _i18nextInitialized = false;

    _shouldRender(props, changedProps, old) {
      console.log("old", old);
      // Also check active property used by PageViewElement
      return changedProps && changedProps.active
        ? props.active && this._i18nextInitialized
        : this._i18nextInitialized;
    }

    connectedCallback() {
      if (!this._i18nextInitialized) {
        i18next.on("initialized", () => {
          this._i18nextInitialized = true;
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
