import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import {
  ToastMessage,
  ToastType
} from "../../../components/common/ToastMessage";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";
import { mockTraineeProfile } from "../../../mock-data/trainee-profile";
import history from "../../../components/navigation/history";

describe("ToastMessage", () => {
  it("renders the message correctly", () => {
    const MockedSuccessToast = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("succeeded"));
      dispatch(updatedTraineeProfileData(mockTraineeProfile));
      return (
        <ToastMessage
          msg="This is a success toast message"
          type={ToastType.SUCCESS}
        />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSuccessToast />
        </Router>
      </Provider>
    );
    const message = "This is a success toast message";
    cy.get(".toast-text").should("be.visible").contains(message);
  });
  it("displays the error message plus Support link and href data ", () => {
    const MockedErrorToast = () => {
      return (
        <ToastMessage
          msg="This is an error toast message"
          type={ToastType.ERROR}
          actionErrorMsg="808 State"
        />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedErrorToast />
        </Router>
      </Provider>
    );
    const message = "This is an error toast message";
    cy.get(".toast-text").should("be.visible").contains(message);
    cy.get('[data-cy="techSupportLink"]')
      .should("be.visible")
      .should("have.attr", "href");
  });
});
