/// <reference types="cypress" />

import { mount } from "cypress/react18";
import { Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import { DspIssueBtn } from "../../../components/dsp/DspIssueBtn";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { updatedCredentials } from "../../../redux/slices/dspSlice";
import { mockDspPlacementCredentials } from "../../../mock-data/dsp-credentials";
import { ConfirmProvider } from "material-ui-confirm";
describe("DSP issue button", () => {
  it("should display correct text and no issue button for a past placement", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <DspIssueBtn panelName="placement" panelId="99" isPastDate={true} />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dsp-value-placements-99"]').should(
      "include.text",
      "A past placement credential can't be added to your wallet"
    );
    cy.get('[data-cy="dsp-btn-placements-99"]').should("not.exist");
  });

  it("should enable digital staff passport button if date is not past", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <DspIssueBtn panelName="placement" panelId="17" isPastDate={false} />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dsp-key-placements-17"]').should(
      "include.text",
      "Digital Staff Passport"
    );
    cy.get('[data-cy="dsp-value-placements-17"]').should(
      "include.text",
      "This placement credential is not in your wallet"
    );
    cy.get('[data-cy="dsp-btn-placements-17"]')
      .should("not.be.disabled")
      .should("include.text", "Click to add")
      .click();
    cy.get('[data-cy="dsp-btn-placements-17"]').should(
      "include.text",
      "Please wait..."
    );
    cy.get('[data-cy="dsp-value-placements-17"]').should("not.exist");
  });

  it("should show the issue date and issue button for a matched issued placement credential", () => {
    const MockedIssuedDspIssueBtn = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedCredentials(mockDspPlacementCredentials));
      return (
        <Provider store={store}>
          <Router history={history}>
            <DspIssueBtn panelName="placement" panelId="1" isPastDate={false} />
          </Router>
        </Provider>
      );
    };
    mount(
      <Provider store={store}>
        <ConfirmProvider>
          <Router history={history}>
            <MockedIssuedDspIssueBtn />
          </Router>
        </ConfirmProvider>
      </Provider>
    );
    cy.get('[data-cy="dsp-value-placements-1"]').should(
      "include.text",
      "This placement credential was added to your wallet on 28/07/2023 18:40 (BST)"
    );
    cy.get('[data-cy="dsp-btn-placements-1"]')
      .should("include.text", "Click to add again")
      .click();
    cy.get(".MuiDialogContent-root > .MuiTypography-root").should(
      "include.text",
      "If you decide to add this placement credential again, please remove the existing issued credential from your wallet to avoid any confusion."
    );
    cy.get(".MuiDialogActions-root > :nth-child(1)").click();
    cy.get('[data-cy="dsp-btn-placements-1"]').click();
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get('[data-cy="dsp-btn-placements-1"]').should(
      "include.text",
      "Please wait..."
    );
  });

  it("should show the revoked date and issue button for a previously revoke credential", () => {
    const MockedRevokedDspIssueBtn = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedCredentials(mockDspPlacementCredentials));
      return (
        <Provider store={store}>
          <Router history={history}>
            <DspIssueBtn panelName="placement" panelId="2" isPastDate={false} />
          </Router>
        </Provider>
      );
    };
    mount(
      <Provider store={store}>
        <ConfirmProvider>
          <Router history={history}>
            <MockedRevokedDspIssueBtn />
          </Router>
        </ConfirmProvider>
      </Provider>
    );
    cy.get('[data-cy="dsp-value-placements-2"]').should(
      "include.text",
      "This placement credential was revoked on 14/08/2023 15:12 (BST)"
    );
    cy.get('[data-cy="dsp-btn-placements-2"]')
      .should("include.text", "Click to add again")
      .click();
    cy.get(".MuiDialogContent-root > .MuiTypography-root").should(
      "include.text",
      "If you decide to add this placement credential again, please remove the existing revoked credential from your wallet to avoid any confusion."
    );
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get('[data-cy="dsp-btn-placements-2"]').should(
      "include.text",
      "Please wait..."
    );
  });
});
