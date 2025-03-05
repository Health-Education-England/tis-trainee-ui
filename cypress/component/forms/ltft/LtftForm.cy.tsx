import store from "../../../../redux/store/store";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { mockLtftDraft0 } from "../../../../mock-data/mock-ltft-data";
import { LtftForm } from "../../../../components/forms/ltft/LtftForm";
import { updatedLtft } from "../../../../redux/slices/ltftSlice";
import { FormProvider } from "../../../../components/forms/form-builder/FormContext";
import ltftJson from "../../../../components/forms/ltft/ltft.json";
import {
  Field,
  Form
} from "../../../../components/forms/form-builder/FormBuilder";

const mountLtftWithMockData = () => {
  store.dispatch(updatedLtft(mockLtftDraft0));
  const initialPageFields = ltftJson.pages[0].sections.flatMap(
    section => section.fields as Field[]
  );
  mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/ltft/create"]}>
        <FormProvider
          initialData={mockLtftDraft0}
          initialPageFields={initialPageFields}
          jsonForm={ltftJson as Form}
        >
          <LtftForm />
        </FormProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe("LtftForm", () => {
  it("renders the ltft form for completion", () => {
    mountLtftWithMockData();
    // page 1
    cy.get("h2").contains("Main application form");
    cy.get('[data-cy="progress-header"] > :nth-child(1)').contains(
      "Part 1 of 3 - Discussing your proposals"
    );
    cy.get(
      '[data-cy="WarningCallout-ltftDiscussionInstructions-label"] > span'
    ).should("exist");
    cy.get(".nhsuk-warning-callout > :nth-child(2) > :nth-child(4)").contains(
      "For information on Professional support contact"
    );
    cy.get(
      ":nth-child(4) > .nhsuk-card__content > .nhsuk-card__heading"
    ).contains("Your Training Programme Director (TPD) details");
    cy.get('[data-cy="tpdName-input"]').type("Dr. TPD");
    cy.get('[data-cy="tpdEmail-inline-error-msg"]')
      .should("exist")
      .contains("Email address is required");
    cy.navNext(true);
    cy.get('[data-cy="navNext"]').should("have.class", "disabled-link");
    cy.get('[data-cy="tpdEmail-input"]').type("tpd@e.mail");
    cy.navNext();

    // page 2
    cy.get('[data-cy="progress-header"] > :nth-child(1)').contains(
      "Part 2 of 3 - Reason(s) for applying"
    );
    cy.get(
      '[data-cy="WarningCallout-ltftReasonsInstructions-label"] > span'
    ).contains("Important");
    cy.get(".nhsuk-warning-callout > :nth-child(2) > :nth-child(1)").contains(
      "Note: the reason for applying is for reporting purposes only and has no bearing on the decision-making process."
    );
    cy.get(".nhsuk-warning-callout > :nth-child(2) > :nth-child(3)").contains(
      "If your reason isn't in the list then please select 'other reason' and give details in the space provided."
    );
    cy.get(".nhsuk-card__heading").contains("Reason(s) for applying");
    cy.get('[data-cy="reasonsOtherDetail-input"]').should("not.exist");
    cy.clickSelect('[data-cy="reasonsSelected"]', "other reason");
    cy.get('[data-cy="reasonsOtherDetail-input"]').type("My other reason");
    cy.navNext();

    // page 3
    cy.get('[data-cy="progress-header"] > :nth-child(1)').contains(
      "Part 3 of 3 - Personal Details"
    );
    cy.navNext(true);
    cy.get('[data-cy="navNext"]').should("have.class", "disabled-link");
    cy.get('[data-cy="skilledWorkerVisaHolder-inline-error-msg"]').contains(
      "Please select Yes or No for: Are you a Tier 2 / Skilled Worker Visa holder?"
    );
    cy.get('[data-cy="skilledWorkerVisaHolder-Yes-input"]').check();
    cy.navNext();
    cy.url().should("include", "/ltft/confirm");
  });
});
