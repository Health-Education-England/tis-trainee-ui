import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CctHome } from "../../../../components/forms/cct/CctHome";
import store from "../../../../redux/store/store";
import { mount } from "cypress/react";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import { mockTraineeProfile } from "../../../../mock-data/trainee-profile";

describe("CctHome", () => {
  it("renders the CctHome component", () => {
    store.dispatch(updatedTraineeProfileData(mockTraineeProfile));
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/cct"]}>
          <CctHome />
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="cct-home-warning"]')
      .should("exist")
      .contains("Please read before proceeding");
    cy.get('[data-cy="cct-home-subheader-calcs"]')
      .should("exist")
      .contains("Saved calculations");
  });
});
