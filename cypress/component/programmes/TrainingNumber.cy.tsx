import { mount } from "cypress/react18";
import React from "react";
import { COJ_EPOCH } from "../../../utilities/Constants";
import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../../models/ProgrammeMembership";
import { BrowserRouter } from "react-router-dom";
import { TrainingNumber } from "../../../components/programmes/TrainingNumber";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import { updatedFormAList } from "../../../redux/slices/formASlice";
import { mockFormList } from "../../../mock-data/formr-list";
import { updatedFormBList } from "../../../redux/slices/formBSlice";

const TRAINING_NUMBER = "ABC/XYZ-123/1234567/D";

describe("TrainingNumber", () => {
  const conditionsOfJoining = {
    signedAt: COJ_EPOCH,
    version: "GG8"
  } as ConditionsOfJoiningModel;

  beforeEach(() => {
    store.dispatch(updatedFormAList(mockFormList));
    store.dispatch(updatedFormBList(mockFormList));
  });

  it("should display 'Not Available' when no training number and actions not complete", () => {
    const conditionsOfJoining = {
      signedAt: null,
      version: "GG8"
    } as ConditionsOfJoiningModel;

    store.dispatch(updatedFormAList([]));
    store.dispatch(updatedFormBList([]));

    mount(
      <Provider store={store}>
        <BrowserRouter>
          <TrainingNumber
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            trainingNumber={null}
          ></TrainingNumber>
        </BrowserRouter>
      </Provider>
    );

    cy.get("[data-cy=trainingNumberText]")
      .should("exist")
      .and("have.text", "Not Available");
  });

  it("should require Conditions of Joining when not signed and start date after COJ epoch", () => {
    const conditionsOfJoining = {
      signedAt: null,
      version: "GG8"
    } as ConditionsOfJoiningModel;

    mount(
      <Provider store={store}>
        <BrowserRouter>
          <TrainingNumber
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            trainingNumber={TRAINING_NUMBER}
          ></TrainingNumber>
        </BrowserRouter>
      </Provider>
    );

    cy.get("[data-cy=requireCoj]")
      .should("exist")
      .and("have.text", "Conditions of Joining");
  });

  it("should not require Conditions of Joining when not signed and start date before COJ epoch", () => {
    const conditionsOfJoining = {
      signedAt: null,
      version: "GG8"
    } as ConditionsOfJoiningModel;

    mount(
      <Provider store={store}>
        <BrowserRouter>
          <TrainingNumber
            conditionsOfJoining={conditionsOfJoining}
            startDate={new Date(
              COJ_EPOCH.getTime() - 24 * 60 * 60 * 1000
            ).toISOString()}
            trainingNumber={TRAINING_NUMBER}
          ></TrainingNumber>
        </BrowserRouter>
      </Provider>
    );

    cy.get("[data-cy=trainingNumberText]")
      .should("exist")
      .and("have.text", TRAINING_NUMBER);
  });

  it("should require Form R Part A when never submitted", () => {
    store.dispatch(updatedFormAList([]));

    mount(
      <Provider store={store}>
        <BrowserRouter>
          <TrainingNumber
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            trainingNumber={TRAINING_NUMBER}
          ></TrainingNumber>
        </BrowserRouter>
      </Provider>
    );

    cy.get("[data-cy=requireFormRA]")
      .should("exist")
      .and("have.text", "Form R Part A");
  });

  it("should require Form R Part A when submitted over 12 months ago", () => {
    store.dispatch(updatedFormAList([{ ...mockFormList[3] }]));

    mount(
      <Provider store={store}>
        <BrowserRouter>
          <TrainingNumber
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            trainingNumber={TRAINING_NUMBER}
          ></TrainingNumber>
        </BrowserRouter>
      </Provider>
    );

    cy.get("[data-cy=requireFormRA]")
      .should("exist")
      .and("have.text", "Form R Part A");
  });

  it("should require Form R Part B when never submitted", () => {
    store.dispatch(updatedFormBList([]));

    mount(
      <Provider store={store}>
        <BrowserRouter>
          <TrainingNumber
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            trainingNumber={TRAINING_NUMBER}
          ></TrainingNumber>
        </BrowserRouter>
      </Provider>
    );

    cy.get("[data-cy=requireFormRB]")
      .should("exist")
      .and("have.text", "Form R Part B");
  });

  it("should require Form R Part B when submitted over 12 months ago", () => {
    store.dispatch(updatedFormBList([{ ...mockFormList[3] }]));

    mount(
      <Provider store={store}>
        <BrowserRouter>
          <TrainingNumber
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            trainingNumber={TRAINING_NUMBER}
          ></TrainingNumber>
        </BrowserRouter>
      </Provider>
    );

    cy.get("[data-cy=requireFormRB]")
      .should("exist")
      .and("have.text", "Form R Part B");
  });

  it("should display 'Not Available' when no training number and actions complete", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <TrainingNumber
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            trainingNumber={null}
          ></TrainingNumber>
        </BrowserRouter>
      </Provider>
    );

    cy.get("[data-cy=trainingNumberText]")
      .should("exist")
      .and("have.text", "Not Available");
  });

  it("should display the training when actions complete", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <TrainingNumber
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            trainingNumber={TRAINING_NUMBER}
          ></TrainingNumber>
        </BrowserRouter>
      </Provider>
    );

    cy.get("[data-cy=trainingNumberText]")
      .should("exist")
      .and("have.text", TRAINING_NUMBER);
  });
});
