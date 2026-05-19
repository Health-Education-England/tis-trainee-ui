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
      "Please read before proceeding"
    );
    cy.get('[data-cy="cct-calc-warning-text1"]').should(
      "include.text",
      "Please note, the calculation below uses simplified calculation logic"
    );
    cy.get('[data-cy="cct-calc-warning-text2"]').contains(
      "Please use a trusted NHS CCT Date Calculator "
    );
    cy.get('[data-cy="cct-calc-summary-header"]')
      .should("exist")
      .contains("CCT Calculation Summary");
    cy.get('[data-cy="saved-cct-details"] > div').first().contains("bob1");
    cy.get('[data-cy="cct-save-pdf-btn"]').should("exist").click();
    cy.get("@print").should("be.called");
  });
  it("renders the 'passed start date' warning message for a 'stale' saved calc", () => {
    const pastStartDateCalc = {
      ...mockCctList[0],
      changes: [
        {
          ...mockCctList[0].changes[0],
          startDate: dayjs().subtract(1, "day").format("YYYY-MM-DD")
        }
      ]
    };
    mountCctViewWithMockData(pastStartDateCalc, false);
    cy.get(".field-warning-msg").contains(
      "Change start date is now in the past"
    );
  });
  it("renders an existing cct calculation that has NOT just been edited", () => {
    mountCctViewWithMockData(mockCctList[0], false);
    cy.get('[data-cy="saved-cct-details"] > div').first().contains("bob1");
    cy.get('[data-cy="cct-save-btn"]').should("not.exist");
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

  it("show warning if LTFT start date less than 16 weeks in the future", () => {
    store.dispatch(updatedCctStatus("idle"));
    mountCctViewWithMockData(
      {
        ...mockCctList[0],
        changes: [
          {
            type: "LTFT",
            startDate: dayjs().add(15, "week").format("YYYY-MM-DD"),
            wte: 0.7
          }
        ]
      },
      true
    );
    cy.get(".field-warning-msg").should("exist");
  });

  it("hide warning if LTFT start date longer than 16 weeks in the future", () => {
    store.dispatch(updatedCctStatus("idle"));
    mountCctViewWithMockData(
      {
        ...mockCctList[0],
        changes: [
          {
            type: "LTFT",
            startDate: dayjs().add(17, "week").format("YYYY-MM-DD"),
            wte: 0.7
          }
        ]
      },
      true
    );
    cy.get(".field-warning-msg").should("not.exist");
  });
});
