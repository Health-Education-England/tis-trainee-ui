/// <reference types="cypress" />

import { mount } from "@cypress/react";
import { Router } from "react-router-dom";
import history from "../../navigation/history";
import { DspIssueBtn } from "./DspIssueBtn";

describe("DSP issue button", () => {
  it("should enable digital staff passport button if date is not past", () => {
    mount(
      <Router history={history}>
        <DspIssueBtn
          panelName="placement"
          panelId=""
          panelKey={1}
          isPastDate={false}
        />
      </Router>
    );
    cy.get("[data-cy=dspBtnplacement1]")
      .should("not.be.disabled")
      .should(
        "include.text",
        "Click to add this placement to your Digital Staff Passport"
      );
  });

  it("should disable digital staff passport button if date is past", () => {
    mount(
      <Router history={history}>
        <DspIssueBtn
          panelName="placement"
          panelId=""
          panelKey={2}
          isPastDate={true}
        />
      </Router>
    );
    cy.get("[data-cy=dspBtnplacement2]")
      .should("be.disabled")
      .should(
        "include.text",
        "Past placements can't be added to your Digital Staff Passport"
      );
  });
});
