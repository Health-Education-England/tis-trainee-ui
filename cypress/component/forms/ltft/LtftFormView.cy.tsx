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
import { makeValidProgrammeOptions } from "../../../../utilities/ltftUtilities";
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
    cy.get('[data-cy="BtnSubmit').click();
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
