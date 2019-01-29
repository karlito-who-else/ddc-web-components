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
  fallbackLng: "en",
  ns: ["app", "customer-capture-form"]
};

const i18nextApp = i18next.createInstance();
i18nextApp
  // .use(ChainedBackend)
  .use(XHRBackend)
  .init(Object.assign({ instanceName: "i18nextApp" }, options), err => {
    if (err) {
      console.error(err);
    }
  });

const i18nextCustomer = i18next.createInstance();
i18nextCustomer
  // .use(ChainedBackend)
  .use(XHRBackend)
  .init(Object.assign({ instanceName: "i18nextCustomer" }, options), err => {
    if (err) {
      console.error(err);
    }
  });

export { i18nextApp, i18nextCustomer };

export const localize = (...i18nextInstances) => baseElement =>
  class extends baseElement {
    _shouldRender(props, changedProps, old) {
      console.log("old", old);
      // Also check active property used by PageViewElement
      return changedProps && changedProps.active ? props.active : true;
    }

    connectedCallback() {
      i18nextInstances.forEach(i18nextInstance => {
        i18nextInstance.on("initialized", () => {
          this.requestUpdate();
        });
      });

      i18nextInstances.forEach(i18nextInstance => {
        i18nextInstance.on("languageChanged", () => {
          // console.info(
          //   `Language changed on ${
          //     i18nextInstance.options.instanceName
          //   } instance`
          // );
          this.requestUpdate();
        });
      });

      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }
  };
