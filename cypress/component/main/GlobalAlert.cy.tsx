import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import GlobalAlert from "../../../components/main/GlobalAlert";
import history from "../../../components/navigation/history";
import {
  mockOutstandingActions,
  mockProgrammeMembershipCojNotSigned
} from "../../../mock-data/trainee-profile";
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
import { IFormR } from "../../../models/IFormR";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import { TraineeAction } from "../../../models/TraineeAction";
import { updatedActionsData } from "../../../redux/slices/traineeActionsSlice";

describe("GlobalAlert", () => {
  const mountComponent = (
    redirected: boolean,
    preferredMfa?: string,
    formAList?: IFormR[],
    formBList?: IFormR[],
    unsignedCojs?: ProgrammeMembership[],
    unreviewedActions?: TraineeAction[]
  ) => {
    const MockedGlobalAlert: React.FC = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedRedirected(redirected));
      if (preferredMfa) {
        dispatch(updatedPreferredMfa(preferredMfa));
      }
      if (formAList) {
        dispatch(updatedFormAList(formAList));
      }
      if (formBList) {
        dispatch(updatedFormBList(formBList));
      }
      if (unsignedCojs) {
        dispatch(updatedUnsignedCojs(unsignedCojs));
      }
      if (unreviewedActions) {
        dispatch(updatedActionsData(unreviewedActions));
      }
      return <GlobalAlert />;
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedGlobalAlert />
        </Router>
      </Provider>
    );
  };

  it("should not render the Global Action Summary Alert if the user has not set their MFA", () => {
    mountComponent(false);
    cy.get("[data-cy=globalAlert]").should("not.exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("not.exist");
    cy.get("[data-cy=bookmarkAlert]").should("not.exist");
  });

  it("should still render the Global Bookmark alert (redirect is true) even when the user has not set their MFA", () => {
    mountComponent(true);
    cy.get("[data-cy=globalAlert]").should("exist");
    cy.get("[data-cy=bookmarkAlert]").should("exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("not.exist");
  });

  it("should render the Global Action Summary Alert but no Bookmark alert if bookmark is false (no redirect) and the Action Summary is true (no submitted Form R)", () => {
    mountComponent(false, "SMS");
    cy.get("[data-cy=globalAlert]").should("exist");
    cy.get("[data-cy=bookmarkAlert]").should("not.exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("exist");
    cy.get("[data-cy=checkFormRSubs]").should("exist");
  });

  it("should render the Global Action Summary Alert but no Bookmark alert if bookmark is false (no redirect) and the Action Summary is true (year plus since last submitted Form R)", () => {
    mountComponent(false, "SMS", [mockFormList[2]], [mockFormList[3]]);
    cy.get("[data-cy=globalAlert]").should("exist");
    cy.get("[data-cy=bookmarkAlert]").should("not.exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("exist");
    cy.get("[data-cy=checkFormRSubs]").should("exist");
  });

  it("should render Global Bookmark alert (redirect is true) but no Action Summary (recent submitted Form R, no unsigned CoJ)", () => {
    mountComponent(true, "SMS", [mockFormList[0]], [mockFormList[1]]);
    cy.get("[data-cy=globalAlert]").should("exist");
    cy.get("[data-cy=bookmarkAlert]").should("exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("not.exist");
  });

  it("should render Global Bookmark and Action Summary alerts if redirect is true and unsigned CoJ is true", () => {
    mountComponent(
      true,
      "SMS",
      [mockFormList[0]],
      [mockFormList[1]],
      [mockProgrammeMembershipCojNotSigned[0]]
    );
    cy.get("[data-cy=globalAlert]").should("exist");
    cy.get("[data-cy=bookmarkAlert]").should("exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("exist");
    cy.get("[data-cy=outstandingAction]").should("exist");
  });

  it("should render Global Bookmark and Action Summary alerts if redirect is true and unsigned CoJ is false and unreviewed action is true", () => {
    mountComponent(
      true,
      "SMS",
      [mockFormList[0]],
      [mockFormList[1]],
      [],
      [mockOutstandingActions[1]]
    );
    cy.get("[data-cy=globalAlert]").should("exist");
    cy.get("[data-cy=bookmarkAlert]").should("exist");
    cy.get("[data-cy=actionsSummaryAlert]").should("exist");
    cy.get("[data-cy=outstandingAction]").should("exist");
  });
});
