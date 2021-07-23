import { mount } from "@cypress/react";
import Create from "../Create";
import { submittedFormRPartAs } from "../../../../mock-data/submitted-formr-parta";
import { FormRPartA } from "../../../../models/FormRPartA";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { rootReducer } from "../../../../redux/reducers";
import thunk from "redux-thunk";
describe("Form R Part A - Create", () => {
  beforeEach(() => {
    const middleware = [thunk];
    const initialState = {
      formRPartA: { formData: submittedFormRPartAs[0] },
      referenceData: {
        genders: [{ label: "Male", value: "Male" }],
        colleges: [{ label: "college", value: "college" }],
        localOffices: [
          {
            label: "Health Education England Thames Valley",
            value: "Health Education England Thames Valley"
          }
        ],
        designatedBodies: [],
        curricula: [
          { label: "GP Returner", value: "GP Returner" },
          { label: "Doctor", value: "Doctor" }
        ],
        qualifications: [{ label: "qualification", value: "qualification" }],
        grades: [{ label: "grade", value: "grade" }],
        immigrationStatus: [
          { label: "Tier 1", value: "Tier 1" },
          { label: "Other", value: "Other" }
        ],
        isLoaded: true
      }
    };
    const store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(...middleware)
    );
    const createComponent = (_: FormRPartA | null) => (
      <Provider store={store}>
        <Create history={[]} location={[]} />
      </Provider>
    );
    mount(createComponent(submittedFormRPartAs[0]));
  });

  it("should mount the Create component", () => {
    cy.get(`[data-cy="forename"]`).should("exist");
  });

  it("should display Specialties 1 & 2 when CCT Declaration is selected", () => {
    cy.get(`[data-cy="declarationType0"]`).should("exist");
    cy.get("#DeclarationSpeciality1").should("not.exist");
    cy.get("[data-cy=declarationType0]").click();
    cy.get("#DeclarationSpeciality1").should("exist");
    cy.get("#DeclarationSpeciality2").should("exist");
  });

  it("Should display the correct option when using smart search", () => {
    cy.get("[data-cy=declarationType0]").click();
    cy.get("#DeclarationSpeciality1").clear().type("doct");
    cy.get("#DeclarationSpeciality1 + ul li:first").click();
    cy.get("#DeclarationSpeciality1").should("have.value", "Doctor");
  });

  it("should display a validation error for Specialty 1 when no value is chosen", () => {
    cy.get("[data-cy=declarationType0]").click();
    cy.get(".nhsuk-error-message").should("exist");
  });

  it("should remove the validation error for Specialty 1 when an option is chosen", () => {
    cy.get("[data-cy=declarationType0]").click();
    cy.get(".nhsuk-error-message").should("exist");
    cy.get("#DeclarationSpeciality1").clear().type("gp");
    cy.get("#DeclarationSpeciality1 + ul li:first").click();
    cy.get("#DeclarationSpeciality1").should("have.value", "GP Returner");
    cy.get(".nhsuk-error-message").should("not.exist");
  });

  it("should reset the validation error for Specialty 1 if a non-CCT Declaration is chosen", () => {
    cy.get("[data-cy=declarationType0]").click();
    cy.get(".nhsuk-error-message").should("exist");
    cy.get("[data-cy=declarationType1]").click();
    cy.get(".nhsuk-error-message").should("not.exist");
  });
});
