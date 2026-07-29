import store from "../../../../redux/store/store";
import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import {
  mockLtftNewFormObj,
  mockLtftUnsubmittedFormObj
} from "../../../../mock-data/mock-ltft-data";
import { LtftForm } from "../../../../components/forms/ltft/LtftForm";
import {
  updatedEditPageNumberLtft,
  updatedLtft
} from "../../../../redux/slices/ltftSlice";
import {
  ltftDiscussionText2,
  ltftReasonsText1,
  ltftTier2VisaImportantText1
} from "../../../../components/forms/form-builder/form-sections/ImportantText";
import { LtftObjNew } from "../../../../models/LtftTypes";
import { makeValidProgrammeOptions } from "../../../../utilities/ltftUtilities";
import {
  mockProgrammeMemberships,
  mockTraineeProfile,
  mockUserFeaturesLtftPilot
} from "../../../../mock-data/trainee-profile";
import { updatedUserFeatures } from "../../../../redux/slices/userSlice";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import dayjs from "dayjs";
import {
  ltftExceptionalReasonsError,
  ltftNoticeError,
  ltftReasonsError,
  LtftVisaError
} from "../../../../components/forms/ltft/ltftValidationSchema";
import {
  ltftLegacyStartDateGateCancelBtn,
  ltftLegacyStartDateGateLabel,
  ltftLegacyStartDateGateSkipHint
} from "../../../../utilities/Constants";

const mountLtftWithMockData = (mockLtftObj: LtftObjNew) => {
  store.dispatch(updatedLtft(mockLtftObj));
  store.dispatch(updatedTraineeProfileData(mockTraineeProfile));
  const qualifyingProgrammes = ["7ab1aae3-83c2-4bb6-b1f3-99146e79b362"];
  store.dispatch(updatedUserFeatures(mockUserFeaturesLtftPilot));

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
    cy.get('[data-cy="wteBeforeChange-input"]').clear();
    cy.get('[data-cy="wteBeforeChange-input"]').type("1000");
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
    cy.get('[data-cy="wte-input"]').clear();
    cy.get('[data-cy="wte-input"]').type("80");
    cy.get("#wte-error").should("not.exist");
    cy.get(".field-warning-container").should("not.exist");
    cy.navNext();

    // part 4 - Start date (Yes / compliant path)
    cy.get("h3").contains("Part 4 of 10 - Start date");
    cy.get('[data-cy="startDate-input"]').should("not.exist");
    cy.get('[data-cy="exceptionalReasons-text-area-input"]').should(
      "not.exist"
    );
    cy.get('[data-cy="exceptionalReasonsDate-input"]').should("not.exist");
    cy.navNext();
    cy.get("#canGiveCompliantStartDate-error").contains(ltftNoticeError);
    cy.get('[data-cy="canGiveCompliantStartDate-Yes-input"]').check();
    cy.get("#canGiveCompliantStartDate-error").should("not.exist");
    cy.get('[data-cy="earliestStartDateInfo-info"]')
      .should("be.visible")
      .contains("16 weeks from today");
    cy.get('[data-cy="exceptionalReasons-text-area-input"]').should(
      "not.exist"
    );
    cy.get('[data-cy="exceptionalReasonsDate-input"]').should("not.exist");
    cy.navNext(true);
    cy.get("#startDate-error").contains("Please provide a valid Start Date");
    const dateWithin16WeeksOfToday = dayjs()
      .startOf("day")
      .add(16, "weeks")
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    cy.clearAndType('[data-cy="startDate-input"]', dateWithin16WeeksOfToday);
    cy.get("#startDate-error").contains(
      "Change cannot begin less than 16 weeks from today"
    );
    const compliantStartDate = dayjs()
      .startOf("day")
      .add(16, "weeks")
      .format("YYYY-MM-DD");
    cy.clearAndType('[data-cy="startDate-input"]', compliantStartDate);
    cy.get("#startDate-error").should("not.exist");
    cy.navNext(true);

    // Part 5
    cy.get("h3").contains("Part 5 of 10 - Reason(s) for applying");
    cy.get('[data-cy="WarningCallout-ltftReasonsInstructions-label"]').contains(
      "Important"
    );
    cy.get(".nhsuk-card--warning .nhsuk-card__content > p").contains(
      ltftReasonsText1
    );
    cy.navNext(true);
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

    // Part 6
    cy.get("h3").contains("Part 6 of 10 - Supporting information");
    cy.navNext(true);
    cy.get("#supportingInformation-error").contains(
      "Supporting information is required"
    );
    cy.get('[data-cy="supportingInformation-text-area-input"]').type(
      "This is my supporting information"
    );
    cy.navNext(true);

    // Part 7
    cy.get("h3").contains("Part 7 of 10 - Pre-approver discussions");
    cy.get(
      '[data-cy="WarningCallout-ltftDiscussionInstructions-label"]'
    ).should("exist");
    cy.get(".nhsuk-card--warning .nhsuk-card__content > :nth-child(3)").should(
      "include.text",
      ltftDiscussionText2.slice(0, 100)
    );
    cy.get(
      ".nhsuk-card--warning .nhsuk-card__content > :nth-child(4)"
    ).contains("For information on Professional support contact");
    cy.get('[data-cy="tpdName-label"]').contains("Pre-approver name");
    cy.navNext(true);
    cy.get("#tpdName-error").contains("Pre-approver name is required");
    cy.get('[data-cy="tpdName-input"]').type("Dr. TPD");
    cy.get("#tpdName-error").should("not.exist");

    cy.get("#tpdEmail-error")
      .should("exist")
      .contains("Email address is required");
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get('[data-cy="error-txt-Email address is required"]').should("exist");
    cy.navNext(true);
    cy.get('[data-cy="navNext"]').should("have.class", "disabled-link");
    cy.get('[data-cy="tpdEmail-label"]').contains("Pre-approver email");
    cy.get('[data-cy="tpdEmail-input"]').type("tpd@e.mail");
    cy.navNext(true);

    // Part 8
    cy.get("h3").contains("Part 8 of 10 - Other discussions");
    cy.get('[data-cy="add-Other Discussions-button"]').should("exist").click();
    cy.clearAndType('[data-cy="name-input"]', "Mr AN Other");
    cy.clearAndType('[data-cy="email-input"]', "mr@an.other");
    cy.clickSelect('[data-cy="role"]');
    cy.navNext(true);

    // part 9
    cy.get("h3").contains("Part 9 of 10 - Skilled Worker visa status");
    cy.get(".nhsuk-card--warning .nhsuk-card__content > p").contains(
      ltftTier2VisaImportantText1
    );
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

describe("LtftForm - start date exceptions (No / exceptional path)", () => {
  const navigateToStartDatePage = () => {
    cy.clickSelect('[data-cy="pmId"]');
    cy.navNext();
    cy.clearAndType('[data-cy="wteBeforeChange-input"]', "100");
    cy.navNext();
    cy.clearAndType('[data-cy="wte-input"]', "80");
    cy.navNext();
    cy.get("h3").contains("Part 4 of 10 - Start date");
  };

  it("does not capture a start date (it is stamped at submission) and requires exceptional reasons plus a date when 16 weeks' notice cannot be given", () => {
    mountLtftWithMockData(mockLtftNewFormObj);
    navigateToStartDatePage();
    cy.get('[data-cy="canGiveCompliantStartDate-No-input"]').check();
    cy.get('[data-cy="startDate-input"]').should("not.exist"); //Note: stamped at submission
    cy.get('[data-cy="earliestStartDateInfo-info"]').should("not.exist");
    cy.get('[data-cy="startDateInfo-info"]')
      .should("be.visible")
      .contains("16 weeks from today");
    cy.get('[data-cy="exceptionalReasons-text-area-input"]').should(
      "be.visible"
    );
    cy.get('[data-cy="exceptionalReasonsDate-input"]').should("be.visible");
    cy.navNext(true);
    cy.get("#exceptionalReasons-error").contains(ltftExceptionalReasonsError);
    cy.get("#exceptionalReasonsDate-error").contains(
      "Please provide a valid date"
    );
    cy.get('[data-cy="exceptionalReasons-text-area-input"]').type(
      "My exceptional reason"
    );
    cy.get("#exceptionalReasons-error").should("not.exist");

    const yesterday = dayjs()
      .startOf("day")
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    cy.clearAndType('[data-cy="exceptionalReasonsDate-input"]', yesterday);
    cy.get("#exceptionalReasonsDate-error").contains(
      "The date cannot be before today"
    );
    const sixteenWeeks = dayjs()
      .startOf("day")
      .add(16, "weeks")
      .format("YYYY-MM-DD");
    cy.clearAndType('[data-cy="exceptionalReasonsDate-input"]', sixteenWeeks);
    cy.get("#exceptionalReasonsDate-error").contains(
      "The date must be less than 16 weeks from today"
    );

    const withinSixteenWeeks = dayjs()
      .startOf("day")
      .add(8, "weeks")
      .format("YYYY-MM-DD");
    cy.clearAndType(
      '[data-cy="exceptionalReasonsDate-input"]',
      withinSixteenWeeks
    );
    cy.get("#exceptionalReasonsDate-error").should("not.exist");
    cy.navNext();
    cy.get("h3").contains("Part 5 of 10 - Reason(s) for applying");
  });

  it("switches between the compliant and exceptional fields as the notice answer changes", () => {
    mountLtftWithMockData(mockLtftNewFormObj);
    navigateToStartDatePage();
    cy.get('[data-cy="canGiveCompliantStartDate-No-input"]').check();
    cy.get('[data-cy="exceptionalReasons-text-area-input"]').should(
      "be.visible"
    );
    cy.get('[data-cy="exceptionalReasonsDate-input"]').should("be.visible");
    cy.get('[data-cy="startDate-input"]').should("not.exist");
    cy.get('[data-cy="canGiveCompliantStartDate-Yes-input"]').check();
    cy.get('[data-cy="startDate-input"]')
      .should("be.visible")
      .and("not.have.attr", "readonly");
    cy.get('[data-cy="exceptionalReasons-text-area-input"]').should(
      "not.exist"
    );
    cy.get('[data-cy="exceptionalReasonsDate-input"]').should("not.exist");
  });

  it("clears the previous path's answers when the 'can give...' answer is changed, so stale data from the other path is not carried forward", () => {
    mountLtftWithMockData(mockLtftNewFormObj);
    navigateToStartDatePage();

    cy.get('[data-cy="canGiveCompliantStartDate-No-input"]').check();
    cy.get('[data-cy="exceptionalReasons-text-area-input"]').type(
      "My exceptional reason"
    );
    const withinSixteenWeeks = dayjs()
      .startOf("day")
      .add(8, "weeks")
      .format("YYYY-MM-DD");
    cy.clearAndType(
      '[data-cy="exceptionalReasonsDate-input"]',
      withinSixteenWeeks
    );

    // Switch to Yes
    cy.get('[data-cy="canGiveCompliantStartDate-Yes-input"]').check();
    const compliantStartDate = dayjs()
      .startOf("day")
      .add(16, "weeks")
      .format("YYYY-MM-DD");
    cy.clearAndType('[data-cy="startDate-input"]', compliantStartDate);

    // Back to No
    cy.get('[data-cy="canGiveCompliantStartDate-No-input"]').check();
    cy.get('[data-cy="exceptionalReasons-text-area-input"]').should(
      "have.value",
      ""
    );
    cy.get('[data-cy="exceptionalReasonsDate-input"]').should("have.value", "");

    cy.get('[data-cy="canGiveCompliantStartDate-Yes-input"]').check();
    cy.get('[data-cy="startDate-input"]').should("have.value", "");
  });
});

describe("LtftForm - legacy Start date page gate", () => {
  const legacyStartDate = dayjs().add(20, "week").format("YYYY-MM-DD");
  const legacyAltStartDate = dayjs().add(30, "week").format("YYYY-MM-DD");

  const mockLegacyUnsubmitted: LtftObjNew = {
    ...mockLtftUnsubmittedFormObj,
    canGiveCompliantStartDate: null,
    startDate: legacyStartDate,
    altStartDate: legacyAltStartDate,
    exceptionalReasons: null,
    exceptionalReasonsDate: null
  };

  const mountAtPageBeforeStartDate = (mockLtftObj: LtftObjNew) => {
    store.dispatch(updatedEditPageNumberLtft(2));
    mountLtftWithMockData(mockLtftObj);
    cy.get("h3").contains(
      "Part 3 of 10 - Proposed change to your working hours"
    );
  };

  it("warns instead of entering the Start date page when navigating forward into it", () => {
    mountAtPageBeforeStartDate(mockLegacyUnsubmitted);
    cy.navNext();

    cy.get('[data-cy="pageGateWarning"]').should("exist");
    cy.get('[data-cy="pageGateLabel"]').should(
      "contain.text",
      ltftLegacyStartDateGateLabel
    );
    cy.get('[data-cy="pageGateText"]').should(
      "contain.text",
      "your start date information will be reset"
    );
    cy.get('[data-cy="gateSkipHint"]').should(
      "contain.text",
      ltftLegacyStartDateGateSkipHint
    );
    cy.get('[data-cy="gateSkipBtn"]').should(
      "have.attr",
      "aria-describedby",
      "gateSkipHint"
    );
    cy.get("h3").contains(
      "Part 3 of 10 - Proposed change to your working hours"
    );
  });

  it("Proceed clears the legacy answers, opens the Start date page, and does not warn again", () => {
    mountAtPageBeforeStartDate(mockLegacyUnsubmitted);
    cy.navNext();
    cy.get('[data-cy="gateProceedBtn"]').click();

    cy.get('[data-cy="pageGateWarning"]').should("not.exist");
    cy.get("h3").contains("Part 4 of 10 - Start date");
    cy.get('[data-cy="canGiveCompliantStartDate-Yes-input"]').should(
      "not.be.checked"
    );
    cy.get('[data-cy="canGiveCompliantStartDate-No-input"]').should(
      "not.be.checked"
    );

    cy.get('[data-cy="navPrevious"]').click();
    cy.get("h3").contains(
      "Part 3 of 10 - Proposed change to your working hours"
    );
    cy.navNext();
    cy.get('[data-cy="pageGateWarning"]').should("not.exist");
    cy.get("h3").contains("Part 4 of 10 - Start date");
  });

  it("Skip steps over the Start date page and keeps the legacy answers, so the gate still fires on the way back", () => {
    mountAtPageBeforeStartDate(mockLegacyUnsubmitted);
    cy.navNext();
    cy.get('[data-cy="gateSkipBtn"]').click();

    cy.get('[data-cy="pageGateWarning"]').should("not.exist");
    cy.get("h3").contains("Part 5 of 10 - Reason(s) for applying");

    cy.get('[data-cy="navPrevious"]').click();
    cy.get('[data-cy="pageGateWarning"]').should("exist");
    cy.get("h3").contains("Part 5 of 10 - Reason(s) for applying");
  });

  it("Skip steps back over the Start date page when travelling backwards", () => {
    store.dispatch(updatedEditPageNumberLtft(4));
    mountLtftWithMockData(mockLegacyUnsubmitted);
    cy.get("h3").contains("Part 5 of 10 - Reason(s) for applying");

    cy.get('[data-cy="navPrevious"]').click();
    cy.get('[data-cy="pageGateWarning"]').should("exist");
    cy.get('[data-cy="gateSkipBtn"]').click();

    cy.get('[data-cy="pageGateWarning"]').should("not.exist");
    cy.get("h3").contains(
      "Part 3 of 10 - Proposed change to your working hours"
    );
  });

  it("the cancel option leaves the trainee where they are with nothing cleared", () => {
    mountAtPageBeforeStartDate(mockLegacyUnsubmitted);
    cy.navNext();
    cy.get('[data-cy="modal-cancel-btn"]')
      .should("contain.text", ltftLegacyStartDateGateCancelBtn)
      .click();

    cy.get('[data-cy="pageGateWarning"]').should("not.exist");
    cy.get("h3").contains(
      "Part 3 of 10 - Proposed change to your working hours"
    );

    cy.navNext();
    cy.get('[data-cy="pageGateWarning"]').should("exist");
  });

  it("does not gate a new form that simply has not reached the Start date page yet", () => {
    mountAtPageBeforeStartDate({
      ...mockLtftNewFormObj,
      pmId: mockLtftUnsubmittedFormObj.pmId,
      wteBeforeChange: 100,
      wte: 80
    });
    cy.navNext();

    cy.get('[data-cy="pageGateWarning"]').should("not.exist");
    cy.get("h3").contains("Part 4 of 10 - Start date");
  });
});
