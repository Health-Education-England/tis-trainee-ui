import { mount } from "cypress/react";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import { FormRView } from "../../../../components/forms/form-builder/form-r/FormRView";
import {
  draftFormRPartB,
  mockCovidDto
} from "../../../../mock-data/draft-formr-partb";
import { resetToInitFormB } from "../../../../redux/slices/formBSlice";
import { LifeCycleState } from "../../../../models/LifeCycleState";

describe("FormRView (Part B)", () => {
  beforeEach(() => {
    store.dispatch(resetToInitFormB());
  });

  it("should render error and link to the field for empty array when 'Yes' is selected in the parent field", () => {
    const draftForm = {
      ...draftFormRPartB,
      lifecycleState: LifeCycleState.Draft,
      havePreviousDeclarations: true,
      previousDeclarations: []
    };
    const formId = draftForm.id;

    cy.intercept("GET", `/api/forms/formr-partb/${formId}`, draftForm).as(
      "getDraftForm"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/formr-b/${formId}/view`]}>
          <Route path="/formr-b/:id/view">
            <FormRView formType="B" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getDraftForm");

    cy.get("#errorSummaryTitle").should("exist");

    const errorLink = cy.get(
      '[data-cy="error-txt-At least one Previous Declaration is required"]'
    );
    errorLink.should("exist");
    errorLink.click();

    cy.get("#previousDeclarations")
      .should("have.focus")
      .should("contain.text", "Not provided");

    cy.get("#previousDeclarations")
      .parent()
      .find(".nhsuk-error-message")
      .should("contain.text", "At least one Previous Declaration is required");
  });
  it("should render error for nested field in array and scroll to it", () => {
    const formId = draftFormRPartB.id;
    const modifiedForm = {
      ...draftFormRPartB,
      lifecycleState: LifeCycleState.Draft,
      work: [
        {
          ...draftFormRPartB.work[0],
          startDate: ""
        }
      ]
    };

    cy.intercept("GET", `/api/forms/formr-partb/${formId}`, modifiedForm).as(
      "getDraftForm"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/formr-b/${formId}/view`]}>
          <Route path="/formr-b/:id/view">
            <FormRView formType="B" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getDraftForm");

    cy.get("#errorSummaryTitle").should("exist");
    cy.get('[data-cy="error-txt-Start date must be a valid date"]')
      .should("exist")
      .click();

    cy.get("#work-0-startDate").should("be.focused");
  });

  it("should render covidDeclarationDto when haveCovidDeclarations is true", () => {
    const formId = draftFormRPartB.id;
    const modifiedForm = {
      ...draftFormRPartB,
      lifecycleState: LifeCycleState.Submitted,
      haveCovidDeclarations: true,
      covidDeclarationDto: mockCovidDto
    };

    cy.intercept("GET", `/api/forms/formr-partb/${formId}`, modifiedForm).as(
      "getSubmittedForm"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/formr-b/${formId}/view`]}>
          <Route path="/formr-b/:id/view">
            <FormRView formType="B" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getSubmittedForm");
    cy.contains("COVID 19 self-assessment & declarations").should("exist");
    cy.contains(
      "Please self-rate your progress in your training since your last ARCP"
    ).should("exist");
    cy.get('[data-cy="selfRateForCovid-value"]').should(
      "contain.text",
      "Satisfactory progress for stage of training and required competencies met"
    );
    cy.contains(
      "Please provide any other information you would like the panel to consider"
    ).should("exist");
    cy.get('[data-cy="otherInformationForPanel-value"]').should(
      "contain.text",
      "Some other info"
    );
    cy.contains(
      "I would like to discuss my training or current situation with my supervisor"
    ).should("exist");
    cy.get('[data-cy="discussWithSupervisorChecked-value"]').should(
      "contain.text",
      "Yes"
    );
    cy.contains(
      "I have concerns with my training and/or wellbeing at the moment and would like to discuss them with someone"
    ).should("exist");
    cy.get('[data-cy="discussWithSomeoneChecked-value"]').should(
      "contain.text",
      "No"
    );
    cy.contains(
      "Changes were made to my placement due to my individual circumstances"
    ).should("exist");
    cy.get('[data-cy="haveChangesToPlacement-value"]').should(
      "contain.text",
      "Yes"
    );
    cy.contains("Please Specify 'Other'").should("exist");
    cy.get('[data-cy="changeCircumstanceOther-value"]').should(
      "contain.text",
      "Other circumstance details"
    );
    cy.contains("Educational Supervisor's name (if applicable)").should(
      "exist"
    );
    cy.get('[data-cy="educationSupervisorName-value"]').should(
      "contain.text",
      "Dr. Supervisor"
    );
    cy.contains("Educational Supervisor's email (if applicable)").should(
      "exist"
    );
    cy.get('[data-cy="educationSupervisorEmail-value"]').should(
      "contain.text",
      "supervisor@example.com"
    );
  });
});

// see FormRViewA.cy.tsx for more general tests relating to FormRView.tsx
