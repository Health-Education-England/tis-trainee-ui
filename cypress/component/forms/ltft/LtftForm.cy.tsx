import store from "../../../../redux/store/store";
import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import {
  mockLtftNewFormObj,
  mockLtftSubmittedFormObj,
  mockLtftUnsubmittedFormObj
} from "../../../../mock-data/mock-ltft-data";
import { LtftForm } from "../../../../components/forms/ltft/LtftForm";
import { updatedLtft } from "../../../../redux/slices/ltftSlice";
import {
  ltftDiscussionText2,
  ltftReasonsText1,
  ltftTier2VisaImportantText1
} from "../../../../components/forms/form-builder/form-sections/ImportantText";
import { LtftObjNew } from "../../../../models/LtftTypes";
import { makeValidProgrammeOptions } from "../../../../utilities/ltftUtilities";
import { mockProgrammeMemberships } from "../../../../mock-data/trainee-profile";
import { updatedUserFeatures } from "../../../../redux/slices/userSlice";
import dayjs from "dayjs";
import {
  ltftReasonsError,
  LtftVisaError
} from "../../../../components/forms/ltft/ltftValidationSchema";

const mountLtftWithMockData = (mockLtftObj: LtftObjNew) => {
  store.dispatch(updatedLtft(mockLtftObj));
  const qualifyingProgrammes = ["7ab1aae3-83c2-4bb6-b1f3-99146e79b362"];
  store.dispatch(
    updatedUserFeatures({
      forms: {
        ltft: {
          qualifyingProgrammes: qualifyingProgrammes,
          enabled: true
        }
      }
    } as any)
  );

  const pmOptions = makeValidProgrammeOptions(
    mockProgrammeMemberships,
    qualifyingProgrammes
  );

  mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/ltft/create"]}>
        <LtftForm pmOptions={pmOptions} />
      </MemoryRouter>
    </Provider>
  );
};

describe("LtftForm - draft", () => {
  it("renders the ltft form for completion", () => {
    mountLtftWithMockData(mockLtftNewFormObj);
    // status details section should not exist in DRAFT
    cy.get('[data-cy="ltftName"]').should("not.exist");
    cy.get('[data-cy="ltftCreated"]').should("not.exist");
    cy.get('[data-cy="ltftModified"]').should("not.exist");
    cy.get('[data-cy="ltftRef"]').should("not.exist");

    // page 1
    cy.get("h2").contains("Application form");
    cy.get("h3").contains("Part 1 of 10 - Your Programme");
    cy.get('[data-cy="pmId-label"]').contains(
      "Which programme will your proposed change in working hours affect?"
    );
    cy.get("#pmId-error").should("not.exist");
    cy.clickSelect('[data-cy="pmId"]');
    cy.get("#pmId").clear();
    cy.get("#pmId-error").should("exist").contains("Programme is required");
    cy.get("#errorSummaryTitle").should("exist");
    cy.get('[data-cy="error-txt-Programme is required"]').should("exist");
    cy.clickSelect('[data-cy="pmId"]');
    cy.get("#pmId-error").should("not.exist");
    cy.navNext();

    // page 2
    cy.get("h3").contains("Part 2 of 10 - Working hours before change");
    cy.get('[data-cy="wteBeforeChange-label"]').should("exist");
    cy.get('[data-cy="wteBeforeChange-hint"]').should("exist");
    cy.get('[data-cy="wteBeforeChange-input"]').type("1.a");
    cy.get('[data-cy="wteBeforeChange-input"]').should("have.value", "1");
    cy.get('[data-cy="wteBeforeChange-input"]').clear().type("1000");
    cy.get('[data-cy="wteBeforeChange-input"]').should("have.value", "100");
    cy.navNext();

    // part 3
    cy.get("h3").contains(
      "Part 3 of 10 - Proposed change to your working hours"
    );
    cy.navNext();
    cy.get("#wte-error").contains(
      "The proposed percentage of full time hours is required"
    );
    cy.clearAndType('[data-cy="wte-input"]', "0");
    cy.get("#wte-error").contains(
      "The proposed percentage of full time hours cannot be zero"
    );
    cy.clearAndType('[data-cy="wte-input"]', "1");
    cy.get(".field-warning-container").should("exist");
    cy.get(".field-warning-msg").contains(
      "Warning: A bespoke working hours arrangement (i.e. other than 100%, 80%, 70%, 60% or 50%) will require Dean approval."
    );
    // check warning persists on nav
    cy.get('[data-cy="navPrevious"]').click();
    cy.navNext();
    cy.get(".field-warning-msg").should("exist");
    cy.get('[data-cy="wte-input"]').type("0000");
    cy.get('[data-cy="wte-input"]').should("have.value", "100");
    cy.get(".field-warning-container").should("not.exist");
    cy.get("#wte-error").contains(
      "Your proposed change must be different from the percentage you gave in Part 2"
    );
    cy.get('[data-cy="wte-input"]').clear().type("80");
    cy.get("#wte-error").should("not.exist");
    cy.get(".field-warning-container").should("not.exist");
    cy.navNext();

    // part 4
    cy.get("h3").contains("Part 4 of 10 - Start date");
    const dateWithin16WeeksOfToday = dayjs()
      .startOf("day")
      .add(16, "weeks")
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    cy.clearAndType('[data-cy="startDate-input"]', "1000-05-01");
    cy.get("#startDate-error").contains("Change cannot begin before today");
    cy.clearAndType('[data-cy="startDate-input"]', dateWithin16WeeksOfToday);
    cy.get(".field-warning-msg").contains(
      "Warning: Giving less than 16 weeks notice to change your working hours is classed as a late application and will only be considered on an exceptional basis."
    );
    cy.get("#startDate-error").should("not.exist");
    cy.navNext();

    // Part 5
    cy.get("h3").contains("Part 5 of 10 - Pre-approver discussions");
    cy.get(
      '[data-cy="WarningCallout-ltftDiscussionInstructions-label"] > span'
    ).should("exist");
    cy.get(".nhsuk-warning-callout > :nth-child(3)").should(
      "include.text",
      ltftDiscussionText2.slice(0, 100)
    );
    cy.get(".nhsuk-warning-callout > :nth-child(4)").contains(
      "For information on Professional support contact"
    );
    cy.get('[data-cy="tpdName-label"]').contains("Pre-approver name");
    cy.get('[data-cy="tpdName-input"]').type("Dr. TPD");
    cy.get("#tpdEmail-error")
      .should("exist")
      .contains("Email address is required");
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get('[data-cy="error-txt-Email address is required"]').should("exist");
    cy.navNext(true);
    cy.get('[data-cy="navNext"]').should("have.class", "disabled-link");
    cy.get('[data-cy="tpdEmail-label"]').contains("Pre-approver email");
    cy.get('[data-cy="tpdEmail-input"]').type("tpd@e.mail");
    cy.navNext();

    // part 6
    cy.get("h3").contains("Part 6 of 10 - Other discussions");
    cy.get('[data-cy="add-Other Discussions-button"]').should("exist").click();
    cy.clearAndType('[data-cy="name-input"]', "Mr AN Other");
    cy.clearAndType('[data-cy="email-input"]', "mr@an.other");
    cy.clickSelect('[data-cy="role"]');
    cy.navNext();

    // part 7
    cy.get("h3").contains("Part 7 of 10 - Reason(s) for applying");
    cy.get(
      '[data-cy="WarningCallout-ltftReasonsInstructions-label"] > span'
    ).contains("Important");
    cy.get(".nhsuk-warning-callout > p").contains(ltftReasonsText1);
    cy.navNext();
    cy.get("#reasonsSelected-error").contains(ltftReasonsError);
    cy.get(".nhsuk-card__heading").contains("Reason(s) for applying");
    cy.get('[data-cy="reasonsSelected-label"]').should("exist");
    cy.get('[data-cy="reasonsSelected-hint"]').should(
      "include.text",
      "You can choose more than one reason if applicable (for example, 'Caring responsibilities' and 'Training / career development')."
    );
    cy.get('[data-cy="reasonsOtherDetail-input"]').should("not.exist");
    cy.clickSelect('[data-cy="reasonsSelected"]', "other reason");
    cy.get('[data-cy="reasonsOtherDetail-input"]').type("My other reason");
    cy.navNext();

    // part 8
    cy.get("h3").contains("Part 8 of 10 - Supporting information");
    cy.navNext();
    cy.get("#supportingInformation-error").contains(
      "Supporting information is required"
    );
    cy.get('[data-cy="supportingInformation-text-area-input"]').type(
      "This is my supporting information"
    );
    cy.get(".field-warning-msg").contains(
      "Please include supporting information for why you are making a late application i.e. giving less than 16 weeks notice to change your working hours."
    );
    cy.navNext();

    // part 9
    cy.get("h3").contains(
      "Part 9 of 10 - Tier 2 Visa or Skilled Worker Visa status"
    );
    cy.get(".nhsuk-warning-callout > p").contains(ltftTier2VisaImportantText1);
    cy.get('[data-cy="skilledVisaWorkerMoreInfoSummary"]').should("exist");
    cy.navNext();
    cy.get("#skilledWorkerVisaHolder-error").contains(LtftVisaError);
    cy.get('[data-cy="skilledWorkerVisaHolder-Yes-input"]').check();
    cy.navNext();

    // part 10
    cy.get("h3").contains("Part 10 of 10 - Personal Details");
    cy.navNext();
    cy.url().should("include", "/ltft/confirm");
  });
});

describe("LtftForm - submitted", () => {
  it("should render status details section", () => {
    mountLtftWithMockData(mockLtftSubmittedFormObj);
    cy.get('[data-cy="SUBMITTED-header"]')
      .should("exist")
      .contains("Submitted application");
    cy.get('[data-cy="ltftName"]').contains("my submitted ltft application");
    cy.get('[data-cy="ltftCreated"]').should("exist");
    cy.get('[data-cy="ltftModified"]').should("exist");
    cy.get('[data-cy="ltftRef"]').contains("ltft_47165_001");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 1 of 10 - Your Programme"
    );
  });
});

describe("LtftForm - unsubmitted", () => {
  it("should render status details section", () => {
    mountLtftWithMockData(mockLtftUnsubmittedFormObj);
    cy.get('[data-cy="UNSUBMITTED-header"]')
      .should("exist")
      .contains("Unsubmitted application");
    cy.get('[data-cy="ltftName"]').contains("my Unsubmitted LTFT");
    cy.get('[data-cy="ltftCreated"]').should("exist");
    cy.get('[data-cy="ltftModified"]').should("exist");
    cy.get('[data-cy="ltftModifiedBy"]').contains("TIS Admin");
    cy.get('[data-cy="ltfReason"]').contains("Change WTE percentage");
    cy.get('[data-cy="ltftMessage"]').contains("status reason message");
    cy.get('[data-cy="ltftRef"]').contains("ltft_47165_001");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 1 of 10 - Your Programme"
    );
  });
});
