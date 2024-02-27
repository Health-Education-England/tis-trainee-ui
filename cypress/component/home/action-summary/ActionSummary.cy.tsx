import day from "dayjs";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import ActionSummary from "../../../../components/home/actionSummary/ActionSummary";
import history from "../../../../components/navigation/history";
import {
  updatedFormAList,
  updatedFormAStatus
} from "../../../../redux/slices/formASlice";
import { updatedUnsignedCojs } from "../../../../redux/slices/traineeProfileSlice";
import {
  mockOutstandingActions,
  mockProgrammeMembershipCojNotSigned
} from "../../../../mock-data/trainee-profile";
import { mockFormList, mockForms } from "../../../../mock-data/formr-list";
import {
  dateMoreThanYearAgo,
  dateWithinYear,
  todayDate
} from "../../../../utilities/DateUtilities";
import {
  updatedFormBList,
  updatedFormBStatus
} from "../../../../redux/slices/formBSlice";
import { IFormR } from "../../../../models/IFormR";
import { ProgrammeMembership } from "../../../../models/ProgrammeMembership";
import { TraineeAction } from "../../../../models/TraineeAction";
import { updatedActionsData } from "../../../../redux/slices/traineeActionsSlice";

type FormType = "A" | "B";

const ActionSummaryComponent = (
  <Provider store={store}>
    <Router history={history}>
      <ActionSummary />
    </Router>
  </Provider>
);

describe("Action Summary - loading", () => {
  beforeEach(() => {
    mount(ActionSummaryComponent);
  });
  afterEach(() => {
    store.dispatch(updatedFormAStatus("success"));
  });

  it("should display the loading spinner when data is loading", () => {
    store.dispatch(updatedFormAStatus("loading"));
    cy.get("[data-cy=loading]").should("exist");
  });
});

describe("Action Summary", () => {
  const selectors = [
    "actionSummaryHeading",
    "outstandingHeading",
    "formRSubsHeading",
    "inProgressHeading",
    "otherChecksHeading"
  ];

  beforeEach(() => {
    mount(ActionSummaryComponent);
  });

  selectors.forEach(selector => {
    it(`should display the ${selector}`, () => {
      cy.get(`[data-cy=${selector}]`).should("exist");
    });
  });

  const testCojSign = (
    cojToSign: ProgrammeMembership[],
    shouldExist: boolean,
    message: string,
    message2?: string
  ) => {
    it(`should display the ${
      shouldExist ? "'CoJ to sign'" : "'all CoJ signed'"
    } message when there are ${shouldExist ? "" : "no"} CoJ to sign`, () => {
      store.dispatch(updatedFormAStatus("success"));
      store.dispatch(updatedUnsignedCojs(cojToSign));
      cy.get("[data-cy=unsignedCoJ]").should(
        shouldExist ? "exist" : "not.exist"
      );
      if (shouldExist) {
        cy.get("[data-cy=unsignedCoJ]")
          .should("contain", message)
          .should("contain", message2);
      } else {
        cy.get("[data-cy=allCoJSigned]")
          .should("exist")
          .should("contain", message);
      }
    });
  };
  testCojSign([], false, "signed");
  testCojSign(
    [mockProgrammeMembershipCojNotSigned[0]],
    true,
    "1 unsigned",
    "Agreement"
  );
  testCojSign(
    mockProgrammeMembershipCojNotSigned,
    true,
    "You have 2 unsigned",
    "Agreements"
  );

  const testProgrammeAction = (
    unreviewedActions: TraineeAction[],
    shouldExist: boolean,
    message: string
  ) => {
    it(`should display the ${
      shouldExist ? "'CoJ to sign'" : "'all CoJ signed'"
    } message when there are ${
      shouldExist ? "" : "no"
    } Programme Memberships to review`, () => {
      store.dispatch(updatedActionsData(unreviewedActions));
      cy.get("[data-cy=incompleteAction]").should(
        shouldExist ? "exist" : "not.exist"
      );
      if (shouldExist) {
        cy.get("[data-cy=incompleteAction]").should("contain", message);
      }
    });
  };
  testProgrammeAction([], false, "signed");
  testProgrammeAction([mockOutstandingActions[0]], false, "");
  testProgrammeAction(
    mockOutstandingActions,
    true,
    "You have 2 Programme Memberships to review"
  );

  const testPlacementAction = (
    unreviewedActions: TraineeAction[],
    shouldExist: boolean,
    message: string
  ) => {
    it(`should display the ${
      shouldExist ? "'Placement to review'" : "'no Placements to review'"
    } message when there are ${
      shouldExist ? "" : "no"
    } Placements to review`, () => {
      store.dispatch(updatedActionsData(unreviewedActions));
      cy.get("[data-cy=incompleteAction]").should(
        shouldExist ? "exist" : "not.exist"
      );
      if (shouldExist) {
        cy.get("[data-cy=incompleteAction]").should("contain", message);
      }
    });
  };
  testPlacementAction([], false, "signed");
  testPlacementAction([mockOutstandingActions[3]], false, "");
  testPlacementAction(
    mockOutstandingActions,
    true,
    "You have 2 Placements to review"
  );

  const testFormNoSubmissions = (formType: FormType) => {
    it(`should display the 'yet to submit' message when there are no submitted ${formType}`, () => {
      formType === "A"
        ? store.dispatch(updatedFormAStatus("success"))
        : store.dispatch(updatedFormBStatus("success"));
      cy.get(`[data-cy=infoNoFormEver-${formType}]`)
        .should("exist")
        .should("contain", "yet to submit");
    });
  };
  testFormNoSubmissions("A");
  testFormNoSubmissions("B");

  const testFormSubmissionWithinYear = (
    formType: FormType,
    formList: IFormR[],
    message: string
  ) => {
    it(`should display the 'submitted within the last year' message when the latest submitted Form ${formType} is ${message}`, () => {
      formType === "A"
        ? store.dispatch(updatedFormAStatus("success"))
        : store.dispatch(updatedFormBStatus("success"));
      store.dispatch(
        formType === "A"
          ? updatedFormAList(formList)
          : updatedFormBList(formList)
      );
      cy.get(`[data-cy=infoLatestSubFormRWithinYear-${formType}]`)
        .should("exist")
        .should("contain", "submitted within the last year");
    });
  };

  const formListWithinYear = [
    { ...mockFormList[1] },
    {
      ...mockFormList[1],
      submissionDate: day(dateWithinYear).add(1, "day").toISOString()
    }
  ];
  const formListToday = [
    {
      ...mockFormList[0]
    },
    {
      ...mockFormList[0],
      submissionDate: day(todayDate).subtract(1, "day").toISOString()
    }
  ];
  testFormSubmissionWithinYear("A", formListWithinYear, "within a year ago");
  testFormSubmissionWithinYear("A", formListToday, "today");
  testFormSubmissionWithinYear("B", formListWithinYear, "within a year ago");
  testFormSubmissionWithinYear("B", formListToday, "today");

  const testFormSubmissionYearPlus = (
    formType: FormType,
    formList: IFormR[],
    message: string
  ) => {
    it(`should display the 'a year at least' message when the latest submitted Form ${formType} is ${message} a year ago`, () => {
      formType === "A"
        ? store.dispatch(updatedFormAStatus("success"))
        : store.dispatch(updatedFormBStatus("success"));
      store.dispatch(
        formType === "A"
          ? updatedFormAList(formList)
          : updatedFormBList(formList)
      );
      cy.get(`[data-cy=infoLatestSubFormRYearPlus-${formType}]`)
        .should("exist")
        .should("contain", "It is a year at least since you submitted");
    });
  };
  const formListMoreThanYear = [
    { ...mockFormList[3] },
    {
      ...mockFormList[3],
      submissionDate: day(dateMoreThanYearAgo).subtract(1, "day").toISOString()
    }
  ];
  const formListYearAgoExactly = [{ ...mockFormList[2] }];

  testFormSubmissionYearPlus("A", formListMoreThanYear, "more than");
  testFormSubmissionYearPlus("A", formListYearAgoExactly, "exactly");
  testFormSubmissionYearPlus("B", formListMoreThanYear, "more than");
  testFormSubmissionYearPlus("B", formListYearAgoExactly, "exactly");

  type ConditionsType = {
    [key: string]: { cyCommand: string; text: string };
  };

  function testInProgressMessage(
    formType: FormType,
    formList: IFormR[],
    message: string
  ) {
    const conditions: ConditionsType = {
      "no previous": {
        cyCommand: `[data-cy=infoNoFormEver-${formType}]`,
        text: "yet to submit"
      },
      "within a year": {
        cyCommand: `[data-cy=infoLatestSubFormRWithinYear-${formType}]`,
        text: "submitted within the last year"
      },
      "year at least": {
        cyCommand: `[data-cy=infoLatestSubFormRYearPlus-${formType}]`,
        text: "It is a year at least since you submitted"
      }
    };

    it(`should display the 'in progress' message when there is a saved draft ${formType} and ${message}`, () => {
      formType === "A"
        ? store.dispatch(updatedFormAStatus("success"))
        : store.dispatch(updatedFormBStatus("success"));
      store.dispatch(
        formType === "A"
          ? updatedFormAList(formList)
          : updatedFormBList(formList)
      );
      cy.get(`[data-cy=inProgress-${formType}]`)
        .should("exist")
        .should("contain", "You have a saved draft");

      for (let condition in conditions) {
        if (message.includes(condition)) {
          cy.get(conditions[condition].cyCommand)
            .should("exist")
            .should("contain", conditions[condition].text);
        }
      }
    });
  }

  testInProgressMessage("A", [mockForms[3]], "no previous submitted Form A");
  testInProgressMessage("B", [mockForms[3]], "no previous submitted Form B");
  testInProgressMessage(
    "A",
    [...formListWithinYear, mockForms[3]],
    "a previous submitted Form A within a year"
  );
  testInProgressMessage(
    "B",
    [...formListWithinYear, mockForms[3]],
    "a previous submitted Form B within a year"
  );
  testInProgressMessage(
    "A",
    [...formListMoreThanYear, mockForms[3]],
    "it is a year at least since the last submitted Form A"
  );
  testInProgressMessage(
    "B",
    [...formListMoreThanYear, mockForms[3]],
    "it is a year at least since the last submitted Form B"
  );
});
