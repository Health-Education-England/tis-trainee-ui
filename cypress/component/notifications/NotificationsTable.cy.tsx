import { mount } from "cypress/react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import history from "../../../components/navigation/history";
import { updateNotificationStatusFilter } from "../../../redux/slices/notificationsSlice";
import {
  emailNotificationData,
  mockInAppNotificationsData
} from "../../../mock-data/mock-notifications-data";
import store from "../../../redux/store/store";
import { NotificationsTableView } from "../../../components/notifications/NotificationsTableView";

describe("NotificationsTable with no in-app notifications data", () => {
  it("should render the 'loading state' correctly", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <NotificationsTableView
            notificationsData={[]}
            viewingType={"IN_APP"} // default state when navigating to /notifications
            notificationsStatus="loading"
          />
        </Router>
      </Provider>
    );
    cy.get(`[data-cy=loading]`).should("exist");
    cy.get("#unreadCheck").should("not.be.checked");
  });

  it("should render the 'notifications load error' message on failed load", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <NotificationsTableView
            notificationsData={[]}
            viewingType={"IN_APP"}
            notificationsStatus="failed"
          />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=notificationsTable]").should("not.exist");
    cy.get('[data-cy="error-message-text"]')
      .should("exist")
      .contains("Failed to load your notifications.");
    cy.get("#unreadCheck").should("not.be.checked");
  });

  it("should render the 'no In-app notifications' message on successful load", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <NotificationsTableView
            notificationsData={[]}
            viewingType={"IN_APP"}
            notificationsStatus="success"
          />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=notificationsTable]").should("not.exist");
    cy.get('[data-cy="notificationsTableNoNotifs"]')
      .should("exist")
      .contains("You have no In-app notifications to read.");
    cy.get("#unreadCheck").should("not.be.checked");
    cy.get("#unreadCheck").check();
    cy.get('[data-cy="notificationsTableNoNotifs"]').contains(
      "You have no Unread In-app notifications to read."
    );
  });
});

describe("NotificationsTable with no email notifications data", () => {
  it("should render the 'no Email notifications' message on successful load", () => {
    store.dispatch(updateNotificationStatusFilter(""));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <NotificationsTableView
            notificationsData={[]}
            viewingType={"EMAIL"}
            notificationsStatus="success"
          />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=notificationsTable]").should("not.exist");
    cy.get('[data-cy="notificationsTableNoNotifs"]')
      .should("exist")
      .contains("You have no Email notifications to read.");
    cy.get("#failedCheck").should("not.be.checked");
    cy.get("#failedCheck").check();
    cy.get('[data-cy="notificationsTableNoNotifs"]').contains(
      "You have no Failed Email notifications to read."
    );
  });
});

describe("NotificationsTable with In-app notifications data", () => {
  it("should show in-app notification by default and display correct table layout and functionality", () => {
    store.dispatch(updateNotificationStatusFilter(""));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <NotificationsTableView
            notificationsData={mockInAppNotificationsData}
            viewingType={"IN_APP"} // default state when navigating to /notifications
            notificationsStatus="success"
          />
        </Router>
      </Provider>
    );

    // table filters
    cy.get('[data-cy="emailBtn"]').should("exist").should("not.be.disabled");
    cy.get('[data-cy="inAppBtn"]').should("exist").should("be.disabled");
    cy.get("#unreadCheck").should("exist").should("not.be.checked");
    cy.get('[data-cy="checkboxLabel-Show UNREAD status only"]').should("exist");

    // table columns
    cy.get(`[data-cy=notificationsTable]`).should("exist");
    cy.get('[data-cy="notificationsTable-status"]')
      .should("exist")
      .contains("Status");
    cy.get('[data-cy="notificationsTable-subjectText"]')
      .should("exist")
      .contains("Title");
    cy.get('[data-cy="notificationsTable-subject"]')
      .should("exist")
      .contains("Type");
    cy.get('[data-cy="notificationsTable-sentAt"]')
      .should("exist")
      .contains("Date");

    // search functionality
    cy.get('[data-cy="NotificationsSearchInput"]').should("exist").type("use");
    cy.get("tr.table-row.row-unread").should("have.length", 1);
    cy.get("tr.table-row.row-read").should("have.length", 1);
    cy.get('[data-cy="notificationsTableRow-1"]').should("exist");
    cy.get('[data-cy="notificationsTableRow-5"]').should("exist");
    cy.get('[data-cy="NotificationsSearchInput"]').clear();

    // page input functionality
    cy.get('[data-cy="notificationsTableRow-1"] > :nth-child(1)')
      .should("exist")
      .contains("UNREAD");
    cy.get('[data-cy="NotificationsTablePageInput"]')
      .should("exist")
      .clear()
      .type("2");
    cy.get('[data-cy="notificationsTableRow-5"] > :nth-child(1)')
      .should("exist")
      .contains("READ");
    // Enter number > page count
    cy.get('[data-cy="NotificationsTablePageInput"]').clear().type("7");
    cy.get('[data-cy="NotificationsTablePageInput"]').should("have.value", "3");

    // navigation buttons functionality
    cy.get('[data-cy="NotificationsTablePageInput"]').clear().type("1");
    cy.get('[data-cy="NotificationsTableLastPageBtn"]').should("exist").click();
    cy.get("tr.table-row").should("have.length", 3);
    cy.get('[data-cy="notificationsTableRow-10"] > :nth-child(3)').contains(
      "LTFT"
    );
    cy.get('[data-cy="NotificationsTableNextPageBtn"]').should("be.disabled");
    cy.get('[data-cy="NotificationsTableLastPageBtn"]').should("be.disabled");
    cy.get('[data-cy="NotificationsTableFirstPageBtn"]')
      .should("not.be.disabled")
      .click();
    cy.get('[data-cy="NotificationsTableNextPageBtn"]').should(
      "not.be.disabled"
    );
    cy.get('[data-cy="NotificationsTableLastPageBtn"]').should(
      "not.be.disabled"
    );
    cy.get("tr.table-row").should("have.length", 5);

    // table column sorting
    cy.get('[data-cy="Date-fa-sort-down"]').should("exist").scrollIntoView();
    cy.get('[data-cy="Date-fa-sort-up"]').should("not.exist");
    cy.get(
      '[data-cy="notificationsTable-subject"] > div > .table-header-btn'
    ).click();
    cy.get('[data-cy="notificationsTableRow-3"] > :nth-child(2) > span')
      .should("exist")
      .contains("Day One");

    cy.get("tr.table-row.row-unread").should("have.length", 0);
    cy.get('[data-cy="Type-fa-sort-up"]').should("exist");
    cy.get('[data-cy="Type-fa-sort-down"]').should("not.exist");
  });
});

describe("NotificationsTable with Email notifications data", () => {
  it("should display correct table layout and functionality", () => {
    store.dispatch(updateNotificationStatusFilter(""));

    mount(
      <Provider store={store}>
        <Router history={history}>
          <NotificationsTableView
            notificationsData={emailNotificationData}
            viewingType={"EMAIL"}
            notificationsStatus="success"
          />
        </Router>
      </Provider>
    );

    // table filters
    cy.get('[data-cy="emailBtn"]').should("exist").should("be.disabled");
    cy.get('[data-cy="inAppBtn"]').should("exist").should("not.be.disabled");
    cy.get("#failedCheck").should("exist").should("not.be.checked");
    cy.get('[data-cy="checkboxLabel-Show FAILED status only"]').should("exist");

    // table columns
    cy.get('[data-cy="notificationsTable-status"]')
      .should("exist")
      .contains("Status");
    cy.get('[data-cy="notificationsTable-subjectText"]')
      .should("exist")
      .contains("Title");
    cy.get('[data-cy="notificationsTable-subject"]')
      .should("exist")
      .contains("Type");
    cy.get('[data-cy="notificationsTable-sentAt"]')
      .should("exist")
      .contains("Date");
    cy.get('[data-cy="notificationsTable-contact"]')
      .should("exist")
      .contains("Sent to");
    // no change after row click
    cy.get('[data-cy="notificationsTableRow-1"] > :nth-child(1)')
      .should("exist")
      .contains("FAILED")
      .click();
    cy.get('[data-cy="notificationsTableRow-1"] > :nth-child(1)')
      .should("exist")
      .contains("FAILED");
    // search functionality
    cy.get("tr.table-row").should("have.length", 5);
    cy.get('[data-cy="NotificationsSearchInput"]')
      .should("exist")
      .type("FormR");
    cy.get("tr.table-row").should("have.length", 4);
    cy.get('[data-cy="notificationsTableRow-0"]').should("exist");
    cy.get('[data-cy="notificationsTableRow-1"]').should("exist");
  });

  describe("NotificationsTable FAILED Email notifications", () => {
    it("should show status details on FAILED notifications", () => {
      store.dispatch(updateNotificationStatusFilter(""));
      mount(
        <Provider store={store}>
          <Router history={history}>
            <NotificationsTableView
              notificationsData={emailNotificationData}
              viewingType={"EMAIL"}
              notificationsStatus="success"
            />
          </Router>
        </Provider>
      );
      // should show the correct description if matched
      cy.get('[data-cy="65f1d6bd3f7898e099514197-icon"]')
        .should("be.visible")
        .click();
      cy.get('[data-cy="65f1d6bd3f7898e099514197-modal"]').should("exist");
      cy.get(
        '[data-cy="65f1d6bd3f7898e099514197-modal"] .modal-content h2'
      ).should("contain.text", "Bounce: Transient - General");
      cy.get(
        '[data-cy="65f1d6bd3f7898e099514197-modal"] .modal-content'
      ).should(
        "contain.text",
        "There was a temporary issue delivering the email to you. No action needed. We will try sending again automatically."
      );
      cy.get('[data-cy="65f1d6bd3f7898e099514197-modal"]')
        .contains("Close")
        .click();
      cy.get('[data-cy="65f1d6bd3f7898e099514197-modal"]').should("not.exist");

      // should show status details without description if not match
      cy.get('[data-cy="65f1d6bd3f7898e099514199-icon"]')
        .should("be.visible")
        .click();
      cy.get('[data-cy="65f1d6bd3f7898e099514199-modal"]').should("exist");
      cy.get(
        '[data-cy="65f1d6bd3f7898e099514199-modal"] .modal-content h2'
      ).should("contain.text", "Email Bounce");
      cy.get('[data-cy="65f1d6bd3f7898e099514199-modal"]')
        .contains("Close")
        .click();
      cy.get('[data-cy="65f1d6bd3f7898e099514199-modal"]').should("not.exist");

      // should not show icon if no status details
      cy.get('[data-cy="65f1d6bd3f7898e099514190-icon"]').should("not.exist");
    });
  });
});
