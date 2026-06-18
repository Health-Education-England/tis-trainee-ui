import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CctHome } from "../../../../components/forms/cct/CctHome";
import store from "../../../../redux/store/store";
import { mount } from "cypress/react";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import { mockTraineeProfile } from "../../../../mock-data/trainee-profile";
import dayjs from "dayjs";

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
      .contains("Important");
    cy.get('[data-cy="cct-home-subheader-prog"]')
      .should("exist")
      .contains("Current & future programmes");
    cy.get('[data-cy="cct-home-prog-2"]')
      .should("exist")
      .contains("General Practice");
    cy.get('[data-cy="cct-home-prog-item-startdate-2"]')
      .should("exist")
      .contains("01/01/2022");
    cy.get('[data-cy="cct-home-prog-item-end-2"]')
      .should("exist")
      .contains(dayjs().add(4, "year").format("DD/MM/YYYY"));
    cy.get('[data-cy="cct-home-subheader-calcs"]')
      .should("exist")
      .contains("Saved calculations");
    cy.get('[data-cy="cct-home-new-calc-btn"]')
      .should("exist")
      .contains("Make a new CCT Calculation");
  });
});
