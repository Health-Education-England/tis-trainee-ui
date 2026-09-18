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

const mountLink = (formsResponse: any) => {
  cy.intercept("GET", "/api/forms/formr-partas", formsResponse).as("getForms");

  history.push("/action-summary");
  mount(
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path="/action-summary">
            <FormRPrefillLink
              formType="A"
              programmeMembershipId="3"
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

  it("should open a new form with the linkage prefilled when no form is in progress", () => {
    mountLink(allSubmittedForms);
    cy.get('[data-cy="formRPrefillLink-A"]').click();
    cy.wait("@getForms");

    cy.get('[data-cy="formr-a-create"]').should("exist");
    cy.then(() => {
      expect(history.location.state).to.deep.equal({
        prefill: {
          isArcp: true,
          programmeMembershipId: "3",
          programmeName: "Acute medicine",
          localOfficeName: mockProgrammesForLinkerTest[2].managingDeanery,
          programmeSpecialty: "Acute medicine"
        }
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
      "there is  already a draft form in progress"
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
      "there is  already an unsubmitted form in progress"
    );
    cy.get('[data-cy="goToFormInProgressBtn"]')
      .should("have.text", "Edit unsubmitted form")
      .click();
    cy.get('[data-cy="formr-a-view"]').should("exist");
  });

  it("should still open a new form when the programme cannot be linked", () => {
    cy.intercept("GET", "/api/forms/formr-partas", allSubmittedForms).as(
      "getForms"
    );

    history.push("/action-summary");
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/action-summary">
              <FormRPrefillLink
                formType="A"
                programmeMembershipId="4"
                label="Submit a new Form R Part A"
              />
            </Route>
            <Route exact path="/formr-a/new/create">
              <div data-cy="formr-a-create">Form R Part A create</div>
            </Route>
          </Switch>
        </Router>
      </Provider>
    );

    cy.get('[data-cy="formRPrefillLink-A"]').click();
    cy.wait("@getForms");

    cy.get('[data-cy="formr-a-create"]').should("exist");
    cy.then(() => {
      expect(history.location.state).to.be.undefined;
    });
  });
});
