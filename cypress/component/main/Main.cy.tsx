import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import { Main } from "../../../components/main/Main";
import { updatedTraineeProfileStatus } from "../../../redux/slices/traineeProfileSlice";
import history from "../../../components/navigation/history";
import React from "react";
import { updatedReferenceStatus } from "../../../redux/slices/referenceSlice";
import { Authenticator } from "@aws-amplify/ui-react";

describe("Main", () => {
  const mountComponent = (
    status = "idle",
    referenceStatus: string = "idle",
    _hasCriticalError = false
  ) => {
    const MockedMain = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus(status));
      if (referenceStatus) {
        dispatch(updatedReferenceStatus(referenceStatus));
      }
      return <Main />;
    };

    mount(
      <Authenticator.Provider>
        <Provider store={store}>
          <Router history={history}>
            <MockedMain />
          </Router>
        </Provider>
      </Authenticator.Provider>
    );
  };

  it("should show loading component when data is loading", () => {
    mountComponent("loading");
    cy.get(".centreSpinner").should("exist");
    cy.get("[data-cy=BtnMenu]").should("not.exist");
  });

  it("should show error page when there is a critical error", () => {
    mountComponent("failed", "failed", true);
    cy.contains("There was an error loading the app data").should("be.visible");
    cy.contains("Please try again by refreshing the page").should("be.visible");
  });

  it("should remove the redirected parameter from the URL", () => {
    history.push("test?redirected=1&abc=123");
    mountComponent();
    cy.wait(1000);
    cy.url().then(url => expect(url.endsWith("/test?abc=123")).to.be.true);
  });

  //Note: Other GlobalAlert tests are in GlobalAlert.cy.tsx and GlobalAlert.test.tsx
});
