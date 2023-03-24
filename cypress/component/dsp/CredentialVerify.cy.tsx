import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import CredentialVerify from "../../../components/dsp/CredentialVerify";
import store from "../../../redux/store/store";
import {
  updatedDspPanelObj,
  updatedDspPanelObjName
} from "../../../redux/slices/dspSlice";
import { mount } from "cypress/react18";

const panelData = {
  tisId: "321",
  programmeTisId: "2",
  programmeName: "General Practice",
  programmeNumber: "EOE8950",
  startDate: "2020-01-01",
  endDate: "2028-01-01",
  managingDeanery: "West of England",
  curricula: []
};

describe("CredentialVerify", () => {
  it("should mount the Verify prompt when store panel data available ", () => {
    const MockedCredentialIssueWithPanelData = () => {
      store.dispatch(updatedDspPanelObjName("programmes"));
      store.dispatch(updatedDspPanelObj(panelData));
      return (
        <Provider store={store}>
          <Router history={history}>
            <CredentialVerify />
          </Router>
        </Provider>
      );
    };
    mount(<MockedCredentialIssueWithPanelData />);
    cy.get('[data-cy="dspVerifyWarningLabel"]')
      .should("exist")
      .should("have.text", "Important");
    cy.get('[data-cy="dspVerifyWarningText"]')
      .should("exist")
      .should(
        "have.text",
        "Before you can issue this credential to your DSP wallet you must verify your identity."
      );
    cy.get('[data-cy="dspPanelHeading"]')
      .should("exist")
      .should("have.text", "Programme credential");
    cy.get('[data-cy="programmeNameVal"]')
      .should("exist")
      .should("have.text", "General Practice");
    cy.get('[data-cy="startDateVal"]')
      .should("exist")
      .should("have.text", "01/01/2020");
    cy.get('[data-cy="endDateVal"]').should("have.text", "01/01/2028");
    cy.get('[data-cy="dspVerifyIdentityBtn"]').should("exist");
  });
});
