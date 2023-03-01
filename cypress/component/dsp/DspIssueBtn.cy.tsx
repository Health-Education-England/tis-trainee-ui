/// <reference types="cypress" />

import { mount } from "cypress/react18";
import { Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import { DspIssueBtn } from "../../../components/dsp/DspIssueBtn";

describe("DSP issue button", () => {
  it("should enable digital staff passport button if date is not past", () => {
    mount(
      <Router history={history}>
        <DspIssueBtn panelName="placement" panelId="" isPastDate={false} />
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
        <DspIssueBtn panelName="placement" panelId="" isPastDate={true} />
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
