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

describe("FormsListBtn", () => {
  it("should render 'Submit new form' button when all forms status is 'submitted'.", () => {
    const MockedFormsListBtnAllSubs = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileData(mockTraineeProfile));
      return (
        <FormsListBtn formRList={submittedFormRPartBs} pathName="/formr-b" />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedFormsListBtnAllSubs />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=btnLoadNewForm]").should("exist").click();
    cy.url().should("include", "/create");
  });
  it("should render 'Edit saved form ' when a draft form in list", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormsListBtn
            formRList={submittedFormRPartBsWithDraft}
            pathName="/formr-b"
          />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=btnEditSavedForm]").should("exist").click();
    cy.url().should("include", "/create");
  });
  it("should render 'Edit unsubmitted form' when an unsubmitted form in list", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormsListBtn
            formRList={submittedFormRPartBsWithUnsubmitted}
            pathName="/formr-b"
          />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=btnEditUnsubmittedForm]").should("exist").click();
    cy.url().should("include", "/create");
  });
});
