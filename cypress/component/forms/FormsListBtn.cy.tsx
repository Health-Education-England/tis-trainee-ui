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
import { ConfirmProvider } from "material-ui-confirm";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { LifeCycleState } from "../../../models/LifeCycleState";
import { updatedDraftFormProps } from "../../../redux/slices/formsSlice";

describe("FormsListBtn", () => {
  it("should render the 'Submit new form' button if no draft forms", () => {
    const MockedFormsListBtnNoDraftForms = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileData(mockTraineeProfile));
      return <FormsListBtn pathName="/formr-b" latestSubDate={null} />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedFormsListBtnNoDraftForms />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="Submit new form"]').should("exist");
  });

  it("should render 'Edit saved draft form ' btn when a saved draft form is to be edited", () => {
    const MockedFormsListBtnWithDraftForm = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedDraftFormProps({
          id: "4",
          lifecycleState: LifeCycleState.Draft
        })
      );
      return <FormsListBtn pathName="/formr-b" latestSubDate={null} />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedFormsListBtnWithDraftForm />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="btn-Edit saved draft form"]').should("exist");
  });
  it("should render 'Edit unsubmitted form' when an unsubmitted form is to be edited", () => {
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

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedFormsListBtnWithUnsubmittedForm />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="btn-Edit unsubmitted form"]').should("exist").click();
    cy.url().should("include", "/create");
  });

  it("should render the modal warning if a form has been submitted within 31 days from today", () => {
    const MockedFormsListBtnDraftFormsBackToNull = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedDraftFormProps(null));
      return (
        <FormsListBtn pathName="/formr-b" latestSubDate={day().toDate()} />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ConfirmProvider>
            <MockedFormsListBtnDraftFormsBackToNull />
          </ConfirmProvider>
        </Router>
      </Provider>
    );
    cy.stub(FormRUtilities, "loadNewForm").as("newForm");
    cy.get('[data-cy="Submit new form"]').should("exist").click();
    cy.get(".MuiDialog-container").should("exist");
    cy.get(".MuiDialogContent-root > .MuiTypography-root").should(
      "contain.text",
      `You recently submitted a form on ${DateUtilities.ToLocalDate(
        day().toDate()
      )}. Are you sure you want to submit another?`
    );
    cy.get(".MuiDialogActions-root > :nth-child(1)").click();
    cy.get(".MuiDialog-container").should("not.exist");
    cy.get('[data-cy="Submit new form"]').should("exist").click();
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.url().should("include", "/create");
    cy.get("@newForm").should("have.been.called");
  });
  it("should NOT render the modal warning if a form has NOT been submitted within 31 days from today but should still loadNewForm", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ConfirmProvider>
            <FormsListBtn
              pathName="/formr-b"
              latestSubDate={day().subtract(31, "d").toDate()}
            />
          </ConfirmProvider>
        </Router>
      </Provider>
    );
    cy.stub(FormRUtilities, "loadNewForm").as("newForm");
    cy.get('[data-cy="Submit new form"]').should("exist").click();
    cy.get(".MuiDialog-container").should("not.exist");
    cy.url().should("include", "/create");
    cy.get("@newForm").should("have.been.called");
  });
});
