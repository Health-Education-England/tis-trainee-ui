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
        genders: [{ label: "gender", value: "gender" }],
        colleges: [{ label: "college", value: "college" }],
        localOffices: [{ label: "localOffice", value: "localOffice" }],
        designatedBodies: [],
        curricula: [
          { label: "GP Returner", value: "GP Returner" },
          { label: "Doctor", value: "Doctor" }
        ],
        qualifications: [{ label: "qualification", value: "qualification" }],
        grades: [{ label: "grade", value: "grade" }],
        immigrationStatus: [
          { label: "immigrationStatus", value: "immigrationStatus" },
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

  it("Specualities 1 & 2 should exist when CCT is selected in Declirations", () => {
    cy.get(`[data-cy="declarationType0"]`).should("exist");
    cy.get("#DeclarationSpeciality1").should("not.exist");
    cy.get("[data-cy=declarationType0]").click();
    cy.get("#DeclarationSpeciality1").should("exist");
    cy.get("#DeclarationSpeciality2").should("exist");
  });

  it("Smart search should work", () => {
    cy.get("[data-cy=declarationType0]").click();
    cy.get("#DeclarationSpeciality1").clear().type("doct");
    cy.get("#DeclarationSpeciality1 + ul li:first").click();
    cy.get("#DeclarationSpeciality1").should("have.value", "Doctor");
  });
});
