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
import { formASavedDraft } from "../../../../mock-data/draft-formr-parta";
import { submittedFormRPartAs } from "../../../../mock-data/submitted-formr-parta";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import history from "../../../../components/navigation/history";

const allSubmittedForms = submittedFormRPartAs.filter(
  form => form.lifecycleState === LifeCycleState.Submitted
);

const mountLink = (formsResponse: any, programmeMembershipId = "3") => {
  cy.intercept("GET", "/api/forms/formr-partas", formsResponse).as("getForms");

  history.push("/action-summary");
  mount(
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path="/action-summary">
            <FormRPrefillLink
              formType="A"
              programmeMembershipId={programmeMembershipId}
              label="Submit a new Form R Part A"
            />
          </Route>
          <Route exact path="/formr-a/new/create">
            <div data-cy="formr-a-create">Form R Part A create</div>
          </Route>
          <Route exact path="/formr-a/:id/create">
            <div data-cy="formr-a-draft">Form R Part A draft</div>
          </Route>
          <Route exact path="/formr-a/:id/view">
            <div data-cy="formr-a-view">Form R Part A view</div>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

const clickAndLandOnNewForm = (
  formsResponse: any,
  programmeMembershipId: string
) => {
  mountLink(formsResponse, programmeMembershipId);
  cy.get('[data-cy="formRPrefillLink-A"]').click();
  cy.wait("@getForms");
  cy.get('[data-cy="formr-a-create"]').should("exist");
};

describe("FormRPrefillLink", () => {
  beforeEach(() => {
    store.dispatch(resetToInitFormA());
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
        }
      });
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
        }
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
        }
      });
    });
  });

  it("should report that nothing could be pre-filled when the programme is outside both windows", () => {
    clickAndLandOnNewForm(allSubmittedForms, "4");
    cy.then(() => {
      expect(history.location.state).to.deep.equal({
        prefillResult: { outcome: "unavailable" }
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
    cy.get('[data-cy="formr-a-create"]').should("not.exist");
  });

  it("should send the trainee to their saved draft from the warning", () => {
    mountLink([formASavedDraft]);
    cy.get('[data-cy="formRPrefillLink-A"]').click();
    cy.wait("@getForms");

    cy.get('[data-cy="goToFormInProgressBtn"]')
      .should("have.text", "Edit saved draft form")
      .click();
    cy.get('[data-cy="formr-a-draft"]').should("exist");
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
    cy.get('[data-cy="formr-a-view"]').should("exist");
  });
});
