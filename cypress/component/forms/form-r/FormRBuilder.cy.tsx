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
  buildFormRPrefill,
  FormRPrefillResult
} from "../../../../utilities/FormRUtilities";
import {
  mockProgrammesForLinkerTest,
  mockProgrammesForLinkerTestOutsideArcp,
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
      <dd data-cy="linkage-data-display-programmeSpecialty">
        {String(formData.programmeSpecialty)}
      </dd>
    </dl>
  );
}

const acuteMedicineNow = "1";
const arcpOnlyProgramme = "3";
const outsideBothWindowsProgramme = "4";
const newStarterOnlyProgramme = "5";

const mountLinkage = (
  initialData: FormData,
  programmeMemberships = mockProgrammesForLinkerTest,
  prefillResult?: FormRPrefillResult
) => {
  store.dispatch(
    updatedTraineeProfileData({
      ...mockTraineeProfile,
      programmeMemberships
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
          <FormRBuilder
            options={{}}
            validationSchema={formAValidationSchema}
            prefillResult={prefillResult}
          />
        </FormProvider>
      </Router>
    </Provider>
  );
};

const prefillFor = (programmeMembershipId: string) =>
  buildFormRPrefill(mockProgrammesForLinkerTest, programmeMembershipId);

const mountPrefilled = (
  programmeMembershipId: string,
  programmeMemberships = mockProgrammesForLinkerTest
) => {
  const prefillResult = prefillFor(programmeMembershipId);
  mountLinkage(
    prefillResult.outcome === "prefilled"
      ? { ...prefillResult.prefill }
      : { isArcp: null, programmeMembershipId: null },
    programmeMemberships,
    prefillResult
  );
};

const allNote = "[data-cy=prefillAllNote]";
const programmeOnlyNote = "[data-cy=prefillProgrammeOnlyNote]";
const unavailableNote = "[data-cy=prefillUnavailableNote]";

// Note: stubs to keep autosave network calls quiet
const stubAutosave = () => {
  cy.stub(FormsService.prototype, "saveTraineeFormRPartA").resolves({
    data: { id: "draft-1" }
  });
  cy.stub(FormsService.prototype, "updateTraineeFormRPartA").resolves({
    data: {}
  });
};

describe("FormRBuilder - programme linkage", () => {
  beforeEach(stubAutosave);

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
    cy.get("[data-cy=linkage-data-display-programmeSpecialty]").should(
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
    cy.get("[data-cy=linkage-data-display-programmeSpecialty]").should(
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
      localOfficeName: "East of England",
      programmeSpecialty: "Acute medicine"
    });

    cy.get("[data-cy=linkage-data-display-programmeMembershipId]").should(
      "have.text",
      acuteMedicineNow
    );
    cy.get("[data-cy=linkage-data-display-programmeSpecialty]").should(
      "have.text",
      "Acute medicine"
    );
    cy.get(`${progSelect} .react-select__single-value`).should(
      "contain.text",
      "Acute medicine"
    );
  });

  it("should display 'no progs' msg straight away when the profile has zero progs", () => {
    mountLinkage({ isArcp: null, programmeMembershipId: null }, []);

    cy.get("[data-cy=noProgrammesNote]").should(
      "contain.text",
      "Your TIS Self-Service profile has no programmes"
    );
    cy.get("[data-cy=noLinkageOptionsNote]").should("not.exist");
  });

  it("should display 'no progs' msg if no progs to link to after isArcp choice", () => {
    mountLinkage(
      { isArcp: null, programmeMembershipId: null },
      mockProgrammesForLinkerTestOutsideArcp
    );

    cy.get("[data-cy=noLinkageOptionsNote]").should("not.exist");

    cy.get(arcpRadio).click();
    cy.get("[data-cy=noLinkageOptionsNote]").should(
      "contain.text",
      "No programmes are available to link to your chosen reason."
    );
    cy.get("[data-cy=noProgrammesNote]").should("not.exist");

    cy.get(newStarterRadio).click();
    cy.get("[data-cy=noLinkageOptionsNote]").should("not.exist");
  });

  it("should offer no programmes before the trainee picks a reason", () => {
    mountLinkage({ isArcp: null, programmeMembershipId: null });

    cy.get(`${progSelect} .react-select__control`).click();
    cy.get(".react-select__menu").should("contain.text", "No options");
  });

  it("should show a pre-filled programme while the reason is still blank", () => {
    mountLinkage({
      isArcp: null,
      programmeMembershipId: acuteMedicineNow,
      programmeName: "Acute medicine",
      localOfficeName: "East of England",
      programmeSpecialty: "Acute medicine"
    });

    cy.get(`${progSelect} .react-select__single-value`).should(
      "contain.text",
      "Acute medicine"
    );
    cy.get("[data-cy=linkage-data-display-programmeMembershipId]").should(
      "have.text",
      acuteMedicineNow
    );

    // Note: the pre-selected programme remains whatever isArcp reason is chosen
    cy.get(arcpRadio).click();
    cy.get("[data-cy=linkage-data-display-programmeMembershipId]").should(
      "have.text",
      acuteMedicineNow
    );
    cy.get(`${progSelect} .react-select__single-value`).should(
      "contain.text",
      "Acute medicine"
    );
  });

  it("should not offer a blank-reason programme that is outside both windows", () => {
    mountLinkage({
      isArcp: null,
      programmeMembershipId: outsideBothWindowsProgramme,
      programmeName: "Acute medicine",
      localOfficeName: "East of England",
      programmeSpecialty: "Acute medicine"
    });

    cy.get(`${progSelect} .react-select__single-value`).should("not.exist");
    cy.get(`${progSelect} .react-select__control`).click();
    cy.get(".react-select__menu").should("contain.text", "No options");
  });

  it("should clear a reopened draft whose saved programme is no longer offered", () => {
    mountLinkage({
      isArcp: true,
      programmeMembershipId: newStarterOnlyProgramme,
      programmeName: "Adult psychiatry",
      localOfficeName: "East of England",
      programmeSpecialty: "Adult psychiatry"
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
    cy.get("[data-cy=linkage-data-display-programmeSpecialty]").should(
      "have.text",
      ""
    );
  });
});

describe("FormRBuilder - prefill notices", () => {
  beforeEach(stubAutosave);

  it("should show no prefill notice when the trainee arrived without a link", () => {
    mountLinkage({ isArcp: null, programmeMembershipId: null });

    cy.get(allNote).should("not.exist");
    cy.get(programmeOnlyNote).should("not.exist");
    cy.get(unavailableNote).should("not.exist");
  });

  it("should say both fields were pre-selected when the reason was worked out", () => {
    mountPrefilled(arcpOnlyProgramme);

    cy.get(allNote).should(
      "contain.text",
      "Your reason for submitting this form and the linked programme have been pre-selected"
    );
    cy.get(programmeOnlyNote).should("not.exist");
    cy.get(unavailableNote).should("not.exist");
  });

  it("should ask for a reason when only the programme was pre-selected", () => {
    mountPrefilled(acuteMedicineNow);

    cy.get(programmeOnlyNote).should(
      "contain.text",
      "you still need to give the reason for submitting this form"
    );
    cy.get(allNote).should("not.exist");
    cy.get(unavailableNote).should("not.exist");
  });

  it("should keep the programme-only notice after the trainee picks a reason", () => {
    mountPrefilled(acuteMedicineNow);

    cy.get(arcpRadio).click();
    cy.get(programmeOnlyNote).should("exist");
  });

  it("should explain why nothing could be pre-selected", () => {
    mountPrefilled(outsideBothWindowsProgramme);

    cy.get(unavailableNote).should(
      "contain.text",
      "can no longer be linked to this form"
    );
    cy.get(allNote).should("not.exist");
    cy.get(programmeOnlyNote).should("not.exist");
  });

  it("should prefer the 'no progs' msg over a prefill notice", () => {
    mountPrefilled(outsideBothWindowsProgramme, []);

    cy.get("[data-cy=noProgrammesNote]").should("exist");
    cy.get(unavailableNote).should("not.exist");
  });

  it("should prefer the 'no linkage options' msg once a reason is chosen", () => {
    mountLinkage(
      { isArcp: null, programmeMembershipId: null },
      mockProgrammesForLinkerTestOutsideArcp,
      { outcome: "unavailable" }
    );

    cy.get(unavailableNote).should("exist");

    cy.get(arcpRadio).click();
    cy.get("[data-cy=noLinkageOptionsNote]").should("exist");
    cy.get(unavailableNote).should("not.exist");
  });
});
