import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import { mockTraineeProfile } from "../../../mock-data/trainee-profile";
import FormsListBtn from "../../../components/forms/FormsListBtn";
import { updatedTraineeProfileData } from "../../../redux/slices/traineeProfileSlice";
import history from "../../../components/navigation/history";
import day from "dayjs";
import { LifeCycleState } from "../../../models/LifeCycleState";
import { updatedDraftFormProps } from "../../../redux/slices/formsSlice";
import { ReactNode } from "react";

const mountWithProviders = (children: ReactNode) => {
  return mount(
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );
};

describe("FormsListBtn", () => {
  it("should render the 'Submit new form' button if no draft forms", () => {
    const MockedFormsListBtnNoDraftForms = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileData(mockTraineeProfile));
      return (
        <FormsListBtn pathName="/formr-b" latestSubDate={day().toDate()} />
      );
    };
    mountWithProviders(<MockedFormsListBtnNoDraftForms />);
    cy.get('[data-cy="Submit new form"]').should("exist").click();
    cy.get('[data-cy="formWarning"]')
      .should("exist")
      .should(
        "include.text",
        `Important: ImportantYou recently submitted a form on ${day().format(
          "DD/MM/YYYY"
        )}. Are you sure you want to submit another?`
      );
  });

  it("should NOT render the modal 'recent form warning' if a form has NOT been submitted within 31 days from today", () => {
    mountWithProviders(
      <FormsListBtn
        pathName="/formr-b"
        latestSubDate={day().subtract(31, "d").toDate()}
      />
    );
    cy.get('[data-cy="Submit new form"]').should("exist").click();
    cy.get('[data-cy="formWarning"]').should("not.exist");
  });

  it("should render 'Edit saved draft form ' btn and no modal on click when a saved draft form is to be edited", () => {
    const MockedFormsListBtnWithDraftForm = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedDraftFormProps({
          id: "4",
          lifecycleState: LifeCycleState.Draft,
          programmeMembershipId: "1"
        })
      );
      return <FormsListBtn pathName="/formr-b" latestSubDate={null} />;
    };
    mountWithProviders(<MockedFormsListBtnWithDraftForm />);
    cy.get('[data-cy="btn-Edit saved draft form"]').should("exist").click();
    cy.url().should("include", "/create");
  });

  it("should render 'Edit unsubmitted form'btn and a modal on click when an unsubmitted form is to be edited", () => {
    const MockedFormsListBtnWithUnsubmittedForm = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedDraftFormProps({
          id: "5",
          lifecycleState: LifeCycleState.Unsubmitted
        })
      );
      return <FormsListBtn pathName="/formr-a" latestSubDate={null} />;
    };
    mountWithProviders(<MockedFormsListBtnWithUnsubmittedForm />);
    cy.get('[data-cy="btn-Edit unsubmitted form"]').should("exist").click();
    cy.get("dialog").should("be.visible");
  });
});
