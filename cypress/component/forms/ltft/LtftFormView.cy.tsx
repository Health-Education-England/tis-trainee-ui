import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Route, Router, Switch } from "react-router-dom";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import {
  updatedCanEditLtft,
  updatedEditPageNumberLtft,
  updatedLtft,
  updatedLtftStatus
} from "../../../../redux/slices/ltftSlice";
import { LtftFormView } from "../../../../components/forms/ltft/LtftFormView";
import { LtftForm } from "../../../../components/forms/ltft/LtftForm";
import {
  buildLtftCctSnapshot,
  makeValidProgrammeOptions
} from "../../../../utilities/ltftUtilities";
import { resetCctCalculations } from "../../../../redux/slices/cctSlice";
import { CctCalculation } from "../../../../models/CctTypes";
import { mockCctCalculation } from "../../../../mock-data/mock-cct-calculations";
import { mockCctSpecialties } from "../../../../mock-data/mock-cct-specialties";
import { updatedUserFeatures } from "../../../../redux/slices/userSlice";
import { LtftObjNew } from "../../../../models/LtftTypes";
import {
  mockLtftSubmittedFormObj,
  mockLtftUnsubmittedFormObj,
  pmEndDate,
  wte,
  wteBeforeChange,
  startDate,
  compliantStartDate,
  exceptionalRequestedDate,
  mockLtftDraftFirstSuccessSaveResponseDto
} from "../../../../mock-data/mock-ltft-data";
import dayjs from "dayjs";
import { FormsService } from "../../../../services/FormsService";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import {
  mockProgrammeMemberships,
  mockTraineeProfile,
  mockUserFeaturesLtftPilot
} from "../../../../mock-data/trainee-profile";

const mountLtftViewWithMockData = (mockLtftObj: LtftObjNew) => {
  store.dispatch(updatedLtft(mockLtftObj));
  store.dispatch(updatedTraineeProfileData(mockTraineeProfile));

  mount(
    <Provider store={store}>
      <Router history={history}>
        <LtftFormView />
      </Router>
    </Provider>
  );
};

// A (never-submitted) DRAFT
const draftStatus: LtftObjNew["status"] = {
  current: {
    state: "DRAFT",
    detail: { reason: null, message: null },
    modifiedBy: { name: null, email: null, role: "TRAINEE" },
    timestamp: "2026-01-14T15:45:49.952Z",
    revision: 0
  },
  history: []
};

const ddmmyyyy = (date: string | Date) => dayjs(date).format("DD/MM/YYYY");

describe("LTFT Form View - new flow: Yes path (>= 16 weeks' notice)", () => {
  const draftStartDate = dayjs().add(20, "week").format("YYYY-MM-DD");
  before(() => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData({
      ...mockLtftSubmittedFormObj,
      formRef: "",
      name: "",
      canGiveCompliantStartDate: true,
      startDate: draftStartDate,
      exceptionalReasons: null,
      exceptionalReasonsDate: null,
      declarations: {
        discussedWithTpd: true,
        informationIsCorrect: null,
        notGuaranteed: null
      },
      status: draftStatus
    });
  });
  it("renders the review page with the captured startDate and submits", () => {
    const baseResponse = {
      data: {
        ...mockLtftDraftFirstSuccessSaveResponseDto,
        change: {
          ...mockLtftDraftFirstSuccessSaveResponseDto.change,
          startDate: draftStartDate,
          cctDate: new Date()
        },
        exceptionalReasons: {
          ...mockLtftDraftFirstSuccessSaveResponseDto.exceptionalReasons,
          exceptional: false
        }
      }
    };
    const updateLtftStub = cy
      .stub(FormsService.prototype, "updateLtft")
      .resolves(baseResponse);

    const submitLtftStub = cy
      .stub(FormsService.prototype, "submitLtft")
      .resolves({
        data: {
          ...baseResponse.data,
          status: {
            ...mockLtftDraftFirstSuccessSaveResponseDto.status,
            current: {
              ...mockLtftDraftFirstSuccessSaveResponseDto.status.current,
              state: "SUBMITTED"
            }
          }
        }
      });

    cy.wrap(updateLtftStub).as("updateLtftStub");
    cy.wrap(submitLtftStub).as("submitLtftStub");
    cy.spy(store, "dispatch").as("storeDispatch");

    cy.get('[data-cy="backLink-to-back-to-ltft-home"]').should("exist");
    cy.get('[data-cy="savePdfBtn"]').should("not.be.disabled");
    cy.get('[data-cy="reviewSubmitHeading"]').should("exist");
    cy.get('[data-cy="pageHeader-Your Programme"]').should("exist");
    cy.get('[data-cy="edit-pmId"]').should("exist");
    cy.get('[data-cy="pageHeader-Working hours before change"]').should(
      "exist"
    );
    cy.get('[data-cy="wteBeforeChange-value"]').should(
      "include.text",
      wteBeforeChange.toString()
    );
    cy.get('[data-cy="edit-wteBeforeChange"]').should("exist");
    cy.get(
      '[data-cy="pageHeader-Proposed change to your working hours"]'
    ).should("exist");
    cy.get('[data-cy="wte-value"]').should("include.text", wte.toString());
    cy.get('[data-cy="edit-wte"]').should("exist");

    cy.get('[data-cy="pageHeader-Start date"]').should("exist");
    cy.get('[data-cy="startDate-value"]').should(
      "include.text",
      ddmmyyyy(draftStartDate)
    );
    cy.get('[data-cy="edit-startDate"]').should("exist");

    cy.get('[data-cy="pageHeader-Pre-approver discussions"]').should("exist");
    cy.get('[data-cy="tpdName-label"] > span').should("exist");
    cy.get('[data-cy="edit-tpdName"]').should("exist");
    cy.get('[data-cy="tpdEmail-label"] > span').should("exist");
    cy.get('[data-cy="edit-tpdEmail"]').should("exist");
    cy.get('[data-cy="pageHeader-Other discussions"]').should("exist");
    cy.get('[data-cy="array-panel-title"] > strong').should("exist");
    cy.get('[data-cy="edit-otherDiscussions-0"]').should("exist");
    cy.get('[data-cy="name-key"] > span').should("exist");
    cy.get('[data-cy="email-key"] > span').should("exist");
    cy.get('[data-cy="role-key"] > span').should("exist");
    cy.get('[data-cy="pageHeader-Reason(s) for applying"]').should("exist");
    cy.get('[data-cy="edit-reasonsSelected"]').should("exist");
    cy.get('[data-cy="pageHeader-Supporting information"]').should("exist");
    cy.get('[data-cy="edit-supportingInformation"]').should("exist");
    cy.get('[data-cy="pageHeader-Skilled Worker visa status"]').should("exist");
    cy.get('[data-cy="edit-skilledWorkerVisaHolder"]').should("exist");
    cy.get('[data-cy="pageHeader-Personal Details"]').should("exist");
    cy.get('[data-cy="edit-forenames"]').should("exist");
    cy.get('[data-cy="edit-surname"]').should("exist");
    cy.get('[data-cy="edit-telephoneNumber"]').should("exist");
    cy.get('[data-cy="edit-mobileNumber"]').should("exist");
    cy.get('[data-cy="edit-email"]').should("exist");
    cy.get('[data-cy="edit-gmcNumber"]').should("exist");
    cy.get('[data-cy="edit-gdcNumber"]').should("exist");
    cy.get('[data-cy="edit-publicHealthNumber"]').should("exist");

    // change summary box
    cy.get('[data-cy="completionDateChangeHeading"]').should("exist");
    cy.get('[data-cy="completionDateChangePmKey"]').should("exist");
    cy.get('[data-cy="completionDateChangePmValue"]').contains("Cardiology");

    cy.get('[data-cy="completionDateChangeWtesKey"]').should("exist");
    cy.get('[data-cy="completionDateChangeWtesValue"]').contains(
      `${wteBeforeChange}% → ${wte}%`
    );
    cy.get('[data-cy="completionDateChangeStartDateKey"]').should("exist");
    cy.get('[data-cy="completionDateChangeStartDateValue"]').should(
      "include.text",
      ddmmyyyy(draftStartDate)
    );
    cy.get(".field-warning-msg").should("not.exist");
    cy.get(
      '[data-cy="completionDateChangeCurrentCompletionDateValue"]'
    ).contains(`${ddmmyyyy(pmEndDate)} (Programme end date on TIS)`);

    // declarations + submit flow
    cy.get('[data-cy="BtnSaveDraft"]').should("not.be.disabled");
    cy.get('[data-cy="startOverButton"]').should("not.be.disabled");
    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="BtnSubmit').should("have.attr", "disabled");
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="name"]').type("my submitted ltft application");
    cy.get('[data-cy="BtnSubmit').should("not.have.attr", "disabled");
    cy.get('[data-cy="BtnSubmit').click();
    cy.get("@storeDispatch").should("have.been.calledWithMatch", {
      type: "ltft/updatedLtftSaveStatus",
      payload: "idle"
    });
    cy.get("@updateLtftStub").should("have.been.called");

    // action modal
    cy.get('[data-cy="warningLabel-Submit"]').should("exist");
    cy.get('[data-cy="warningText-Submit"]').should("exist");
    cy.get('[data-cy="additionalInfo"]').should("exist");
    cy.get('[data-cy="modal-cancel-btn"]').should("exist");
    cy.get('[data-cy="submitBtn-Submit"]').should("exist").click();
    cy.get("@submitLtftStub").should("have.been.called");
    cy.get("@submitLtftStub").should("have.been.calledWithMatch", {
      change: { startDate: draftStartDate }
    });
  });
});

describe("LTFT Form View - new flow: No path (exceptional)", () => {
  it("editable DRAFT before submission: shows the exceptional answers and the derived 16-week preview, with no stamped startDate yet", () => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    // Note: No path, still draft: startDate has not been stamped yet.
    mountLtftViewWithMockData({
      ...mockLtftSubmittedFormObj,
      canGiveCompliantStartDate: false,
      startDate: null,
      declarations: {
        discussedWithTpd: true,
        informationIsCorrect: null,
        notGuaranteed: null
      },
      status: draftStatus
    });

    // Note: Start date section: the 'can give...' answer and the exceptional short-notice answers are shown; startDate is NOT (it holds no value yet).
    cy.get('[data-cy="canGiveCompliantStartDate-value"]').should(
      "include.text",
      "No"
    );
    cy.get('[data-cy="exceptionalReasons-value"]').should(
      "include.text",
      "My exceptional reason"
    );
    cy.get('[data-cy="exceptionalReasonsDate-value"]').should(
      "include.text",
      ddmmyyyy(exceptionalRequestedDate)
    );
    cy.get('[data-cy="startDate-value"]').should("not.exist");

    // Note: Summary card previews the compliant date that will be stamped at submit.
    cy.get('[data-cy="completionDateChangeStartDateValue"]')
      .should("include.text", ddmmyyyy(compliantStartDate))
      .and("include.text", "will be set when you submit your application");
    cy.get(".field-warning-msg").should("not.exist");
  });

  it("submitted (read-only): shows the stamped compliant startDate and the requested short-notice date.", () => {
    store.dispatch(updatedLtftStatus("succeeded"));
    store.dispatch(updatedCanEditLtft(false));
    mountLtftViewWithMockData(mockLtftSubmittedFormObj);

    cy.get('[data-cy="backLink-to-back-to-ltft-home"]').should("exist");
    cy.get('[data-cy="savePdfBtn"]').should("not.be.disabled");
    cy.get('[data-cy="SUBMITTED-header"]').should("exist");
    cy.get('[data-cy="ltftName"]').contains("my submitted ltft application");

    // Note: The Start date section shows the stamped startDate (via showInViewWhenPopulated, since its input-form visibleIf hides it here)...
    cy.get('[data-cy="startDate-value"]').should(
      "include.text",
      ddmmyyyy(compliantStartDate)
    );
    cy.get('[data-cy="exceptionalReasonsDate-value"]').should(
      "include.text",
      ddmmyyyy(exceptionalRequestedDate)
    );
    // ...and the summary card repeats the compliant start date.
    cy.get('[data-cy="completionDateChangeStartDateKey"]').should("exist");
    cy.get('[data-cy="completionDateChangeStartDateValue"]').should(
      "include.text",
      ddmmyyyy(compliantStartDate)
    );
    cy.get(".field-warning-msg").should("not.exist");

    cy.get('[data-cy="edit-pmId"]').should("not.exist");
    cy.get('[data-cy="informationIsCorrect"]')
      .should("be.checked")
      .and("have.attr", "readonly");
    cy.get('[data-cy="notGuaranteed"]')
      .should("be.checked")
      .and("have.attr", "readonly");
    cy.get('[data-cy="BtnSaveDraft"]').should("not.exist");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
  });

  it("stamps the derived 16-week startDate onto the form when a No-path draft is submitted", () => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData({
      ...mockLtftSubmittedFormObj,
      formRef: "",
      name: "",
      canGiveCompliantStartDate: false,
      startDate: null,
      declarations: {
        discussedWithTpd: true,
        informationIsCorrect: null,
        notGuaranteed: null
      },
      status: draftStatus
    });

    const baseResponse = {
      data: {
        ...mockLtftDraftFirstSuccessSaveResponseDto,
        change: {
          ...mockLtftDraftFirstSuccessSaveResponseDto.change,
          startDate: null,
          cctDate: new Date()
        },
        exceptionalReasons: {
          ...mockLtftDraftFirstSuccessSaveResponseDto.exceptionalReasons,
          exceptional: true
        }
      }
    };
    const updateLtftStub = cy
      .stub(FormsService.prototype, "updateLtft")
      .resolves(baseResponse);
    const submitLtftStub = cy
      .stub(FormsService.prototype, "submitLtft")
      .resolves({
        data: {
          ...baseResponse.data,
          status: {
            ...mockLtftDraftFirstSuccessSaveResponseDto.status,
            current: {
              ...mockLtftDraftFirstSuccessSaveResponseDto.status.current,
              state: "SUBMITTED"
            }
          }
        }
      });
    cy.wrap(updateLtftStub).as("updateLtftStub");
    cy.wrap(submitLtftStub).as("submitLtftStub");

    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="name"]').type("my submitted ltft application");
    cy.get('[data-cy="BtnSubmit"]').click();
    // Note: pre-modal draft save persists the form as-is (startDate still null).
    cy.get("@updateLtftStub").should("have.been.called");

    // note: Modal confirm stamps the 16-week notice date as startDate.
    cy.get('[data-cy="submitBtn-Submit"]').should("exist").click();
    cy.get("@submitLtftStub").should("have.been.calledWithMatch", {
      change: { startDate: compliantStartDate }
    });
  });

  it("editable UNSUBMITTED with a stamped startDate: shows it read-only with no Change link", () => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    // Note: No path, previously stamped, now editable again after an unsubmit.
    mountLtftViewWithMockData(mockLtftUnsubmittedFormObj);

    cy.get('[data-cy="startDate-value"]').should(
      "include.text",
      ddmmyyyy(compliantStartDate)
    );
    // Note: no Change link for startDate on No path cos deadend (not inputted by user)
    cy.get('[data-cy="edit-startDate"]').should("not.exist");
    // Note: the boolean question the trainee CAN edit still has its link
    cy.get('[data-cy="edit-canGiveCompliantStartDate"]').should("exist");
  });

  it("editable UNSUBMITTED after the stamped startDate was cleared on edit: re-shows the derived 16-week preview", () => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData({
      ...mockLtftUnsubmittedFormObj,
      canGiveCompliantStartDate: false,
      startDate: null
    });

    // Note: No stamped date to show read-only...
    cy.get('[data-cy="startDate-value"]').should("not.exist");
    // ...and the summary card previews the compliant date that will be re-stamped on the next submit (via derivedStartDate).
    cy.get('[data-cy="completionDateChangeStartDateValue"]')
      .should("include.text", ddmmyyyy(compliantStartDate))
      .and("include.text", "will be set when you submit your application");
    cy.get(".field-warning-msg").should("not.exist");
    cy.get('[data-cy="edit-canGiveCompliantStartDate"]').should("exist");
  });
});

describe("LTFT Form View - new flow: 'can give...' answer", () => {
  it("SUBMITTED (read-only): shows the 'can give' answer and no legacy note", () => {
    store.dispatch(updatedLtftStatus("succeeded"));
    store.dispatch(updatedCanEditLtft(false));
    mountLtftViewWithMockData(mockLtftSubmittedFormObj);

    cy.get('[data-cy="canGiveCompliantStartDate-value"]').should("exist");
    cy.get('[data-cy="legacyStartDateNote"]').should("not.exist");
    cy.get('[data-cy="updateLegacyStartDate"]').should("not.exist");
  });

  it("UNSUBMITTED (editable): shows the 'can give' answer with an edit link, editable declarations and no legacy note", () => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData(mockLtftUnsubmittedFormObj);

    cy.get('[data-cy="UNSUBMITTED-header"]').should("exist");
    cy.get('[data-cy="ltftName"]').contains("my Unsubmitted LTFT");
    cy.get('[data-cy="pageHeader-Your Programme"]').should("exist");
    cy.get('[data-cy="edit-pmId"]').should("exist");

    cy.get('[data-cy="canGiveCompliantStartDate-value"]').should("exist");
    cy.get('[data-cy="edit-canGiveCompliantStartDate"]').should("exist");
    cy.get('[data-cy="legacyStartDateNote"]').should("not.exist");

    cy.get('[data-cy="informationIsCorrect"]')
      .should("not.be.checked")
      .and("not.have.attr", "readonly");
    cy.get('[data-cy="notGuaranteed"]')
      .should("not.be.checked")
      .and("not.have.attr", "readonly");
    cy.get('[data-cy="BtnSaveDraft"]').should("not.be.disabled");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
  });
});

// Note Legacy forms pre-date the "16 weeks' notice" question, so canGiveCompliantStartDate is null while startDate/altStartDate hold the old answers.
describe("LTFT Form View - legacy: retrospective 16-week warning", () => {
  const submissionDate = dayjs().subtract(1, "week").toISOString();
  const lateStartDate = dayjs(submissionDate).add(15, "week").toDate();
  const compliantLegacyStartDate = dayjs(submissionDate)
    .add(20, "week")
    .toDate();

  const mountWarningCase = (changeStartDate: Date) => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData({
      ...mockLtftUnsubmittedFormObj,
      canGiveCompliantStartDate: null,
      startDate: changeStartDate,
      status: {
        current: {
          ...mockLtftUnsubmittedFormObj.status.current,
          state: "UNSUBMITTED"
        },
        history: [
          {
            state: "SUBMITTED",
            detail: { reason: null, message: null },
            modifiedBy: { name: "Trainee", email: "", role: "TRAINEE" },
            timestamp: submissionDate,
            revision: 0
          }
        ]
      }
    });
  };

  it("warns for a legacy form whose start date is within 16 weeks of its submission", () => {
    mountWarningCase(lateStartDate);

    cy.get('[data-cy="completionDateChangeStartDateValue"]').should("exist");
    cy.get(".field-warning-msg")
      .should("exist")
      .and("contain.text", "This application was submitted within 16 weeks");
  });

  it("does NOT warn for a legacy form whose start date is at least 16 weeks after submission", () => {
    mountWarningCase(compliantLegacyStartDate);

    cy.get('[data-cy="completionDateChangeStartDateValue"]').should("exist");
    cy.get(".field-warning-msg").should("not.exist");
  });
});

describe("LTFT Form View - legacy: read-only display & Update migration", () => {
  const legacyAltStartDate = dayjs().add(30, "week").format("YYYY-MM-DD");
  const makeLegacy = (base: LtftObjNew): LtftObjNew => ({
    ...base,
    canGiveCompliantStartDate: null,
    startDate: startDate,
    altStartDate: legacyAltStartDate,
    exceptionalReasons: null,
    exceptionalReasonsDate: null
  });

  it("SUBMITTED (read-only): hides the 'can give' question, shows a read-only legacy note, displays dates read-only", () => {
    store.dispatch(updatedLtftStatus("succeeded"));
    store.dispatch(updatedCanEditLtft(false));
    mountLtftViewWithMockData(makeLegacy(mockLtftSubmittedFormObj));

    cy.get('[data-cy="pageHeader-Start date"]').should("exist");
    // Note: for legacy, test that the 'can give' question is hidden rather than shown as "Not provided"
    cy.get('[data-cy="canGiveCompliantStartDate-value"]').should("not.exist");
    cy.get('[data-cy="legacyStartDateNote"]')
      .should("exist")
      .and("contain.text", "previous start date process");
    cy.get('[data-cy="updateLegacyStartDate"]').should("not.exist");
    // Note: original submitted dates still display in the summary card
    cy.get('[data-cy="completionDateChangeStartDateValue"]').should(
      "include.text",
      ddmmyyyy(startDate)
    );
    cy.get('[data-cy="altStartDateValue"]').should(
      "include.text",
      ddmmyyyy(legacyAltStartDate)
    );
  });

  it("UNSUBMITTED (editable): hides the 'can give' question and its edit link, shows the Update action, no per-field edit links", () => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData(makeLegacy(mockLtftUnsubmittedFormObj));

    cy.get('[data-cy="canGiveCompliantStartDate-value"]').should("not.exist");
    cy.get('[data-cy="edit-canGiveCompliantStartDate"]').should("not.exist");
    cy.get('[data-cy="legacyStartDateNote"]').should("exist");
    cy.get('[data-cy="updateLegacyStartDate"]').should("exist");
    // Note: dates display read-only in the summary card (no per-field edit links)
    cy.get('[data-cy="completionDateChangeStartDateValue"]').should("exist");
    cy.get('[data-cy="altStartDateValue"]').should("exist");
    cy.get('[data-cy="edit-legacy-startDate"]').should("not.exist");
    cy.get('[data-cy="edit-legacy-altStartDate"]').should("not.exist");
  });

  // Note: Integration test across the route: LtftFormView -> ActionModal -> LtftForm
  const qualifyingProgrammes = ["7ab1aae3-83c2-4bb6-b1f3-99146e79b362"];
  const mountLegacyEditJourney = (mockLtftObj: LtftObjNew) => {
    store.dispatch(updatedLtft(mockLtftObj));
    store.dispatch(updatedTraineeProfileData(mockTraineeProfile));

    store.dispatch(updatedEditPageNumberLtft(0));
    store.dispatch(updatedUserFeatures(mockUserFeaturesLtftPilot));
    const pmOptions = makeValidProgrammeOptions(
      mockProgrammeMemberships,
      qualifyingProgrammes
    );
    history.push("/ltft/confirm");
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/ltft/confirm" render={() => <LtftFormView />} />
            <Route
              exact
              path="/ltft/create"
              render={() => <LtftForm pmOptions={pmOptions} />}
            />
          </Switch>
        </Router>
      </Provider>
    );
  };

  it("UNSUBMITTED: confirming the Update lands the trainee on the LtftForm Start date page with the section cleared, ready to re-answer from scratch", () => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLegacyEditJourney(makeLegacy(mockLtftUnsubmittedFormObj));

    cy.get('[data-cy="updateLegacyStartDate"]').click();
    cy.get('[data-cy="warningLabel-Start date process updated"]').should(
      "exist"
    );
    cy.get('[data-cy="submitBtn-Start date process updated"]').click();

    cy.get("h3").contains("Part 4 of 10 - Start date");

    cy.get('[data-cy="canGiveCompliantStartDate-Yes-input"]').should(
      "not.be.checked"
    );
    cy.get('[data-cy="canGiveCompliantStartDate-No-input"]').should(
      "not.be.checked"
    );
    cy.get('[data-cy="startDate-input"]').should("not.exist");
    cy.get('[data-cy="exceptionalReasons-text-area-input"]').should(
      "not.exist"
    );

    cy.get('[data-cy="canGiveCompliantStartDate-No-input"]').check();
    cy.get('[data-cy="exceptionalReasons-text-area-input"]')
      .should("have.value", "")
      .type("A fresh exceptional reason");
    const withinSixteenWeeks = dayjs()
      .startOf("day")
      .add(8, "weeks")
      .format("YYYY-MM-DD");
    cy.get('[data-cy="exceptionalReasonsDate-input"]').should("have.value", "");
    cy.clearAndType(
      '[data-cy="exceptionalReasonsDate-input"]',
      withinSixteenWeeks
    );
    cy.navNext();
    cy.get("h3").contains("Part 5 of 10 - Reason(s) for applying");
  });
});

describe("LTFT Form View - incomplete Start date section", () => {
  const makeSectionReset = (base: LtftObjNew): LtftObjNew => ({
    ...base,
    canGiveCompliantStartDate: null,
    startDate: null,
    altStartDate: null,
    exceptionalReasons: null,
    exceptionalReasonsDate: null
  });

  beforeEach(() => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
  });

  it("UNSUBMITTED: shows the incomplete notice, not the legacy one, and blocks re-submission", () => {
    mountLtftViewWithMockData(makeSectionReset(mockLtftUnsubmittedFormObj));

    cy.get('[data-cy="legacyStartDateNote"]').should("not.exist");
    cy.get('[data-cy="incompleteStartDateNote"]')
      .should("exist")
      .and("contain.text", "The start date section is incomplete");
    cy.get('[data-cy="completeStartDateSection"]').should("exist");

    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="name"]').clear();
    cy.get('[data-cy="name"]').type("my re-submitted ltft application");
    cy.get('[data-cy="BtnSubmit"]').should("have.attr", "disabled");
  });

  it("UNSUBMITTED: blocks re-submission when the Yes path was answered but no start date was given", () => {
    mountLtftViewWithMockData({
      ...makeSectionReset(mockLtftUnsubmittedFormObj),
      canGiveCompliantStartDate: true
    });

    cy.get('[data-cy="incompleteStartDateNote"]').should("exist");
    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="name"]').clear();
    cy.get('[data-cy="name"]').type("my re-submitted ltft application");
    cy.get('[data-cy="BtnSubmit"]').should("have.attr", "disabled");
  });

  it("UNSUBMITTED legacy: still allows re-submission of untouched pre-rework start date details", () => {
    mountLtftViewWithMockData({
      ...mockLtftUnsubmittedFormObj,
      canGiveCompliantStartDate: null,
      startDate: startDate,
      altStartDate: dayjs().add(30, "week").format("YYYY-MM-DD"),
      exceptionalReasons: null,
      exceptionalReasonsDate: null
    });

    cy.get('[data-cy="legacyStartDateNote"]').should("exist");
    cy.get('[data-cy="incompleteStartDateNote"]').should("not.exist");

    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="name"]').clear();
    cy.get('[data-cy="name"]').type("my re-submitted ltft application");
    cy.get('[data-cy="BtnSubmit"]').should("not.have.attr", "disabled");
  });

  it("SUBMITTED (read-only): shows neither notice and offers no submit action", () => {
    store.dispatch(updatedLtftStatus("succeeded"));
    store.dispatch(updatedCanEditLtft(false));
    mountLtftViewWithMockData(makeSectionReset(mockLtftSubmittedFormObj));

    cy.get('[data-cy="legacyStartDateNote"]').should("not.exist");
    cy.get('[data-cy="incompleteStartDateNote"]').should("not.exist");
    cy.get('[data-cy="BtnSubmit"]').should("not.exist");
  });
});

describe("LTFT Form View - CCT calculation snapshot", () => {
  const cctCalculationsUrl = "/api/trainee/cct/calculation";
  const cctSpecialtiesUrl = "/api/trainee/cct/specialties";

  const interceptCctList = (
    response: Parameters<typeof cy.intercept>[2] = { body: [] }
  ) => {
    cy.intercept("GET", cctSpecialtiesUrl, { body: mockCctSpecialties });
    cy.intercept("GET", cctCalculationsUrl, response).as("getCctCalculations");
  };

  const mountEditable = (
    cctSnapshot: LtftObjNew["cctSnapshot"],
    calculations: CctCalculation[] = []
  ) => {
    interceptCctList({ body: calculations });
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData({ ...mockLtftUnsubmittedFormObj, cctSnapshot });
  };

  const mountReadOnly = (cctSnapshot: LtftObjNew["cctSnapshot"]) => {
    interceptCctList();
    store.dispatch(updatedLtftStatus("succeeded"));
    store.dispatch(updatedCanEditLtft(false));
    mountLtftViewWithMockData({ ...mockLtftSubmittedFormObj, cctSnapshot });
  };

  const stubDraftSave = () => {
    const updateLtftStub = cy
      .stub(FormsService.prototype, "updateLtft")
      .resolves({ data: mockLtftDraftFirstSuccessSaveResponseDto });
    cy.wrap(updateLtftStub).as("updateLtftStub");
  };

  const waitForCctList = () =>
    cy
      .wrap(store)
      .invoke("getState")
      .its("cct.listStatus")
      .should("eq", "succeeded");

  // Note: newest first by index, so calc-0 is the most recently saved.
  const manyCalculations = (count: number): CctCalculation[] =>
    new Array<number>(count).fill(0).map((_, index) => {
      const savedOn = String(20 - index).padStart(2, "0");
      return mockCctCalculation({
        id: `calc-${index}`,
        name: `Calculation ${index}`,
        lastModified: `2026-10-${savedOn}T12:00:00Z`
      });
    });

  beforeEach(() => {
    store.dispatch(resetCctCalculations());
  });

  it("offers the calculator in a new tab when there are no saved calculations", () => {
    mountEditable(null, []);

    cy.get('[data-cy="cctSnapshotHeading"]').should(
      "contain.text",
      "CCT calculation"
    );
    cy.get('[data-cy="cctSnapshotIntro"]').should(
      "contain.text",
      "This is optional"
    );
    cy.get('[data-cy="cctSnapshotNoCalculations"]').should(
      "contain.text",
      "You have no saved CCT calculations"
    );
    cy.get('[data-cy="cctSnapshotCalculatorLink"]')
      .should("have.attr", "href", "/cct")
      .and("have.attr", "target", "_blank");
    cy.get('[data-cy="cctSnapshotOptions"]').should("not.exist");
    cy.get('[data-cy="cctSnapshotAttach"]').should("not.exist");
  });

  it("attaches the chosen calculation and carries it into the saved application", () => {
    const calculation = mockCctCalculation({
      id: "calc-1",
      name: "Dropping to 60%"
    });
    mountEditable(null, [calculation]);
    stubDraftSave();

    cy.get('[data-cy="cctSnapshotAttach"]').should("be.disabled");
    cy.get('[data-cy="cctSnapshotOption-calc-1"]')
      .should("not.be.checked")
      .check();
    cy.get('[data-cy="cctSnapshotAttach"]').should("not.be.disabled").click();

    cy.get('[data-cy="cctSnapshotOptions"]').should("not.exist");
    cy.get('[data-cy="cctSnapshotName"]').should(
      "contain.text",
      "Dropping to 60%"
    );
    cy.get('[data-cy="cctSnapshotCctDate"]').should(
      "contain.text",
      ddmmyyyy("2034-03-27")
    );
    cy.get('[data-cy="cctSnapshotLastSaved"]').should(
      "contain.text",
      ddmmyyyy(calculation.lastModified)
    );
    cy.get('[data-cy="cctSnapshotFixedNote"]').should(
      "contain.text",
      "This is a snapshot of your calculation"
    );
    cy.get('[data-cy="cctSnapshotSaveHint"]').should(
      "contain.text",
      "Save & exit"
    );

    cy.get('[data-cy="BtnSaveDraft"]').click();
    cy.get("@updateLtftStub").should("have.been.calledWithMatch", {
      cctSnapshot: {
        calculationId: "calc-1",
        calculation: { name: "Dropping to 60%" }
      }
    });
  });

  it("shows the attached calculation's details in the expander", () => {
    const calculation = mockCctCalculation({ id: "calc-1" });
    mountEditable(buildLtftCctSnapshot(calculation), [calculation]);

    cy.get('[data-cy="cctSnapshotExpanderSummary"]').click();
    cy.get('[data-cy="cctSnapshotResult"]').should(
      "contain.text",
      ddmmyyyy("2034-03-27")
    );
    cy.get('[data-cy="cctSnapshotNoChanges"]').should("not.exist");
    cy.get('[data-cy="cctSnapshotExpanderText"]').should(
      "contain.text",
      "Agreed with my TPD"
    );
  });

  it("swaps the attached copy when another calculation is chosen", () => {
    const attached = mockCctCalculation({
      id: "calc-1",
      name: "Dropping to 60%"
    });
    const other = mockCctCalculation({
      id: "calc-2",
      name: "Dropping to 80%",
      lastModified: "2026-10-29T12:00:00Z"
    });
    mountEditable(buildLtftCctSnapshot(attached), [attached, other]);
    stubDraftSave();

    cy.get('[data-cy="cctSnapshotName"]').should(
      "contain.text",
      "Dropping to 60%"
    );
    cy.get('[data-cy="cctSnapshotChange"]').click();

    cy.get('[data-cy="cctSnapshotIntro"]').should(
      "contain.text",
      "Choose the calculation you want to attach instead"
    );
    cy.get('[data-cy="cctSnapshotOption-calc-1"]').should("be.checked");
    cy.get('[data-cy="cctSnapshotOption-calc-2"]').check();
    cy.get('[data-cy="cctSnapshotAttach"]').click();

    cy.get('[data-cy="cctSnapshotName"]').should(
      "contain.text",
      "Dropping to 80%"
    );

    cy.get('[data-cy="BtnSaveDraft"]').click();
    cy.get("@updateLtftStub").should("have.been.calledWithMatch", {
      cctSnapshot: { calculationId: "calc-2" }
    });
  });

  it("abandons a Change and keeps the attached copy when Cancel is used", () => {
    const attached = mockCctCalculation({
      id: "calc-1",
      name: "Dropping to 60%"
    });
    const other = mockCctCalculation({ id: "calc-2", name: "Dropping to 80%" });
    mountEditable(buildLtftCctSnapshot(attached), [attached, other]);

    cy.get('[data-cy="cctSnapshotChange"]').click();
    cy.get('[data-cy="cctSnapshotOption-calc-2"]').check();
    cy.get('[data-cy="cctSnapshotCancel"]').click();

    cy.get('[data-cy="cctSnapshotName"]').should(
      "contain.text",
      "Dropping to 60%"
    );
  });

  it("sends a null snapshot once the attached copy is removed", () => {
    const calculation = mockCctCalculation({ id: "calc-1" });
    mountEditable(buildLtftCctSnapshot(calculation), [calculation]);
    stubDraftSave();

    waitForCctList();
    cy.get('[data-cy="cctSnapshotRemove"]').click();
    cy.get('[data-cy="cctSnapshotSummary"]').should("not.exist");
    cy.get('[data-cy="cctSnapshotOptions"]').should("exist");

    cy.get('[data-cy="BtnSaveDraft"]').click();
    cy.get("@updateLtftStub").should("have.been.calledWithMatch", {
      cctSnapshot: null
    });
  });

  it("sends the attached copy to the backend when the application is submitted", () => {
    const calculation = mockCctCalculation({ id: "calc-1" });
    const snapshot = buildLtftCctSnapshot(calculation);
    mountEditable(snapshot, [calculation]);

    // Note: the draft-save response replaces the store form, so it must echo the snapshot back.
    const savedDto = {
      ...mockLtftDraftFirstSuccessSaveResponseDto,
      cctSnapshot: snapshot
    };
    const updateLtftStub = cy
      .stub(FormsService.prototype, "updateLtft")
      .resolves({ data: savedDto });
    const submitLtftStub = cy
      .stub(FormsService.prototype, "submitLtft")
      .resolves({
        data: {
          ...savedDto,
          status: {
            ...savedDto.status,
            current: { ...savedDto.status.current, state: "SUBMITTED" }
          }
        }
      });
    cy.wrap(updateLtftStub).as("updateLtftStub");
    cy.wrap(submitLtftStub).as("submitLtftStub");

    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="name"]').clear();
    cy.get('[data-cy="name"]').type("my re-submitted ltft application");
    cy.get('[data-cy="BtnSubmit"]').click();
    cy.get("@updateLtftStub").should("have.been.called");

    cy.get('[data-cy="submitBtn-Submit"]').click();
    cy.get("@submitLtftStub").should("have.been.calledWithMatch", {
      cctSnapshot: {
        calculationId: "calc-1",
        calculation: { lastModified: calculation.lastModified }
      }
    });
  });

  it("keeps the attached copy, and says so, when the saved calculation has been deleted", () => {
    const attached = mockCctCalculation({ id: "calc-1" });
    mountEditable(buildLtftCctSnapshot(attached), [
      mockCctCalculation({ id: "calc-2" })
    ]);

    cy.get('[data-cy="cctSnapshotDeletedNote"]')
      .should("contain.text", "no longer in your saved CCT calculations")
      .and("have.class", "nhsuk-inset-text");
    cy.get('[data-cy="cctSnapshotSummary"]').should("exist");
    cy.get('[data-cy="cctSnapshotChangedNote"]').should("not.exist");
  });

  it("warns when the saved calculation has changed since it was attached, and offers the latest", () => {
    const attached = mockCctCalculation({
      id: "calc-1",
      lastModified: "2026-10-28T12:00:00Z"
    });
    const edited = mockCctCalculation({
      id: "calc-1",
      lastModified: "2026-10-30T08:15:00Z",
      result: { ...attached.result, cctDate: "2035-06-01" }
    });
    mountEditable(buildLtftCctSnapshot(attached), [edited]);

    cy.get('[data-cy="cctSnapshotChangedNote"]').should(
      "contain.text",
      "since you attached it"
    );
    cy.get('[data-cy="cctSnapshotDeletedNote"]').should("not.exist");
    // Note: the attached copy still shows its own completion date, not the edited one.
    cy.get('[data-cy="cctSnapshotCctDate"]').should(
      "contain.text",
      ddmmyyyy("2034-03-27")
    );

    cy.get('[data-cy="cctSnapshotAttachLatest"]').click();
    cy.get('[data-cy="cctSnapshotChangedNote"]').should("not.exist");
    cy.get('[data-cy="cctSnapshotCctDate"]').should(
      "contain.text",
      ddmmyyyy("2035-06-01")
    );
  });

  it("does not block submission when the saved calculations cannot be loaded", () => {
    interceptCctList({ statusCode: 500, body: {} });
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData({
      ...mockLtftUnsubmittedFormObj,
      cctSnapshot: null
    });

    cy.get('[data-cy="cct-request-error"]').should(
      "contain.text",
      "We could not load your saved CCT calculations"
    );
    cy.get('[data-cy="cct-request-retry"]').should("exist");
    cy.get('[data-cy="cctSnapshotOptions"]').should("not.exist");

    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="name"]').clear();
    cy.get('[data-cy="name"]').type("my re-submitted ltft application");
    cy.get('[data-cy="BtnSubmit"]').should("not.have.attr", "disabled");
  });

  it("reloads the saved calculations when the failed list is retried", () => {
    interceptCctList({ statusCode: 500, body: {} });
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData({
      ...mockLtftUnsubmittedFormObj,
      cctSnapshot: null
    });

    cy.get('[data-cy="cct-request-error"]').should("exist");
    interceptCctList({ body: [mockCctCalculation({ id: "calc-1" })] });
    cy.get('[data-cy="cct-request-retry"]').click();

    cy.get('[data-cy="cct-request-error"]').should("not.exist");
    cy.get('[data-cy="cctSnapshotOption-calc-1"]').should("exist");
  });

  describe("read-only (submitted application)", () => {
    it("shows the attached copy with no attach controls and makes no request", () => {
      const calculation = mockCctCalculation({ id: "calc-1" });
      mountReadOnly(buildLtftCctSnapshot(calculation));

      cy.get('[data-cy="cctSnapshotSummary"]').should("exist");
      cy.get('[data-cy="cctSnapshotExpander"]').should("exist");
      cy.get('[data-cy="cctSnapshotChange"]').should("not.exist");
      cy.get('[data-cy="cctSnapshotRemove"]').should("not.exist");
      cy.get('[data-cy="cctSnapshotSaveHint"]').should("not.exist");
      cy.get('[data-cy="cctSnapshotDeletedNote"]').should("not.exist");
      cy.get("@getCctCalculations.all").should("have.length", 0);
    });

    it("says no calculation was attached when the application has none", () => {
      mountReadOnly(null);

      cy.get('[data-cy="cctSnapshotNotAttached"]').should(
        "contain.text",
        "No calculation attached"
      );
      cy.get('[data-cy="cctSnapshotOptions"]').should("not.exist");
    });
  });

  describe("the picker with many saved calculations", () => {
    it("lists them all without a toggle at five calculations", () => {
      mountEditable(null, manyCalculations(5));

      cy.get('[data-cy^="cctSnapshotOption-"]').should("have.length", 5);
      cy.get('[data-cy="cctSnapshotShowAllCalculations"]').should("not.exist");
    });

    it("shows the five most recent, newest first, behind a toggle", () => {
      mountEditable(null, manyCalculations(6));

      cy.get('[data-cy^="cctSnapshotOption-"]').should("have.length", 5);
      cy.get('[data-cy="cctSnapshotOption-calc-5"]').should("not.exist");
      cy.get('[data-cy="cctSnapshotOptions"]')
        .find(".nhsuk-radios__label")
        .first()
        .should("contain.text", "Calculation 0");

      cy.get('[data-cy="cctSnapshotShowAllCalculations"]')
        .should("contain.text", "Show all 6 calculations")
        .and("have.attr", "aria-expanded", "false")
        .click();

      cy.get('[data-cy^="cctSnapshotOption-"]').should("have.length", 6);
      cy.get('[data-cy="cctSnapshotShowAllCalculations"]')
        .should("contain.text", "Show fewer calculations")
        .and("have.attr", "aria-expanded", "true")
        .click();

      cy.get('[data-cy^="cctSnapshotOption-"]').should("have.length", 5);
    });

    it("keeps an older attached calculation visible while the list is collapsed", () => {
      mountEditable(null, manyCalculations(7));

      cy.get('[data-cy="cctSnapshotShowAllCalculations"]').click();
      cy.get('[data-cy="cctSnapshotOption-calc-6"]').check();
      cy.get('[data-cy="cctSnapshotAttach"]').click();
      cy.get('[data-cy="cctSnapshotName"]').should(
        "contain.text",
        "Calculation 6"
      );

      cy.get('[data-cy="cctSnapshotChange"]').click();

      // Note: the picker reopens collapsed, so the selected one is kept on top of the five most recent.
      cy.get('[data-cy="cctSnapshotShowAllCalculations"]').should(
        "have.attr",
        "aria-expanded",
        "false"
      );
      cy.get('[data-cy^="cctSnapshotOption-"]').should("have.length", 6);
      cy.get('[data-cy="cctSnapshotOption-calc-5"]').should("not.exist");
      cy.get('[data-cy="cctSnapshotOption-calc-6"]').should("be.checked");
      cy.get('[data-cy="cctSnapshotAttach"]').should("not.be.disabled");
    });
  });

  describe("removing the attached copy", () => {
    it("removes without confirming while the saved calculation still exists", () => {
      const calculation = mockCctCalculation({ id: "calc-1" });
      mountEditable(buildLtftCctSnapshot(calculation), [calculation]);

      waitForCctList();
      cy.get('[data-cy="cctSnapshotRemove"]').click();

      cy.get('[data-cy="warningText-Remove"]').should("not.exist");
      cy.get('[data-cy="cctSnapshotSummary"]').should("not.exist");
    });

    it("confirms, warning it is the only copy, when the saved calculation has been deleted", () => {
      const attached = mockCctCalculation({ id: "calc-1", name: "My plan" });
      mountEditable(buildLtftCctSnapshot(attached), [
        mockCctCalculation({ id: "calc-2" })
      ]);

      waitForCctList();
      cy.get('[data-cy="cctSnapshotRemove"]').click();

      cy.get('[data-cy="warningText-Remove"]')
        .should("contain.text", "'My plan' is no longer in your saved CCT")
        .and("contain.text", "You cannot undo this");
      cy.get('[data-cy="cctSnapshotSummary"]').should("exist");

      cy.get('[data-cy="submitBtn-Remove"]').click();
      cy.get('[data-cy="cctSnapshotSummary"]').should("not.exist");
    });

    it("confirms, saying it could not check, when the saved calculations failed to load", () => {
      const attached = mockCctCalculation({ id: "calc-1", name: "My plan" });
      interceptCctList({ statusCode: 500, body: {} });
      store.dispatch(updatedLtftStatus("idle"));
      store.dispatch(updatedCanEditLtft(true));
      mountLtftViewWithMockData({
        ...mockLtftUnsubmittedFormObj,
        cctSnapshot: buildLtftCctSnapshot(attached)
      });

      cy.get('[data-cy="cctSnapshotRemove"]').click();

      cy.get('[data-cy="warningText-Remove"]')
        .should("contain.text", "We could not check your saved CCT")
        .and("contain.text", "you will not be able to get it back");
      cy.get('[data-cy="cctSnapshotDeletedNote"]').should("not.exist");
    });

    it("puts focus back on Remove when the confirmation is cancelled", () => {
      const attached = mockCctCalculation({ id: "calc-1" });
      mountEditable(buildLtftCctSnapshot(attached), [
        mockCctCalculation({ id: "calc-2" })
      ]);

      cy.get('[data-cy="cctSnapshotRemove"]').click();
      cy.get('[data-cy="warningText-Remove"]')
        .closest("dialog")
        .find('[data-cy="modal-cancel-btn"]')
        .click();

      cy.get('[data-cy="warningText-Remove"]').should("not.exist");
      cy.get('[data-cy="cctSnapshotSummary"]').should("exist");
      cy.focused().should("have.attr", "data-cy", "cctSnapshotRemove");
    });
  });
});
