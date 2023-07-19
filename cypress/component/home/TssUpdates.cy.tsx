import { mount } from "cypress/react18";
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

  it("should display 'no updates' msg when no posts (no tag 20) ", () => {
    const postsWithoutTag20 = tssUpdatesWp.filter(
      post => !post.tags.includes(20)
    );
    const MockedTssUpdatesNone = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTssUpdatesStatus("Succeeded"));
      dispatch(updatedTssUpdates(postsWithoutTag20));
      return <TssUpdates />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedTssUpdatesNone />
        </Router>
      </Provider>
    );
    cy.get("h2").should("contain", "What's New");
    cy.get("[data-cy=noUpdates]").should("contain", "No updates available");
  });

  it("should display TssUpdates", () => {
    const MockedTssUpdates = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTssUpdates(tssUpdatesWp));
      return <TssUpdates />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedTssUpdates />
        </Router>
      </Provider>
    );

    cy.get(".tss-update-content").then($element => {
      // Check if the element's content exceeds its visible height
      const canScroll = $element[0].scrollHeight > $element[0].clientHeight;
      if (canScroll) {
        cy.get(".tss-update-content").should("have.css", "overflow-y", "auto");
      }
    });
    cy.get('[data-cy="whatsNewHeader"]').should("contain", "What's New");
    cy.get('[data-cy="postTitle1"]').should("contain", "Post 1 Title");
    cy.get('[data-cy="postExcerpt1"]').should(
      "contain",
      "This is the excerpt of post 1."
    );
    cy.get('[data-cy="postTitle2"]').should("contain", "Post 2 Title");
    cy.get('[data-cy="postExcerpt2"]').should(
      "contain",
      "This is the excerpt of post 2."
    );
    cy.get('[data-cy="readMoreLink"]')
      .should("contain.text", "Click here to read more")
      .should(
        "have.attr",
        "href",
        "https://tis-support.hee.nhs.uk/about-tis/welcome-to-the-tss-updates/"
      );
  });
});
