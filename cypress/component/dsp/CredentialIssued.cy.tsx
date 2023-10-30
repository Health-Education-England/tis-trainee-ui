import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CredentialIssued from "../../../components/dsp/CredentialIssued";
import {
  updatedDspPanelObj,
  updatedDspPanelObjName
} from "../../../redux/slices/dspSlice";
import store from "../../../redux/store/store";
import RenderSearchParams from "./RenderSearchParams";

const panelData = {
  tisId: "321",
  programmeTisId: "2",
  programmeName: "General Practice",
  programmeNumber: "EOE8950",
  startDate: "2020-01-01",
  endDate: "2028-01-01",
  managingDeanery: "West of England",
  curricula: [],
  conditionsOfJoining: { signedAt: new Date(), version: "blaa" }
};

describe("CredentialIssued success", () => {
  it("should mount the Issued success msg when state is in the URI and there is no error msg query param ", () => {
    const MockedCredentialIssuedWithStateParam = () => {
      store.dispatch(updatedDspPanelObjName("programmes"));
      store.dispatch(updatedDspPanelObj(panelData));
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
            <CredentialIssued />
          </MemoryRouter>
        </Provider>
      );
    };
    mount(<MockedCredentialIssuedWithStateParam />);
    cy.get('[data-cy="dspIssuedSuccessWarningLabel"]')
      .should("exist")
      .should("have.text", "Success");
    cy.get('[data-cy="dspIssuedSuccessWarningText"]')
      .should("exist")
      .should(
        "have.text",
        "The following credential has been added to your DSP wallet."
      );
    cy.get('[data-cy="programmeNameVal"]')
      .should("exist")
      .should("have.text", "General Practice");
    cy.get('[data-cy="startDateVal"]')
      .should("exist")
      .should("have.text", "01/01/2020");
    cy.get('[data-cy="endDateVal"]').should("have.text", "01/01/2028");
    cy.get('[data-cy="dspIssuedSuccessBtn"]').should("exist");
  });
});

describe("CredentialIssued user cancels", () => {
  it("should show the 'user cancelled issuance' msg when error_description param is user_cancelled.", () => {
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            "?state=eMdRu7Ir8kRNOrs8QxKSP&error_description=user%20cancelled"
          ]}
        >
          <RenderSearchParams />
          <CredentialIssued />
        </MemoryRouter>
      </Provider>
    );

    cy.get('[data-cy="dspIssuedErrorSummaryTitle"]')
      .should("exist")
      .should("have.text", "Something went wrong");
    cy.get('[data-cy="dspIssuedErrorSummaryText"]')
      .should("exist")
      .should(
        "have.text",
        "Credential has not been added to your wallet. Reason: user cancelled"
      );
  });
});
