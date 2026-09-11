import { mount } from "cypress/react";
import { MemoryRouter, Route, Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import { FormRView } from "../../../../components/forms/form-builder/form-r/FormRView";
import { submittedFormRPartAs } from "../../../../mock-data/submitted-formr-parta";
import { formASavedDraft } from "../../../../mock-data/draft-formr-parta";
import {
  mockPersonalDetails,
  mockProgrammesForLinkerTest
} from "../../../../mock-data/trainee-profile";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import {
  resetToInitFormA,
  updatedFormA
} from "../../../../redux/slices/formASlice";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import { formRStaleLinkageGateLabel } from "../../../../utilities/Constants";

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

    // Check some formData fields are rendered
    cy.contains(submittedForm.forename as string).should("exist");
    cy.contains(submittedForm.surname as string).should("exist");
  });

  it("should explain the missing prgramme linkage on a legacy submitted form", () => {
    const legacyForm = submittedFormRPartAs[0];
    const formId = legacyForm.id;

    cy.intercept("GET", `/api/forms/formr-parta/${formId}`, legacyForm).as(
      "getLegacyForm"
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

    cy.wait("@getLegacyForm");

    cy.get('[data-cy="legacyLinkageNote"]')
      .should(
        "contain.text",
        "not linked to a programme because when it was submitted this functionality was not available"
      )
      .and("contain.text", "may no longer appear in the list to choose from");
    cy.get('[data-cy="isArcp-value"]').should("not.exist");
    cy.get('[data-cy="programmeMembershipId-value"]').should("not.exist");
    cy.get('[data-cy="localOfficeName-value"]').should(
      "contain.text",
      "Thames Valley"
    );
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
      completionDate: "2030-12-31",
      isArcp: false,
      programmeMembershipId: "pm-id-123"
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

    // readonly so no change link
    cy.get('[data-cy="programmeSpecialty-value"]').should(
      "contain.text",
      "some specialty"
    );
    cy.get('[data-cy="edit-programmeSpecialty"]').should("not.exist");
    cy.get('[data-cy="edit-completionDate"]').should("exist");
    cy.get('[data-cy="isArcp-value"]').should("contain.text", "New Starter");
    cy.get('[data-cy="localOfficeName-value"]').should(
      "contain.text",
      "Thames Valley"
    );
    cy.get('[data-cy="edit-localOfficeName"]').should("not.exist");
  });

  it("should show the programmeSpecialty but not the readonly deanery in form linkage view when nothing is linked", () => {
    const unlinkedDraft = {
      ...formASavedDraft,
      isArcp: false,
      programmeMembershipId: "",
      localOfficeName: "",
      programmeSpecialty: ""
    };
    const formId = unlinkedDraft.id;

    cy.intercept("GET", `/api/forms/formr-parta/${formId}`, unlinkedDraft).as(
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

    cy.get('[data-cy="localOfficeName-value"]').should("not.exist");
    cy.get('[data-cy="programmeSpecialty-value"]').should(
      "contain.text",
      "Not provided"
    );
    cy.get('[data-cy="error-txt-Programme specialty is required"]').should(
      "exist"
    );
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

describe("FormR View (part A) confirm modal on submit", () => {
  const completeDraft = {
    ...formASavedDraft,
    programmeSpecialty: "my specialty",
    completionDate: "2030-12-31",
    isArcp: false,
    programmeMembershipId: "pm-id-123"
  };

  beforeEach(() => {
    store.dispatch(resetToInitFormA());
    cy.intercept(
      "GET",
      `/api/forms/formr-parta/${completeDraft.id}`,
      completeDraft
    ).as("getDraftForm");
    cy.intercept("PUT", "/api/forms/formr-parta", { statusCode: 200 }).as(
      "submitForm"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/formr-a/${completeDraft.id}/view`]}>
          <Route path="/formr-a/:id/view">
            <FormRView formType="A" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getDraftForm");
    cy.get('[data-cy="isCorrect"]').check().should("be.checked");
    cy.get('[data-cy="willKeepInformed"]').check().should("be.checked");
  });

  it("should confirm before submit", () => {
    cy.get('[data-cy="BtnSubmit"]').click();
    cy.get('[data-cy="warningText-Submit"]')
      .should("be.visible")
      .and("contain.text", "please think carefully before submitting");
    cy.get("@submitForm.all").should("have.length", 0);
  });

  it("should not submit and remain on form view if trainee cancels", () => {
    cy.get('[data-cy="BtnSubmit"]').click();
    cy.get('[data-cy="modal-cancel-btn"]:visible').click();
    cy.get('[data-cy="warningText-Submit"]').should("not.be.visible");
    cy.get("@submitForm.all").should("have.length", 0);
  });

  it("should submit on confirm", () => {
    cy.get('[data-cy="BtnSubmit"]').click();
    cy.get('[data-cy="submitBtn-Submit"]').click();
    cy.wait("@submitForm")
      .its("request.body.lifecycleState")
      .should("equal", "SUBMITTED");
  });
});

describe("FormRView (Part A) - stale linkage on an UNSUBMITTED form", () => {
  const unsubmittedStaleForm = {
    ...formASavedDraft,
    lifecycleState: LifeCycleState.Unsubmitted,
    programmeSpecialty: "Acute medicine",
    completionDate: "2030-12-31",
    isArcp: true,
    programmeMembershipId: "4",
    programmeName: "Acute medicine",
    localOfficeName: "East of England"
  };

  beforeEach(() => {
    store.dispatch(resetToInitFormA());
    store.dispatch(
      updatedTraineeProfileData({
        traineeTisId: "testid",
        personalDetails: mockPersonalDetails,
        programmeMemberships: mockProgrammesForLinkerTest,
        placements: [],
        qualifications: []
      })
    );
    store.dispatch(updatedFormA(unsubmittedStaleForm));
    cy.intercept(
      "GET",
      `/api/forms/formr-parta/${unsubmittedStaleForm.id}`,
      unsubmittedStaleForm
    ).as("getUnsubmittedForm");
    history.push(`/formr-a/${unsubmittedStaleForm.id}/view`);

    mount(
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/formr-a/:id/view">
              <FormRView formType="A" />
            </Route>
            <Route path="/formr-a/:id/create">
              <div data-cy="linkage-form-page">Form Page</div>
            </Route>
          </Switch>
        </Router>
      </Provider>
    );

    cy.wait("@getUnsubmittedForm");
  });

  it("shows the preserved linkage with a notice instead of change links", () => {
    cy.get('[data-cy="staleLinkageNote"]').should("exist");
    cy.get('[data-cy="updateStaleLinkage"]').should("exist");
    cy.get('[data-cy="programmeMembershipId-value"]').should(
      "contain.text",
      "Acute medicine"
    );
    cy.get('[data-cy="edit-programmeMembershipId"]').should("not.exist");
    cy.get('[data-cy="edit-isArcp"]').should("not.exist");
    cy.get('[data-cy="edit-completionDate"]').should("exist");
  });

  it("keeps the linkage when the trainee cancels the update", () => {
    cy.get('[data-cy="updateStaleLinkage"]').click();
    cy.get(`[data-cy="warningText-${formRStaleLinkageGateLabel}"]`).should(
      "be.visible"
    );
    cy.get('[data-cy="modal-cancel-btn"]:visible').click();
    cy.get('[data-cy="linkage-form-page"]').should("not.exist");
    cy.get('[data-cy="programmeMembershipId-value"]').should(
      "contain.text",
      "Acute medicine"
    );
  });

  it("clears the linkage and opens the form when the trainee confirms", () => {
    cy.get('[data-cy="updateStaleLinkage"]').click();
    cy.get(`[data-cy="warningText-${formRStaleLinkageGateLabel}"]`).should(
      "contain.text",
      "the linked programme you chose is no longer available"
    );
    cy.get(`[data-cy="submitBtn-${formRStaleLinkageGateLabel}"]`).click();
    cy.get('[data-cy="linkage-form-page"]')
      .should("exist")
      .then(() => {
        const savedForm = store.getState().formA.formData;
        expect(savedForm.programmeMembershipId).to.equal("");
        expect(savedForm.programmeName).to.equal("");
        expect(savedForm.localOfficeName).to.equal("");
        expect(savedForm.programmeSpecialty).to.equal("");
        expect(savedForm.isArcp).to.equal(true);
        expect(store.getState().formA.editPageNumber).to.equal(0);
      });
  });
});
