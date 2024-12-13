import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import { CctCalcView } from "../../../../components/forms/cct/CctCalcView";
import history from "../../../../components/navigation/history";
import { mockCctCalcData1 } from "../../../../mock-data/mock-cct-data";
import {
  CctCalculation,
  updatedCctCalc,
  updatedCctStatus,
  updatedNewCalcMade
} from "../../../../redux/slices/cctSlice";

const mountCctViewWithMockData = (
  cctCalcData: CctCalculation = mockCctCalcData1,
  newCalcMade = true
) => {
  store.dispatch(updatedCctCalc(cctCalcData));
  store.dispatch(updatedNewCalcMade(newCalcMade));
  mount(
    <Provider store={store}>
      <Router history={history}>
        <CctCalcView />
      </Router>
    </Provider>
  );
};

describe("CctCalcView", () => {
  it("renders an existing cct calculation that has just been edited", () => {
    mountCctViewWithMockData();
    cy.window().then(win => {
      cy.stub(win, "print").as("print");
    });
    cy.get('[data-cy="backLink-to-cct-home"]').should("exist").click();
    cy.url().should("include", "/cct");
    cy.get('[data-cy="cct-calc-summary-header"]')
      .should("exist")
      .contains("CCT Calculation Summary");
    cy.get('[data-cy="saved-cct-details"] > div').first().contains("bob1");
    cy.get('[data-cy="cct-save-btn"]').should("exist").click();
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get('[data-cy="cct-name-modal"]').should("not.exist");
    cy.get('[data-cy="cct-edit-btn"]').should("exist").click();
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get('[data-cy="cct-save-pdf-btn"]').should("exist").click();
    cy.get("@print").should("be.called");
  });
  it("renders an existing cct calculation that has NOT just been edited", () => {
    mountCctViewWithMockData(mockCctCalcData1, false);
    cy.get('[data-cy="saved-cct-details"] > div').first().contains("bob1");
    cy.get('[data-cy="cct-save-btn"]').should("not.exist");
    cy.get('[data-cy="cct-edit-btn"]').should("exist");
    cy.get('[data-cy="cct-save-pdf-btn"]').should("exist");
  });

  it("renders an error page if there is no cctDate (if user navigates to cct/view without a calc or id)", () => {
    mountCctViewWithMockData({ ...mockCctCalcData1, cctDate: "" });
    store.dispatch(updatedNewCalcMade(true));
    cy.get(".nhsuk-error-summary").should("exist");
  });
  it("renders an error page if the saved cct calc load fails", () => {
    mountCctViewWithMockData();
    store.dispatch(updatedCctStatus("failed"));
    cy.get(".nhsuk-error-summary").should("exist");
  });

  // new calc tests
  it("renders a new cct calculation", () => {
    store.dispatch(updatedCctStatus("idle"));
    mountCctViewWithMockData(
      {
        ...mockCctCalcData1,
        id: "",
        name: "",
        created: undefined,
        lastModified: undefined
      },
      true
    );
    cy.get('[data-cy="cct-calc-summary-header"]')
      .should("exist")
      .contains("CCT Calculation Summary");
    cy.get('[data-cy="cct-edit-btn"]').should("exist");
    cy.get('[data-cy="cct-save-pdf-btn"]').should("exist");
    cy.get('[data-cy="cct-save-btn"]').should("exist").click();
    cy.get('[data-cy="dialogModal"]').should("exist");
    cy.get('[data-cy="cct-modal-save-btn"]').should("be.disabled");
    cy.get('[data-cy="name"]').type("😎");
    cy.get('[data-cy="cct-modal-save-btn"]').should("not.be.disabled").click();
    // POST will fail in comp test
    cy.get(".nhsuk-error-summary")
      .should("exist")
      .should("include.text", "There was a problem saving your calculation.");
    cy.get("body").type("{esc}");
    // error msg remains on main view after modal close
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get('[data-cy="cct-edit-btn"]').click();
    // But error msg resets after btn click
    cy.get(".nhsuk-error-summary").should("not.exist");
  });
});
