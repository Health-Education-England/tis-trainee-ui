import { mount } from "@cypress/react";
import Create from "../Create";
import { submittedFormRPartAs } from "../../../../mock-data/submitted-formr-parta";
import { FormRPartA } from "../../../../models/FormRPartA";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { rootReducer } from "../../../../redux/reducers";
import thunk from "redux-thunk";

describe("Form R Part A - Create", () => {
  it("should mount the Create component", () => {
    const middleware = [thunk];

    const initialState = {
      formRPartA: { formData: submittedFormRPartAs[0] },
      referenceData: {
        genders: [{ label: "gender", value: "gender" }],
        colleges: [{ label: "college", value: "college" }],
        localOffices: [{ label: "localOffice", value: "localOffice" }],
        designatedBodies: [],
        curricula: [{ label: "curriculum", value: "curriculum" }],
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
    cy.get(`[data-cy="forename"]`).should("exist");
  });
});
