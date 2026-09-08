import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import {
  FormProvider,
  useFormContext
} from "../../../../components/forms/form-builder/FormContext";
import { FormRBuilder } from "../../../../components/forms/form-builder/form-r/FormRBuilder";
import {
  Form,
  FormData
} from "../../../../components/forms/form-builder/FormBuilder";
import formAJson from "../../../../components/forms/form-builder/form-r/part-a/formA.json";
import { formAValidationSchema } from "../../../../components/forms/form-builder/form-r/part-a/formAValidationSchema";
import { FormsService } from "../../../../services/FormsService";
import {
  mockProgrammesForLinkerTest,
  mockTraineeProfile
} from "../../../../mock-data/trainee-profile";

const formJson = formAJson as Form;
const initialPageFields = formJson.pages[0].sections.flatMap(
  section => section.fields
);

const arcpRadio = '[data-cy="isArcp-ARCP/Annual Submission-input"]';
const newStarterRadio = '[data-cy="isArcp-New Starter-input"]';
const progSelect = '[data-cy="programmeMembershipId"]';

// Note: had to add a LinkageDataDisplay comp inside the FormProvider so we read the actual formData state to make sure we can tell when a prog id is no longer valid whether or not the formData field was actually cleared.
function LinkageDataDisplay() {
  const { formData } = useFormContext();
  return (
    <dl>
      <dd data-cy="linkage-data-display-programmeMembershipId">
        {String(formData.programmeMembershipId)}
      </dd>
      <dd data-cy="linkage-data-display-programmeName">
        {String(formData.programmeName)}
      </dd>
      <dd data-cy="linkage-data-display-localOfficeName">
        {String(formData.localOfficeName)}
      </dd>
    </dl>
  );
}

const acuteMedicineNow = "1";
const newStarterOnlyProgramme = "5";

const mountLinkage = (initialData: FormData) => {
  store.dispatch(
    updatedTraineeProfileData({
      ...mockTraineeProfile,
      programmeMemberships: mockProgrammesForLinkerTest
    })
  );

  mount(
    <Provider store={store}>
      <Router history={history}>
        <FormProvider
          initialData={initialData}
          initialPageFields={initialPageFields}
          jsonForm={formJson}
        >
          <LinkageDataDisplay />
          <FormRBuilder options={{}} validationSchema={formAValidationSchema} />
        </FormProvider>
      </Router>
    </Provider>
  );
};

describe("FormRBuilder - programme linkage", () => {
  beforeEach(() => {
    // Note: stubs to keep autosave network calls quiet
    cy.stub(FormsService.prototype, "saveTraineeFormRPartA").resolves({
      data: { id: "draft-1" }
    });
    cy.stub(FormsService.prototype, "updateTraineeFormRPartA").resolves({
      data: {}
    });
  });

  it("should clear the linked programme when the trainee changes their isArcp answer", () => {
    mountLinkage({ isArcp: null, programmeMembershipId: null });

    cy.get(arcpRadio).click();
    cy.clickSelect(progSelect);
    cy.get("[data-cy=linkage-data-display-programmeMembershipId]").should(
      "have.text",
      acuteMedicineNow
    );
    cy.get("[data-cy=linkage-data-display-programmeName]").should(
      "have.text",
      "Acute medicine"
    );

    cy.get(newStarterRadio).click();

    // Note: purge the whole set
    cy.get("[data-cy=linkage-data-display-programmeMembershipId]").should(
      "have.text",
      ""
    );
    cy.get("[data-cy=linkage-data-display-programmeName]").should(
      "have.text",
      ""
    );
    cy.get("[data-cy=linkage-data-display-localOfficeName]").should(
      "have.text",
      ""
    );
    cy.get(`${progSelect} .react-select__single-value`).should("not.exist");

    // ...and as agreed, always clear val for new select
    cy.get(`${progSelect} .react-select__control`).click();
    cy.get(".react-select__menu").should("contain.text", "Acute medicine");
  });

  it("should keep the linked programme when a saved draft is reopened", () => {
    mountLinkage({
      isArcp: true,
      programmeMembershipId: acuteMedicineNow,
      programmeName: "Acute medicine",
      localOfficeName: "East of England"
    });

    cy.get("[data-cy=linkage-data-display-programmeMembershipId]").should(
      "have.text",
      acuteMedicineNow
    );
    cy.get(`${progSelect} .react-select__single-value`).should(
      "contain.text",
      "Acute medicine"
    );
  });

  it("should clear a reopened draft whose saved programme is no longer offered", () => {
    mountLinkage({
      isArcp: true,
      programmeMembershipId: newStarterOnlyProgramme,
      programmeName: "Adult psychiatry",
      localOfficeName: "East of England"
    });

    cy.get("[data-cy=linkage-data-display-programmeMembershipId]").should(
      "have.text",
      ""
    );
    cy.get("[data-cy=linkage-data-display-programmeName]").should(
      "have.text",
      ""
    );
    cy.get("[data-cy=linkage-data-display-localOfficeName]").should(
      "have.text",
      ""
    );
  });
});
