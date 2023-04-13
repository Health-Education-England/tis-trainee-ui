import { Provider } from "react-redux";
import { MemoryRouter, Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import CredentialIssue from "../../../components/dsp/CredentialIssue";
import store from "../../../redux/store/store";
import {
  updatedDspGatewayUri,
  updatedDspPanelObj,
  updatedDspPanelObjName
} from "../../../redux/slices/dspSlice";
import { mount } from "cypress/react18";
import RenderSearchParams from "./RenderSearchParams";

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

describe("CredentialIssue", () => {
  it("should mount the Issue prompt comp when no dsp state in localStorage (i.e. no verified ID)", () => {
    const MockedCredentialIssueJustUri = () => {
      store.dispatch(updatedDspPanelObjName("programmes"));
      store.dispatch(updatedDspPanelObj(panelData));
      store.dispatch(updatedDspGatewayUri("https://evertonfc.com"));
      return (
        <Provider store={store}>
          <Router history={history}>
            <CredentialIssue />
          </Router>
        </Provider>
      );
    };
    mount(<MockedCredentialIssueJustUri />);
    cy.get('[data-cy="dspIssueWarningLabel"]')
      .should("exist")
      .should("have.text", "Important");
    cy.get('[data-cy="dspIssueWarningText"]')
      .should("exist")
      .should(
        "have.text",
        "You are about to issue this credential to your DSP wallet."
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
    cy.get('[data-cy="dspIssueCredBtn"]').should("exist");
  });
});

describe("CredentialIssue", () => {
  it("should mount the Add credential prompt comp when state param match (i.e. a verified ID)", () => {
    const MockedCredentialIssueJustUri = () => {
      store.dispatch(updatedDspPanelObjName("programmes"));
      store.dispatch(updatedDspPanelObj(panelData));
      store.dispatch(updatedDspGatewayUri(""));
      localStorage.setItem(
        "eMdRu7Ir8kRNOrs8QxKSP",
        JSON.stringify({
          panelData: store.getState().dsp.dspPanelObj,
          panelName: store.getState().dsp.dspPanelObjName
        })
      );
      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={["?state=eMdRu7Ir8kRNOrs8QxKSP"]}>
            <RenderSearchParams />
            <CredentialIssue />
          </MemoryRouter>
        </Provider>
      );
    };
    mount(<MockedCredentialIssueJustUri />);
    cy.get('[data-cy="dspVerifiedWarningLabel"]')
      .should("exist")
      .should("have.text", "Success");
    cy.get('[data-cy="dspVerifiedWarningText"]')
      .should("exist")
      .should(
        "have.text",
        "Your ID has been verified and you can now add this credential to your DSP wallet."
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
    cy.get('[data-cy="dspIssueCredBtn"]').should("exist");
  });
});
