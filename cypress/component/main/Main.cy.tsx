import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import { Main } from "../../../components/main/Main";
import { updatedTraineeProfileStatus } from "../../../redux/slices/traineeProfileSlice";
import history from "../../../components/navigation/history";
import React from "react";

describe("Main", () => {
  it("should return Loading comp if data loading ", () => {
    const MockedMainLoading = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("loading"));
      return <Main signOut={null} appVersion="1.0.0" />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedMainLoading />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=BtnMenu]").should("not.exist");
  });
});
