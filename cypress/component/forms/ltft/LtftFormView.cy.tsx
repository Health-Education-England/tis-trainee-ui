import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import {
  updatedCanEditLtft,
  updatedLtft,
  updatedLtftStatus
} from "../../../../redux/slices/ltftSlice";
import { LtftFormView } from "../../../../components/forms/ltft/LtftFormView";
import { LtftObjNew } from "../../../../models/LtftTypes";
import {
  mockLtftSubmittedFormObj,
  mockLtftUnsubmittedFormObj,
  pmEndDate,
  wte,
  wteBeforeChange,
  startDate,
  cctDate,
  mockLtftDraftFirstSuccessSaveResponseDto
} from "../../../../mock-data/mock-ltft-data";
import dayjs from "dayjs";
import { FormsService } from "../../../../services/FormsService";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import { mockTraineeProfile } from "../../../../mock-data/trainee-profile";

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

describe("LTFT Form View - editable (DRAFT)", () => {
  before(() => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData({
      ...mockLtftSubmittedFormObj,
      formRef: "",
      name: "",
      declarations: {
        discussedWithTpd: true,
        informationIsCorrect: null,
        notGuaranteed: null
      },
      status: {
        current: {
          state: "DRAFT",
          detail: {
            reason: null,
            message: null
          },
          modifiedBy: {
            name: null,
            email: null,
            role: "TRAINEE"
          },
          timestamp: "2026-01-14T15:45:49.952Z",
          revision: 0
        },
        history: []
      }
    });
  });
  it("should render LTFT form in edit mode", () => {
    const baseResponse = {
      data: {
        ...mockLtftDraftFirstSuccessSaveResponseDto,
        change: {
          ...mockLtftDraftFirstSuccessSaveResponseDto.change,
          cctDate: new Date()
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
      dayjs(startDate).format("DD/MM/YYYY")
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
    cy.get('[data-cy="pageHeader-Tier 2 / Skilled Worker status"]').should(
      "exist"
    );
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

    // change box
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
      dayjs(startDate).format("DD/MM/YYYY")
    );
    cy.get(".field-warning-msg").should("exist");
    cy.get(
      '[data-cy="completionDateChangeCurrentCompletionDateValue"]'
    ).contains(
      `${dayjs(pmEndDate).format("DD/MM/YYYY")} (Programme end date on TIS)`
    );
    cy.get(
      '[data-cy="completionDateChangeEstimatedCompletionDateValue"] > strong'
    ).contains(dayjs(cctDate).format("DD/MM/YYYY"));

    // declarations
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
    cy.get('[data-cy="warningLabel-Submit"] > span').should("exist");
    cy.get('[data-cy="warningText-Submit"]').should("exist");
    cy.get('[data-cy="additionalInfo"]').should("exist");
    cy.get('[data-cy="modal-cancel-btn"]').should("exist");
    cy.get('[data-cy="submitBtn-Submit"]').should("exist").click();
    cy.get("@submitLtftStub").should("have.been.called");
  });
});

describe("LTFT Form View - not editable (SUBMITTED)", () => {
  before(() => {
    store.dispatch(updatedLtftStatus("succeeded"));
    store.dispatch(updatedCanEditLtft(false));
    mountLtftViewWithMockData(mockLtftSubmittedFormObj);
  });
  it("should render submitted LTFT form in read-only mode", () => {
    cy.get('[data-cy="backLink-to-back-to-ltft-home"]').should("exist");
    cy.get('[data-cy="savePdfBtn"]').should("not.be.disabled");
    cy.get('[data-cy="SUBMITTED-header"]').should("exist");
    cy.get('[data-cy="ltftName"]').contains("my submitted ltft application");
    cy.get('[data-cy="pageHeader-Your Programme"]').should("exist");
    cy.get('[data-cy="edit-pmId"]').should("not.exist");
    cy.get('[data-cy="completionDateChangeStartDateKey"]').should("exist");
    cy.get(".field-warning-msg").should("exist");
    cy.get('[data-cy="informationIsCorrect"]')
      .should("be.checked")
      .and("have.attr", "readonly");
    cy.get('[data-cy="notGuaranteed"]')
      .should("be.checked")
      .and("have.attr", "readonly");
    cy.get('[data-cy="BtnSaveDraft"]').should("not.exist");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
  });
});

describe("LTFT Form View - editable (UNSUBMITTED)", () => {
  before(() => {
    store.dispatch(updatedLtftStatus("idle"));
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData(mockLtftUnsubmittedFormObj);
  });
  it("should render LTFT form in edit mode", () => {
    cy.get('[data-cy="backLink-to-back-to-ltft-home"]').should("exist");
    cy.get('[data-cy="savePdfBtn"]').should("not.be.disabled");
    cy.get('[data-cy="UNSUBMITTED-header"]').should("exist");
    cy.get('[data-cy="ltftName"]').contains("my Unsubmitted LTFT");
    cy.get('[data-cy="pageHeader-Your Programme"]').should("exist");
    cy.get('[data-cy="edit-pmId"]').should("exist");

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
