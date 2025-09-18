import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { TssUpdates } from "../../../components/home/TssUpdates";
import history from "../../../components/navigation/history";
import React from "react";
import { tssUpdatesWp } from "../../../mock-data/tss-updates-wp";
import {
  updatedTssUpdates,
  updatedTssUpdatesStatus
} from "../../../redux/slices/tssUpdatesSlice";

describe("TssUpdates", () => {
  it("should display 'loading' msg when status is loading", () => {
    const MockedTssUpdatesLoading = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTssUpdatesStatus("loading"));
      return <TssUpdates />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedTssUpdatesLoading />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=loadingUpdates]").should("contain", "Loading");
  });

  it("should display the 'error' msg when status is error", () => {
    const MockedTssUpdatesError = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTssUpdatesStatus("failed"));
      return <TssUpdates />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedTssUpdatesError />
        </Router>
      </Provider>
    );

    cy.get("[data-cy=failedUpdates]").should(
      "have.text",
      "Failed to load What's New"
    );
  });

  it("should display 'no updates' msg when no posts", () => {
    const MockedTssUpdatesNone = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTssUpdatesStatus("Succeeded"));
      return <TssUpdates />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedTssUpdatesNone />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="whatsNewHeader"]').should("contain", "What's New");
    cy.get("[data-cy=noUpdates]").should(
      "contain",
      "No new updates available at the moment."
    );
  });

  it("should display TssUpdates", () => {
    const MockedTssUpdates = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTssUpdates([tssUpdatesWp[0]]));
      return <TssUpdates />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedTssUpdates />
        </Router>
      </Provider>
    );
    cy.get(".tss-updates-content").should("exist");
    cy.get('[data-cy="whatsNewHeader"]').should("contain", "What's New");
    cy.get('[data-cy="anchorEl_What\'s New"]')
      .should("contain.text", "What's New")
      .should(
        "have.attr",
        "href",
        "https://tis-support.hee.nhs.uk/about-tis/welcome-to-the-tss-updates/"
      );
    cy.get('[data-cy="postTitle1"]').should("contain", "Post 1 Title");
    cy.get('[data-cy="postExcerpt1"]').should(
      "contain",
      "This is the excerpt of post 1."
    );
  });
});
