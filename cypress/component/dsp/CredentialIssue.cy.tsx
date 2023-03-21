import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import CredentialIssue from "../../../components/dsp/CredentialIssue";
import store from "../../../redux/store/store";
import {
  updatedDspGatewayUri,
  updatedDspPanelObj,
  updatedDspPanelObjName
} from "../../../redux/slices/dspSlice";

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
  it("should mount the Issue prompt comp when gatewayUri but no dsp state in localStorage", () => {
    const MockedCredentialIssueJustUri = () => {
      store.dispatch(updatedDspPanelObjName("programmes"));
      store.dispatch(updatedDspPanelObj(panelData));
      store.dispatch(updatedDspGatewayUri("/"));
      return <CredentialIssue />;
    };
    cy.mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedCredentialIssueJustUri />
        </Router>
      </Provider>
    );
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
    // would like to test for loading state etc. onClick but can't work out a way to do it at the moment. Might try RTL.
  });
});

// // TODO Can't set the correct URL for this test. Might try RTL.
// describe("Credential - verify Id before issuing credential", () => {
//   it("should show the verify Id prompt when a state param but no gateway uri", () => {
//     const MockedCredentialIssueJustStateParam = () => {
//       store.dispatch(updatedDspPanelObjName("programmes"));
//       store.dispatch(updatedDspPanelObj(panelData));
//       localStorage.setItem(
//         "eMdRu7Ir8kRNOrs8QxKSP",
//         JSON.stringify({
//           panelData: store.getState().dsp.dspPanelObj,
//           panelName: store.getState().dsp.dspPanelObjName
//         })
//       );
//       return (
//         <Provider store={store}>
//           <Router history={history}>
//             <CredentialIssue />
//           </Router>
//         </Provider>
//       );
//     };
//     cy.mount(<MockedCredentialIssueJustStateParam />, {
//       routerProps: {
//         initialEntries: ["/credential/issue?state=eMdRu7Ir8kRNOrs8QxKSP"]
//       }
//     });
//   });
// });
