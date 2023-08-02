import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import { mockTraineeProfile } from "../../../mock-data/trainee-profile";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";
import Support from "../../../components/support/Support";
import history from "../../../components/navigation/history";
import React from "react";
import { updatedReference } from "../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../mock-data/combinedReferenceData";

describe("Support", () => {
  it("should render the Support page on successful main app load", () => {
    const MockedSupportSucceeded = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("succeeded"));
      dispatch(updatedTraineeProfileData(mockTraineeProfile));
      dispatch(updatedReference(mockedCombinedReference));
      return <Support />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSupportSucceeded />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=supportHeading]")
      .should("exist")
      .should("include.text", "Support");
    cy.get('[data-cy="supportCreateAccFaqsLink"]').should(
      "have.attr",
      "href",
      "https://tis-support.hee.nhs.uk/trainees/when-i-sign-up/"
    );
    cy.get('[data-cy="supportSignInFaqsLink"]').should(
      "have.attr",
      "href",
      "https://tis-support.hee.nhs.uk/trainees/when-i-log-in/"
    );
    cy.get('[data-cy="supportFormRFaqsLink"]').should(
      "have.attr",
      "href",
      "https://tis-support.hee.nhs.uk/trainees/form-r/"
    );
    cy.get('[data-cy="supportChangesFaqsLink"]').should(
      "have.attr",
      "href",
      "https://tis-support.hee.nhs.uk/trainees/changes-to-account/"
    );
    cy.get('[data-cy="loSupportHeading"]').should(
      "include.text",
      "Local Office support"
    );
    cy.get('[data-cy="loSupportLegend"]').should(
      "include.text",
      "Form R process & data quality issues(e.g. Editing a submitted form, incorrect data.)"
    );
    cy.get('[data-cy="loSupportListPrompt"]').should(
      "include.text",
      "Please select your Local Office from the list below:"
    );
    cy.get("[data-cy=localOffice]").select(
      "Health Education England South London"
    );
    cy.get('[data-cy="pgdmeLink"] > .nhsuk-action-link__text').should(
      "include.text",
      "Click here to email your support request via the PGMDE Support Portal"
    );
    cy.get("[data-cy=localOffice]").select(
      "Health Education England Thames Valley"
    );
    cy.get('[data-cy="pgdmeLink"] > .nhsuk-action-link__text').should(
      "not.exist"
    );
    cy.get(
      '[data-cy="loSupportLabel"] > .nhsuk-card__content > form > [data-cy="supportCats"]'
    ).should("exist");

    cy.get(
      '[data-cy="supportCats"] > .autocomplete-select > .react-select__control'
    )
      .should("exist")
      .first()
      .type("digi")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(
      '[data-cy="supportCats"] > .autocomplete-select > .react-select__control'
    )
      .first()
      .type("login")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get('[data-cy="loSupportCatPrompt"]')
      .should(
        "include.text",
        "Please select the category (or categories) that best describes your support issue:"
      )
      .click();
    cy.get('[data-cy="loSupportLink"]')
      .should("exist")
      .should("have.attr", "href");
    cy.get('[data-cy="loSupportLink"] > .nhsuk-action-link__text').should(
      "include.text",
      "Please click here to email Health Education England Thames Valley"
    );

    cy.get("[data-cy=localOffice]").select(
      "Health Education England East of England"
    );
    cy.get(
      '[data-cy="supportCats"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    ).should("exist");
    cy.get('[data-cy="loSupportLink"]').should("exist");
    cy.get('[data-cy="loSupportLink"] > .nhsuk-action-link__text').should(
      "include.text",
      "Please click here to email Health Education England East of England"
    );

    cy.get("[data-cy=localOffice]").select("-- Please select --");
    cy.get(
      '[data-cy="supportCats"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    ).should("not.exist");

    cy.get('[data-cy="techSupportHeading"]')
      .should("exist")
      .should("include.text", "Technical support");
    cy.get('[data-cy="techSupportLegend"]')
      .should("exist")
      .should(
        "include.text",
        "App-related technical issues(e.g. Error messages, Form R not saving.)"
      );
    cy.get('[data-cy="supportCatsTechLabel"]')
      .should("exist")
      .should(
        "include.text",
        "Please select the category (or categories) that best describes your technical issue:"
      );
    cy.get(
      '[data-cy="supportCatsTech"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .should("exist")
      .type("formr")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get('[data-cy="supportCatsTechLabel"]').click();
    cy.get('[data-cy="techSupportLink"] > .nhsuk-action-link__text').should(
      "include.text",
      "Please click here to email Technical Support"
    );
    cy.get('[data-cy="techSupportLink"]').should("have.attr", "href");
  });
});
