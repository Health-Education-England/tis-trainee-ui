import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import { Main } from "../../../components/main/Main";
import { updatedTraineeProfileStatus } from "../../../redux/slices/traineeProfileSlice";
import { updatedReferenceStatus } from "../../../redux/slices/referenceSlice";
import history from "../../../components/navigation/history";
import React from "react";
import { updatedPreferredMfa } from "../../../redux/slices/userSlice";

describe("Main", () => {
  it("should return Loading comp if data loading ", () => {
    const MockedMainLoading = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("loading"));
      return <Main signOut={null} appVersion="1.0.0" />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedMainLoading />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=BtnMenu]").should("not.exist");
  });
  it("should show only support and MFA set-up nav if NOMFA set", () => {
    const MockedMainNOMFA = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("succeeded"));
      dispatch(updatedReferenceStatus("succeeded"));
      return <Main signOut={null} appVersion="1.0.0" />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedMainNOMFA />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=Support]").should("exist");
    cy.get('[data-cy="MFA set-up"]').should("exist");
    cy.get("[data-cy=Profile]").should("not.exist");
  });
  it("should load the full nav menu if preferred MFA is not NOMFA", () => {
    const MockedMainSuccessSMS = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("succeeded"));
      dispatch(updatedReferenceStatus("succeeded"));
      dispatch(updatedPreferredMfa("SMS"));
      return <Main signOut={null} appVersion="1.0.0" />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedMainSuccessSMS />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=Support]").should("exist");
    cy.get('[data-cy="MFA set-up"]').should("exist");
    cy.get("[data-cy=Profile]").should("exist");
    cy.get('[data-cy="Form R (Part A)"]').should("exist");
    cy.get('[data-cy="Form R (Part B)"]').should("exist");
    cy.get("[data-cy=versionText]").should("include.text", "version: 1.0.0");
  });
  it("should not load the Menu page if Reference status is failed", () => {
    const MockedMainFailed = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("failed"));
      dispatch(updatedReferenceStatus("succeeded"));
      return <Main signOut={null} appVersion="1.0.0" />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedMainFailed />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=BtnMenu]").should("not.exist");
  });
});
