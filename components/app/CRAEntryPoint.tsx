import React, { useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Router } from "react-router-dom";
import { Main } from "../main/Main";
import browserUpdateConfig from "../../browser-update-config.json";
import TagManager from "react-gtm-module";
import history from "../navigation/history";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tagManagerArgs = {
  gtmId: "GTM-5PWDC87"
};

function CRAEntryPoint() {
  TagManager.initialize(tagManagerArgs);

  // Dynamically imported browser-update module (see https://github.com/browser-update/browser-update/issues/524 for more info)
  // Also added a nomodule script tag in _app.tsx to catch IE and other browsers that don't support ES modules (see e.g. https://stackoverflow.com/questions/74154325/warning-ie11-users-their-browser-is-unsupported-in-react-18)

  useEffect(() => {
    (async () => {
      try {
        const browserUpdateModule = await import("browser-update");
        const browserUpdate = browserUpdateModule.default;
        browserUpdate(browserUpdateConfig);
      } catch (error) {
        console.error("Failed to load browser-update: ", error);
      }
    })();
  }, []);

  return (
    <Authenticator initialState="signIn" variation="default">
      {() => (
        <Router history={history}>
          <>
            <ToastContainer
              transition={Zoom}
              limit={2}
              hideProgressBar={true}
            />
            <Main />
          </>
        </Router>
      )}
    </Authenticator>
  );
}

export default CRAEntryPoint;
