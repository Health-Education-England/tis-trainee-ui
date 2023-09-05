import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import { Main } from "../../../components/main/Main";
import { updatedTraineeProfileStatus } from "../../../redux/slices/traineeProfileSlice";
import history from "../../../components/navigation/history";
import React from "react";
import { updatedRedirected } from "../../../redux/slices/userSlice";
import { updatedReferenceStatus } from "../../../redux/slices/referenceSlice";

describe("Main", () => {
  const MockedMainLoaded = () => {
    const dispatch = useAppDispatch();
    dispatch(updatedTraineeProfileStatus("succeeded"));
    dispatch(updatedReferenceStatus("succeeded"));
    dispatch(updatedRedirected(false));
    return <Main signOut={null} appVersion="1.0.0" />;
  };

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

  it("should show bookmark alert when previously redirected", () => {
    const MockedMainLoaded = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("succeeded"));
      dispatch(updatedReferenceStatus("succeeded"));
      dispatch(updatedRedirected(true));
      return <Main signOut={null} appVersion="1.0.0" />;
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedMainLoaded />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=bookmarkAlert]").should("exist");
  });

  it("should show bookmark alert when currently redirected", () => {
    history.push("test?redirected=1");

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedMainLoaded />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=bookmarkAlert]").should("exist");
  });

  it("should not show bookmark alert when not redirected", () => {
    history.push("test");

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedMainLoaded />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=bookmarkAlert]").should("not.exist");
  });

  it("should remove the redirected parameter from the URL", () => {
    history.push("test?redirected=1&abc=123");

    console.log(history);
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedMainLoaded />
        </Router>
      </Provider>
    );

    cy.wait(1000);
    cy.url().then(url => expect(url.endsWith("/test?abc=123")).to.be.true);
  });
});
