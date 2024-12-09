import store from "../../../../redux/store/store";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import { mockTraineeProfile } from "../../../../mock-data/trainee-profile";
import { CctCalcCreate } from "../../../../components/forms/cct/CctCalcCreate";
import dayjs from "dayjs";

describe("CctCalcCreate", () => {
  it("renders the new cct calc form for completion", () => {
    store.dispatch(updatedTraineeProfileData(mockTraineeProfile));
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/cct"]}>
          <CctCalcCreate />
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="backLink-to-cct-home"]').should("exist").click();
    cy.url().should("include", "/cct");
    cy.get('[data-cy="cct-calc-warning"]')
      .should("exist")
      .contains("Please note");
    cy.get('[data-cy="cct-calc-warning"] > p > a')
      .last()
      .should("include.text", "contact your Local Office support");
    cy.get('[data-cy="cct-calc-header"]')
      .should("exist")
      .contains("CCT Calculator - Changing hours (LTFT)");

    // prog modal
    cy.get('[data-cy="show-prog-modal-btn"]').should("be.visible").click();
    cy.get('[data-cy="dialogModal"]').should("exist");
    cy.get('[data-cy="dialogModal"] > div > h2').first().contains("Programmes");
    cy.get('[data-cy="dialogModal"] > div > h2').last().contains("Placements");
    cy.get('[data-cy="currentExpand"]').first().should("exist").click();
    cy.get('[data-cy="subheaderOnboarding"]').should("exist");
    cy.get('[data-cy="subheaderLtft"]').should("exist");
    cy.get('[data-cy="modal-cancel-btn"]').should("exist").click();
    cy.get('[data-cy="dialogModal"]').should("not.be.visible");

    //main form - header
    cy.get('[data-cy="cct-calc-form"]').should("exist");
    cy.get('[data-cy="cct-calc-btn"]').should("not.exist");
    cy.get('[data-cy="linked-prog-header"]').contains("Linked Programme");
    cy.get('[data-cy="linked-prog-table"]').should("not.exist");

    // - linked prog
    cy.clickSelect('[data-cy="programmeMembership.id"]', null, true);
    cy.get('[data-cy="programmeMembership.id"]').should("exist");
    cy.get('[data-cy="table-header-linked-prog-name"]').contains(
      "Linked Programme"
    );
    cy.get('[data-cy="table-data-linked-prog-name"]').contains("Cardiology");
    // - linked prog - clear
    cy.get(
      '[data-cy="programmeMembership.id"] > .autocomplete-select > .react-select__control > .react-select__indicators > .react-select__clear-indicator'
    ).click();
    cy.get('[data-cy="linked-prog-table"]').should("not.exist");
    cy.clickSelect('[data-cy="programmeMembership.id"]', null, true);

    // - current WTE
    cy.clickSelect('[data-cy="programmeMembership.wte"]', null, true);
    cy.get('[data-cy="changes[0].type"]').contains("WTE (e.g. LTFT)");
    cy.get(".nhsuk-error-message")
      .first()
      .contains("Please enter a start date");
    cy.get('[data-cy="changes[0].startDate"]').type("2022-01-01");
    cy.get(".nhsuk-error-message")
      .first()
      .contains("Change date cannot be before today.");
    cy.get('[data-cy="start-short-notice-warn"]').should("not.exist");
    cy.get('[data-cy="changes[0].startDate"]').type(
      dayjs().format("YYYY-MM-DD")
    );
    cy.get('[data-cy="start-short-notice-warn"]').should("exist");
    cy.get('[data-cy="changes[0].wte"] > .nhsuk-error-message').contains(
      "Please enter a Proposed WTE"
    );
    cy.clickSelect('[data-cy="changes[0].wte"]', null, true);
    cy.get('[data-cy="changes[0].wte"] > .nhsuk-error-message').contains(
      "WTE values must be different"
    );
    cy.clickSelect('[data-cy="changes[0].wte"]', null, false);
    cy.get('[data-cy="cct-calc-btn"]').should("exist").click();
  });
});
