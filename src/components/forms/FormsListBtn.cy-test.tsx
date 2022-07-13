import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks/hooks";
import store from "../../redux/store/store";
import { mockTraineeProfile } from "../../mock-data/trainee-profile";
import {
  submittedFormRPartBs,
  submittedFormRPartBsWithDraft,
  submittedFormRPartBsWithUnsubmitted
} from "../../mock-data/submitted-formr-partb";
import FormsListBtn from "./FormsListBtn";
import { updatedTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import history from "../navigation/history";
import day from "dayjs";
import { ConfirmProvider } from "material-ui-confirm";

describe("FormsListBtn", () => {
  it("should render the 'Submit new form' button if no submitted forms ", () => {
    const MockedFormsListBtnNoSubForms = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileData(mockTraineeProfile));
      return (
        <FormsListBtn formRList={[]} pathName="/formr-b" latestSubDate={null} />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedFormsListBtnNoSubForms />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=btnLoadNewForm]").should("exist");
  });

  it("should render 'Submit new form' button when all forms status is 'submitted'.", () => {
    const MockedFormsListBtnAllSubs = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileData(mockTraineeProfile));
      return (
        <FormsListBtn
          formRList={submittedFormRPartBs}
          pathName="/formr-b"
          latestSubDate={null}
        />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedFormsListBtnAllSubs />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=btnLoadNewForm]").should("exist");
  });
  it("should render 'Edit saved form ' when a draft form in list", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormsListBtn
            formRList={submittedFormRPartBsWithDraft}
            pathName="/formr-b"
            latestSubDate={null}
          />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=btnEditSavedForm]").should("exist");
  });
  it("should render 'Edit unsubmitted form' when an unsubmitted form in list", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormsListBtn
            formRList={submittedFormRPartBsWithUnsubmitted}
            pathName="/formr-b"
            latestSubDate={null}
          />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=btnEditUnsubmittedForm]").should("exist").click();
    cy.url().should("include", "/create");
  });
  it("should render the modal warning if a form has been submitted within 31 days from today", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ConfirmProvider>
            <FormsListBtn
              formRList={[]}
              pathName="/formr-b"
              latestSubDate={day().toDate()}
            />
          </ConfirmProvider>
        </Router>
      </Provider>
    );
    cy.get("[data-cy=btnLoadNewForm]").should("exist").click();
    cy.get(".MuiDialog-container").should("exist");
    cy.get("#mui-1").should("include.text", "Are you sure?");
    cy.get(".MuiDialogActions-root > :nth-child(1)").click();
    cy.get(".MuiDialog-container").should("not.exist");
    cy.get("[data-cy=btnLoadNewForm]").should("exist").click();
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.url().should("include", "/create");
  });
  it("should NOT render the modal warning if a form has NOT been submitted within 31 days from today", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ConfirmProvider>
            <FormsListBtn
              formRList={[]}
              pathName="/formr-b"
              latestSubDate={day().subtract(31, "d").toDate()}
            />
          </ConfirmProvider>
        </Router>
      </Provider>
    );
    cy.get("[data-cy=btnLoadNewForm]").should("exist").click();
    cy.get(".MuiDialog-container").should("not.exist");
    cy.url().should("include", "/create");
  });
});
