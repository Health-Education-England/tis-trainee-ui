import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import { CctCalcView } from "../../../../components/forms/cct/CctCalcView";
import history from "../../../../components/navigation/history";
import { mockCctList } from "../../../../mock-data/mock-cct-data";
import {
  CctCalculation,
  updatedCctCalc,
  updatedCctStatus,
  updatedNewCalcMade
} from "../../../../redux/slices/cctSlice";
import dayjs from "dayjs";

const mountCctViewWithMockData = (
  cctCalcData: CctCalculation = mockCctList[0],
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
    cy.stub(window, "print").as("print");
    cy.get('[data-cy="backLink-to-back-to-cct-home"]').should("exist");
    cy.get('[data-cy="cct-calc-warning-label"]').contains(
      "Projected completion date"
    );
    cy.get('[data-cy="cct-calc-warning-text1"]').should(
      "include.text",
      "Please note: the new completion date shown below is indicative"
    );
    cy.get('[data-cy="cct-calc-warning-text2"]').contains(
      "Your formal completion date will be agreed at ARCP."
    );
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
  it("renders an existing cct calc with a past start date without warning in summary", () => {
    const pastStartDateCalc = {
      ...mockCctList[0],
      cctDate: "2030-03-15",
      changes: [
        {
          ...mockCctList[0].changes[0],
          startDate: "2026-04-19",
          endDate: "2029-04-20",
          daysAdded: 329,
          resultingCctDate: "2030-03-15"
        }
      ]
    };
    mountCctViewWithMockData(pastStartDateCalc, false);
    cy.get('[data-cy="cct-calc-summary-header"]')
      .should("exist")
      .contains("CCT Calculation Summary");
    cy.get('[data-cy="days-added-0"]').should("include.text", "329");
    cy.get('[data-cy="change-resulting-cct-0"]').should(
      "include.text",
      "15/03/2030"
    );
    cy.get('[data-cy="saved-cct-date"]').should("include.text", "15/03/2030");
    cy.get(".field-warning-msg").should("not.exist");
  });
  it("renders an existing cct calculation that has NOT just been edited", () => {
    mountCctViewWithMockData(mockCctList[0], false);
    cy.get('[data-cy="saved-cct-details"] > div').first().contains("bob1");
    cy.get('[data-cy="cct-save-btn"]').should("not.exist");
    cy.get('[data-cy="cct-edit-btn"]').should("exist");
    cy.get('[data-cy="cct-save-pdf-btn"]').should("exist");
  });

  it("renders an error page if there is no cctDate (if user navigates to cct/view without a calc or id)", () => {
    mountCctViewWithMockData({ ...mockCctList[0], cctDate: "" });
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
        ...mockCctList[0],
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
    // should keep disable if trim Name is empty
    cy.get('[data-cy="name"]').type("  ");
    cy.get('[data-cy="cct-modal-save-btn"]').should("be.disabled");
    // should enable the submit button when Name is inputted
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

  it("renders summary without short notice warning (warnings only in edit view)", () => {
    store.dispatch(updatedCctStatus("idle"));
    mountCctViewWithMockData(
      {
        ...mockCctList[0],
        changes: [
          {
            type: "LTFT",
            startDate: dayjs().add(15, "week").format("YYYY-MM-DD"),
            endDate: mockCctList[0].programmeMembership.endDate,
            wte: 0.7,
            daysAdded: 0,
            resultingCctDate: mockCctList[0].cctDate as string
          }
        ]
      },
      true
    );
    cy.get(".field-warning-msg").should("not.exist");
  });

  it("renders summary without short notice warning for distant start date", () => {
    store.dispatch(updatedCctStatus("idle"));
    mountCctViewWithMockData(
      {
        ...mockCctList[0],
        changes: [
          {
            type: "LTFT",
            startDate: dayjs().add(17, "week").format("YYYY-MM-DD"),
            endDate: mockCctList[0].programmeMembership.endDate,
            wte: 0.7,
            daysAdded: 0,
            resultingCctDate: mockCctList[0].cctDate as string
          }
        ]
      },
      true
    );
    cy.get(".field-warning-msg").should("not.exist");
  });
});
