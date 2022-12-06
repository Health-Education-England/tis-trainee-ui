/// <reference types="cypress" />

import { mount } from "@cypress/react";
import { Router } from "react-router-dom";
import history from "../../navigation/history";
import DspMsg from "./DspMsg";

describe("DSP message", () => {
  it("should show message when issue date is null", () => {
    mount(
      <Router history={history}>
        <DspMsg panelName="placement" />
      </Router>
    );
    cy.get("[data-cy=dspIssueDateKey]")
      .should("exist")
      .should("include.text", "Date added to your Digital Staff Passport");
    cy.get("[data-cy=noIssueDateMsg]")
      .should("exist")
      .should(
        "include.text",
        "You have yet to add this placement to your wallet."
      );
  });
});
