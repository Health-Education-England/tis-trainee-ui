import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import GlobalAlert from "../../../components/main/GlobalAlert";
import history from "../../../components/navigation/history";
import { mockProgrammeMembershipCojNotSigned } from "../../../mock-data/trainee-profile";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { updatedUnsignedCojs } from "../../../redux/slices/traineeProfileSlice";
import store from "../../../redux/store/store";
import React from "react";
import {
  updatedPreferredMfa,
  updatedRedirected
} from "../../../redux/slices/userSlice";
import { updatedFormAList } from "../../../redux/slices/formASlice";
import { mockFormList } from "../../../mock-data/formr-list";
import { updatedFormBList } from "../../../redux/slices/formBSlice";

describe("GlobalAlert", () => {
  it("should not render the Global Alert if the user has not set their MFA", () => {
    const MockedGlobalAlert = () => {
      return <GlobalAlert />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedGlobalAlert />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=globalAlert]").should("not.exist");
  });

  it("should render the Global Action Summary Alert but no Action Summary if bookmark is false (no redirect) and the Action Summary is true (no submitted Form R)", () => {
    const MockedGlobalNoBookmarkButAction = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedPreferredMfa("SMS"));
      return <GlobalAlert />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedGlobalNoBookmarkButAction />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=globalAlert]").should("exist");
    cy.get("[data-cy=bookmarkAlert]").should("not.exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("exist");
  });

  it("should render the Global Action Summary Alert but no Bookmark if bookmark is false (no redirect) and the Action Summary is true (year plus since last submitted Form R)", () => {
    const MockedGlobalNoBookmarkButAction = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormAList([mockFormList[2]]));
      dispatch(updatedFormAList([mockFormList[3]]));
      return <GlobalAlert />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedGlobalNoBookmarkButAction />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=globalAlert]").should("exist");
    cy.get("[data-cy=bookmarkAlert]").should("not.exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("exist");
  });

  it("should render Global Bookmark alert (redirect is true) but no Action Summary (recent submitted Form R, no unsigned CoJ)", () => {
    const MockedGlobalBookmarkNoAction = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedRedirected(true));
      dispatch(updatedFormAList([mockFormList[0]]));
      dispatch(updatedFormBList([mockFormList[1]]));
      return <GlobalAlert />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedGlobalBookmarkNoAction />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=globalAlert]").should("exist");
    cy.get("[data-cy=bookmarkAlert]").should("exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("not.exist");
  });

  it("should render Global Bookmark and Action Summary alerts if redirect is true and unsigned CoJ is true", () => {
    const MockedGlobalAlertRedirectAndUnsignedCoj = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedRedirected(true));
      dispatch(updatedUnsignedCojs([mockProgrammeMembershipCojNotSigned]));
      return <GlobalAlert />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedGlobalAlertRedirectAndUnsignedCoj />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=globalAlert]").should("exist");
    cy.get("[data-cy=bookmarkAlert]").should("exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("exist");
  });
});
