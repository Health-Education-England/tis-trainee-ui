import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
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
        <BrowserRouter>
          <MockedFormsListBtnAllSubs />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=btnLoadNewForm]").should("exist");
  });
  it("should render 'Edit saved form ' when a draft form in list", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <FormsListBtn
            formRList={submittedFormRPartBsWithDraft}
            pathName="/formr-b"
          />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=btnEditSavedForm]").should("exist");
  });
  it("should render 'Edit unsubmitted form' when an unsubmitted form in list", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <FormsListBtn
            formRList={submittedFormRPartBsWithUnsubmitted}
            pathName="/formr-b"
          />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=btnEditUnsubmittedForm]").should("exist");
  });
});
