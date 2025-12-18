import { mount } from "cypress/react";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import { FormRView } from "../../../../components/forms/form-builder/form-r/FormRView";
import { submittedFormRPartAs } from "../../../../mock-data/submitted-formr-parta";
import { formASavedDraft } from "../../../../mock-data/draft-formr-parta";
import {
  resetToInitFormA,
  updatedFormA
} from "../../../../redux/slices/formASlice";
import { LifeCycleState } from "../../../../models/LifeCycleState";

describe("FormRView (Part A)", () => {
  beforeEach(() => {
    store.dispatch(resetToInitFormA());
  });

  it("should render a submitted form in read-only mode", () => {
    const submittedForm = {
      ...submittedFormRPartAs[0],
      programmeMembershipId: "pm-id-123"
    };
    const formId = submittedForm.id;

    cy.intercept("GET", `/api/forms/formr-parta/${formId}`, submittedForm).as(
      "getSubmittedForm"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/formr-a/${formId}/view`]}>
          <Route path="/formr-a/:id/view">
            <FormRView formType="A" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getSubmittedForm");

    // check read-only mode
    cy.contains("Review & submit").should("not.exist");
    cy.contains("Save a copy as a PDF").should("exist");
    cy.get('[data-cy="submissionDateTop"]').should("exist");
    cy.get(".form-linker_summary").should("exist");

    // Check some formData fields are rendered
    cy.contains(submittedForm.forename as string).should("exist");
    cy.contains(submittedForm.surname as string).should("exist");
  });

  it("should render a draft form (incomplete) in edit mode", () => {
    const draftForm = formASavedDraft;
    const formId = draftForm.id;

    cy.intercept("GET", `/api/forms/formr-parta/${formId}`, draftForm).as(
      "getDraftForm"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/formr-a/${formId}/view`]}>
          <Route path="/formr-a/:id/view">
            <FormRView formType="A" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getDraftForm");

    // Check for review mode
    cy.get('[data-cy="reviewSubmitHeader"]').should("exist");
    cy.contains("Save & exit").should("exist");
    cy.get('[data-cy="BtnSubmit"]').should("exist").and("be.disabled");
    cy.get('[data-cy="startOverButton"]').should("exist").and("be.enabled");

    // Check that fields are rendered
    cy.contains(draftForm.forename).should("exist");
    cy.contains(draftForm.surname).should("exist");

    // check errors
    cy.get("#errorSummaryTitle").should("exist");
    cy.get('[data-cy="error-txt-Programme specialty is required"]').should(
      "exist"
    );
    cy.get(
      '[data-cy="error-txt-Anticipated completion date - please choose a future date"]'
    )
      .should("exist")
      .click();
    cy.get('[data-cy="completionDate-label"] > .nhsuk-error-message').should(
      "exist"
    );

    // No submit despite declarations checked - due to errors
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
    cy.get('[data-cy="isCorrect"]').check().should("be.checked");
    cy.get('[data-cy="willKeepInformed"]').check().should("be.checked");
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
  });

  it("should render a draft form (complete) in edit mode", () => {
    const draftForm = {
      ...formASavedDraft,
      programmeSpecialty: "some specialty",
      completionDate: "2030-12-31"
    };
    const formId = draftForm.id;

    cy.intercept("GET", `/api/forms/formr-parta/${formId}`, draftForm).as(
      "getDraftForm"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/formr-a/${formId}/view`]}>
          <Route path="/formr-a/:id/view">
            <FormRView formType="A" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getDraftForm");

    // Check for review mode elements
    cy.get('[data-cy="reviewSubmitHeader"]').should("exist");
    cy.contains("Save & exit").should("exist");
    cy.get('[data-cy="isCorrect"]').check().should("be.checked");
    cy.get('[data-cy="willKeepInformed"]').check().should("be.checked");
    cy.get('[data-cy="BtnSubmit"]').should("exist").and("be.enabled");
    cy.get('[data-cy="startOverButton"]').should("exist").and("be.enabled");

    cy.contains(draftForm.forename).should("exist");
    cy.contains(draftForm.surname).should("exist");
  });

  it("should fetch data and show loading when refreshing page (fromCreate=true persisted on first refresh, but store yet to be populated with fetched formData)", () => {
    const draftForm = formASavedDraft;
    const formId = draftForm.id;

    cy.intercept("GET", `/api/forms/formr-parta/${formId}`, draftForm).as(
      "getDraftForm"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: `/formr-a/${formId}/view`,
              state: { fromFormCreate: true }
            }
          ]}
        >
          <Route path="/formr-a/:id/view">
            <FormRView formType="A" />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="loading"]').should("exist");

    // should still fetch formData because store yet to be populated with DRAFT/UNSUBMITTED form status
    cy.wait("@getDraftForm");

    cy.contains(draftForm.forename).should("exist");
  });

  it("should render error page when fetch fails", () => {
    const formId = "error-id";

    cy.intercept("GET", `/api/forms/formr-parta/${formId}`, {
      statusCode: 500
    }).as("getFormFail");

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/formr-a/${formId}/view`]}>
          <Route path="/formr-a/:id/view">
            <FormRView formType="A" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getFormFail");
    cy.contains("Failed to load your Form R Part A").should("exist");
  });

  it("should render error page when navigating directly to /new/view (i.e. lifecycle state 'New') ", () => {
    store.dispatch(
      updatedFormA({ ...formASavedDraft, lifecycleState: LifeCycleState.New })
    );
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/formr-a/new/view`]}>
          <Route path="/formr-a/new/view">
            <FormRView formType="A" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.contains("Please return to Form R Part A home and try again.").should(
      "exist"
    );
  });
});
