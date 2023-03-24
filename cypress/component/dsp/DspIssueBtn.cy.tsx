/// <reference types="cypress" />

import { mount } from "cypress/react18";
import { Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import { DspIssueBtn } from "../../../components/dsp/DspIssueBtn";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";

describe("DSP issue button", () => {
  it("should enable digital staff passport button if date is not past", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <DspIssueBtn panelName="placement" panelId="" isPastDate={false} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=dspBtnplacement]")
      .should("not.be.disabled")
      .should(
        "include.text",
        "Click to add this placement to your Digital Staff Passport"
      );
  });

  it("should disable digital staff passport button if date is past", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <DspIssueBtn panelName="placement" panelId="" isPastDate={true} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=dspBtnplacement]")
      .should("be.disabled")
      .should(
        "include.text",
        "Past placements can't be added to your Digital Staff Passport"
      );
  });
});
