import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Route, Router, Switch } from "react-router-dom";
import store from "../../../../redux/store/store";
import { FormRPrefillLink } from "../../../../components/forms/form-builder/form-r/FormRPrefillLink";
import {
  mockPersonalDetails,
  mockProgrammesForLinkerTest
} from "../../../../mock-data/trainee-profile";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import { updatedReference } from "../../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";
import { resetToInitFormA } from "../../../../redux/slices/formASlice";
import { resetToInitFormB } from "../../../../redux/slices/formBSlice";
import { formASavedDraft } from "../../../../mock-data/draft-formr-parta";
import { submittedFormRPartAs } from "../../../../mock-data/submitted-formr-parta";
import {
  submittedFormRPartBs,
  submittedFormRPartBsWithDraft
} from "../../../../mock-data/submitted-formr-partb";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import history from "../../../../components/navigation/history";

const allSubmittedForms = submittedFormRPartAs.filter(
  form => form.lifecycleState === LifeCycleState.Submitted
);

const mountLink = (
  formsResponse: any,
  programmeMembershipId = "3",
  formType: "A" | "B" = "A"
) => {
  const basePath = formType === "A" ? "/formr-a" : "/formr-b";
  const endpoint =
    formType === "A" ? "/api/forms/formr-partas" : "/api/forms/formr-partbs";
  cy.intercept("GET", endpoint, formsResponse).as("getForms");

  history.push("/action-summary");
  mount(
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path="/action-summary">
            <FormRPrefillLink
              formType={formType}
              programmeMembershipId={programmeMembershipId}
              label={`Submit a new Form R Part ${formType}`}
            />
          </Route>
          <Route exact path={`${basePath}/new/create`}>
            <div data-cy="formr-create">Form R create</div>
          </Route>
          <Route exact path={`${basePath}/:id/create`}>
            <div data-cy="formr-draft">Form R draft</div>
          </Route>
          <Route exact path={`${basePath}/:id/view`}>
            <div data-cy="formr-view">Form R view</div>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

const clickAndLandOnNewForm = (
  formsResponse: any,
  programmeMembershipId: string,
  formType: "A" | "B" = "A"
) => {
  mountLink(formsResponse, programmeMembershipId, formType);
  cy.get(`[data-cy="formRPrefillLink-${formType}"]`).click();
  cy.wait("@getForms");
  cy.get('[data-cy="formr-create"]').should("exist");
};

describe("FormRPrefillLink", () => {
  beforeEach(() => {
    store.dispatch(resetToInitFormA());
    store.dispatch(resetToInitFormB());
    store.dispatch(updatedReference(mockedCombinedReference));
    store.dispatch(
      updatedTraineeProfileData({
        traineeTisId: "testid",
        personalDetails: mockPersonalDetails,
        programmeMemberships: mockProgrammesForLinkerTest,
        placements: [],
        qualifications: []
      })
    );
  });

  it("should pre-select ARCP for a programme that ended within the last 12 months", () => {
    clickAndLandOnNewForm(allSubmittedForms, "3");
    cy.then(() => {
      expect(history.location.state).to.deep.equal({
        prefillResult: {
          outcome: "prefilled",
          prefill: {
            isArcp: true,
            programmeMembershipId: "3",
            programmeName: "Acute medicine",
            localOfficeName: mockProgrammesForLinkerTest[2].managingDeanery,
            programmeSpecialty: "Acute medicine"
          }
        },
        returnPath: "/action-summary"
      });
      expect(store.getState().formA.formData.lifecycleState).to.equal(
        LifeCycleState.Draft
      );
    });
  });

  it("should pre-select New Starter for a programme starting within the next 12 months", () => {
    clickAndLandOnNewForm(allSubmittedForms, "5");
    cy.then(() => {
      expect(history.location.state).to.deep.equal({
        prefillResult: {
          outcome: "prefilled",
          prefill: {
            isArcp: false,
            programmeMembershipId: "5",
            programmeName: "Adult psychiatry",
            localOfficeName: mockProgrammesForLinkerTest[4].managingDeanery,
            programmeSpecialty: "Adult psychiatry"
          }
        },
        returnPath: "/action-summary"
      });
    });
  });

  it("should pre-select the programme but no reason when it is underway", () => {
    clickAndLandOnNewForm(allSubmittedForms, "1");
    cy.then(() => {
      expect(history.location.state).to.deep.equal({
        prefillResult: {
          outcome: "prefilled",
          prefill: {
            isArcp: null,
            programmeMembershipId: "1",
            programmeName: "Acute medicine",
            localOfficeName: mockProgrammesForLinkerTest[0].managingDeanery,
            programmeSpecialty: "Acute medicine"
          }
        },
        returnPath: "/action-summary"
      });
    });
  });

  it("should report that nothing could be pre-filled when the programme is outside both windows", () => {
    clickAndLandOnNewForm(allSubmittedForms, "4");
    cy.then(() => {
      expect(history.location.state).to.deep.equal({
        prefillResult: { outcome: "unavailable" },
        returnPath: "/action-summary"
      });
    });
  });

  it("should warn instead of opening a new form when a draft is in progress", () => {
    mountLink([formASavedDraft]);
    cy.get('[data-cy="formRPrefillLink-A"]').click();
    cy.wait("@getForms");

    cy.get('[data-cy="formRInProgressWarning"]').should("exist");
    cy.get('[data-cy="formRInProgressText"]').should(
      "contain.text",
      "there is already a draft form in progress"
    );
    cy.get('[data-cy="formr-create"]').should("not.exist");
  });

  it("should send the trainee to their saved draft from the warning", () => {
    mountLink([formASavedDraft]);
    cy.get('[data-cy="formRPrefillLink-A"]').click();
    cy.wait("@getForms");

    cy.get('[data-cy="goToFormInProgressBtn"]')
      .should("have.text", "Edit saved draft form")
      .click();
    cy.get('[data-cy="formr-draft"]').should("exist");
  });

  it("should explain the failure instead of navigating when the forms cannot be loaded", () => {
    mountLink({ statusCode: 500, body: {} });
    cy.get('[data-cy="formRPrefillLink-A"]').click();
    cy.wait("@getForms");

    cy.get('[data-cy="formRLoadErrorText"]').should(
      "contain.text",
      "We tried unsuccessfully to load your saved forms"
    );
    cy.get('[data-cy="formr-create"]').should("not.exist");
    cy.get('[data-cy="formRPrefillLink-A"]').should("exist");
  });

  it("should open the new form when the trainee retries after a failure", () => {
    mountLink({ statusCode: 500, body: {} });
    cy.get('[data-cy="formRPrefillLink-A"]').click();
    cy.wait("@getForms");
    cy.get('[data-cy="formRLoadErrorWarning"]').should("exist");

    cy.intercept("GET", "/api/forms/formr-partas", allSubmittedForms).as(
      "getFormsRetry"
    );
    cy.get('[data-cy="retryFormRCheckBtn"]').click();
    cy.wait("@getFormsRetry");

    cy.get('[data-cy="formr-create"]').should("exist");
  });

  it("should send the trainee to the view page when the form is unsubmitted", () => {
    mountLink([
      { ...formASavedDraft, lifecycleState: LifeCycleState.Unsubmitted }
    ]);
    cy.get('[data-cy="formRPrefillLink-A"]').click();
    cy.wait("@getForms");

    cy.get('[data-cy="formRInProgressText"]').should(
      "contain.text",
      "there is already an unsubmitted form in progress"
    );
    cy.get('[data-cy="goToFormInProgressBtn"]')
      .should("have.text", "Edit unsubmitted form")
      .click();
    cy.get('[data-cy="formr-view"]').should("exist");
  });

  it("should pre-select the programme when opening a new Part B", () => {
    clickAndLandOnNewForm(submittedFormRPartBs, "3", "B");
    cy.then(() => {
      expect(history.location.state).to.deep.equal({
        prefillResult: {
          outcome: "prefilled",
          prefill: {
            isArcp: true,
            programmeMembershipId: "3",
            programmeName: "Acute medicine",
            localOfficeName: mockProgrammesForLinkerTest[2].managingDeanery,
            programmeSpecialty: "Acute medicine"
          }
        },
        returnPath: "/action-summary"
      });
      expect(store.getState().formB.formData.lifecycleState).to.equal(
        LifeCycleState.Draft
      );
    });
  });

  it("should warn instead of opening a new Part B when a draft is in progress", () => {
    mountLink(submittedFormRPartBsWithDraft, "3", "B");
    cy.get('[data-cy="formRPrefillLink-B"]').click();
    cy.wait("@getForms");

    cy.get('[data-cy="formRInProgressText"]').should(
      "contain.text",
      "You cannot begin a new Form R Part B"
    );
    cy.get('[data-cy="formr-create"]').should("not.exist");

    cy.get('[data-cy="goToFormInProgressBtn"]')
      .should("have.text", "Edit saved draft form")
      .click();
    cy.get('[data-cy="formr-draft"]').should("exist");
  });
});
