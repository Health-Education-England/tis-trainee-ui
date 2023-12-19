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
import { mockProgrammeMembershipCojNotSigned } from "../../../../mock-data/trainee-profile";
import { mockFormList } from "../../../../mock-data/formr-list";
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

type FormType = "A" | "B";

describe("Action Summary", () => {
  const selectors = [
    "actionSummaryHeading",
    "outstandingHeading",
    "formRSubsHeading",
    "inProgressHeading",
    "otherChecksHeading"
  ];

  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ActionSummary />
        </Router>
      </Provider>
    );
  });

  selectors.forEach(selector => {
    it(`should display the ${selector}`, () => {
      cy.get(`[data-cy=${selector}]`).should("exist");
    });
  });

  it("should not display the number of CoJ's to sign when there are no CoJ's to sign", () => {
    store.dispatch(updatedFormAStatus("success"));
    store.dispatch(updatedUnsignedCojs([]));
    cy.get("[data-cy=unsignedCoJ]").should("not.exist");
    cy.get("[data-cy=allCoJSigned]")
      .should("exist")
      .should("contain", "signed");
  });
  it("should display the number of CoJ's to sign when there are CoJ's to sign", () => {
    store.dispatch(updatedFormAStatus("success"));
    store.dispatch(updatedUnsignedCojs([mockProgrammeMembershipCojNotSigned]));
    cy.get("[data-cy=unsignedCoJ]")
      .should("exist")
      .should("contain", "You have 1 unsigned");
  });

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

  const testFormSubmissionMoreThanYear = (
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
      cy.get(`[data-cy=infoLatestSubFormRMoreThanYear-${formType}]`)
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

  testFormSubmissionMoreThanYear("A", formListMoreThanYear, "more than");
  testFormSubmissionMoreThanYear("A", formListYearAgoExactly, "exactly");
  testFormSubmissionMoreThanYear("B", formListMoreThanYear, "more than");
  testFormSubmissionMoreThanYear("B", formListYearAgoExactly, "exactly");

  it("should display the loading spinner when data is loading", () => {
    store.dispatch(updatedFormAStatus("loading"));
    cy.get("[data-cy=loading]").should("exist");
  });
});
