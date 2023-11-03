import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import { Main } from "../../../components/main/Main";
import { updatedTraineeProfileStatus } from "../../../redux/slices/traineeProfileSlice";
import history from "../../../components/navigation/history";
import React from "react";
import { updatedRedirected } from "../../../redux/slices/userSlice";
import { updatedReferenceStatus } from "../../../redux/slices/referenceSlice";
import { Authenticator } from "@aws-amplify/ui-react";

describe("Main", () => {
  const mountComponent = (
    status: string,
    referenceStatus?: string,
    redirected?: boolean
  ) => {
    const MockedMain: React.FC = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus(status));
      if (referenceStatus) {
        dispatch(updatedReferenceStatus(referenceStatus));
      }
      if (redirected !== undefined) {
        dispatch(updatedRedirected(redirected));
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

  it("should return Loading comp if data loading ", () => {
    mountComponent("loading");
    cy.get("[data-cy=BtnMenu]").should("not.exist");
  });

  it("should show bookmark alert when previously redirected", () => {
    mountComponent("succeeded", "succeeded", true);
    cy.get("[data-cy=bookmarkAlert]").should("exist");
  });

  it("should show bookmark alert when currently redirected", () => {
    history.push("test?redirected=1");
    mountComponent("succeeded", "succeeded", false);
    cy.get("[data-cy=bookmarkAlert]").should("exist");
  });

  it("should not show bookmark alert when not redirected", () => {
    history.push("test");
    mountComponent("succeeded", "succeeded", false);
    cy.get("[data-cy=bookmarkAlert]").should("not.exist");
  });

  it("should remove the redirected parameter from the URL", () => {
    history.push("test?redirected=1&abc=123");
    mountComponent("succeeded", "succeeded", false);
    cy.wait(1000);
    cy.url().then(url => expect(url.endsWith("/test?abc=123")).to.be.true);
  });
});
