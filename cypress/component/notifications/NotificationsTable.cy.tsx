import { mount } from "cypress/react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import history from "../../../components/navigation/history";
import { NotificationsTable } from "../../../components/notifications/NotificationsTable";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { loadedNotificationsList } from "../../../redux/slices/notificationsSlice";
import { emailNotificationData, notificationsData } from "../../../mock-data/notifications";
import store from "../../../redux/store/store";

describe("NotificationsTable with no notifications data", () => {
  it("should render the 'no notifications' message if no notifications", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <NotificationsTable />
        </Router>
      </Provider>
    );
    cy.get(`[data-cy=notificationsTable]`).should("not.exist");
    cy.get('[data-cy="notificationsTableNoNotifs"]')
      .should("exist")
      .contains("You currently don't have any notifications to read.");
  });
});

describe("NotificationsTable with notifications data", () => {
  beforeEach(() => {
    cy.viewport("macbook-15");
    const MockedNotificationsTable = () => {
      const dispatch = useAppDispatch();
      dispatch(loadedNotificationsList(notificationsData));
      return <NotificationsTable />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedNotificationsTable />
        </Router>
      </Provider>
    );
  });

  it("should show in-app notification by default and display correct columns", () => {
    cy.get(`[data-cy=notificationsTable]`).should("exist");
    cy.get('[data-cy="notificationsTable-status"]').should("exist").contains("Unread");
    cy.get('[data-cy="notificationsTable-subjectText"]').should("exist").contains("Title");
    cy.get('[data-cy="notificationsTable-subject"]').should("exist").contains("Type");
    cy.get('[data-cy="notificationsTable-sentAt"]').should("exist").contains("Date");
  });

  it("should render the table and find notifications with the global search text", () => {
    cy.get(`[data-cy=notificationsTable]`).should("exist");
    cy.get('[data-cy="NotificationsSearchInput"]').should("exist").type("some");
    cy.get("tr.table-row.row-unread").should("have.length", 2);
    cy.get('[data-cy="notificationsTableRow-6"]').should("exist");
    cy.get('[data-cy="notificationsTableRow-9"]').should("exist");
  });

  it("should go to the correct page when the page input is changed", () => {
    cy.get('[data-cy="NotificationsTablePageInput"]').should("exist").type("2");
    cy.get('[data-cy="notificationsTableRow-6"] > :nth-child(4)')
      .should("exist")
      .contains("01/03/2024");
    // Enter number > page count
    cy.get('[data-cy="NotificationsTablePageInput"]').type("3");
    cy.get('[data-cy="NotificationsTablePageInput"]').should("have.value", "2");
  });

  it("should navigate to the correct page via the navigation buttons", () => {
    cy.get('[data-cy="NotificationsTableLastPageBtn"]').should("exist").click();
    cy.get("tr.table-row").should("have.length", 5);

    cy.get('[data-cy="notificationsTableRow-6"] > :nth-child(4)').contains(
      "01/03/2024"
    );
    cy.get('[data-cy="NotificationsTableNextPageBtn"]').should("be.disabled");
    cy.get('[data-cy="NotificationsTableLastPageBtn"]').should("be.disabled");
    cy.get('[data-cy="NotificationsTableFirstPageBtn"]').should(
      "not.be.disabled"
    );
    cy.get('[data-cy="NotificationsTablePreviousPageBtn"]')
      .should("not.be.disabled")
      .click();
    cy.get('[data-cy="NotificationsTableNextPageBtn"]').should(
      "not.be.disabled"
    );
    cy.get('[data-cy="NotificationsTableLastPageBtn"]').should(
      "not.be.disabled"
    );
    cy.get("tr.table-row").should("have.length", 5);
  });

  it("should sort the table columns when the header is clicked", () => {
    // date defaults to sort desc
    cy.get('[data-cy="Date-fa-sort-down"]').should("be.visible");
    cy.get('[data-cy="Date-fa-sort-up"]').should("not.exist");
    cy.get('[data-cy="notificationsTable-subject"] > div > .table-header-btn')
      .should("exist")
      .click();
    cy.get('[data-cy="notificationsTableRow-0"] > :nth-child(4)').contains(
      "01/03/2024"
    );
    cy.get("tr.table-row.row-unread").should("have.length", 3);
    cy.get('[data-cy="Type-fa-sort-up"]').should("exist");
    cy.get('[data-cy="Type-fa-sort-down"]').should("not.exist");
  });  
});

describe("NotificationsTable with email notifications data", () => {
  beforeEach(() => {
    cy.viewport("macbook-15");
    const MockedNotificationsTable = () => {
      const dispatch = useAppDispatch();
      dispatch(loadedNotificationsList(emailNotificationData));
      return <NotificationsTable />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedNotificationsTable />
        </Router>
      </Provider>
    );
  });

  it("should display correct column for email notifications", () => {
    cy.get('[data-cy="emailBtn"]').should("exist").click();
    cy.get(`[data-cy=notificationsTable]`).should("exist");
    cy.get('[data-cy="notificationsTable-status"]').should("exist").contains("Failed");
    cy.get('[data-cy="notificationsTable-subjectText"]').should("exist").contains("Title");
    cy.get('[data-cy="notificationsTable-subject"]').should("exist").contains("Type");
    cy.get('[data-cy="notificationsTable-sentAt"]').should("exist").contains("Date");
    cy.get('[data-cy="notificationsTable-contact"]').should("exist").contains("Sent to");
  });

  it("should render the table and find notifications with the global search text", () => {
    cy.get(`[data-cy=notificationsTable]`).should("exist");
    cy.get('[data-cy="NotificationsSearchInput"]').should("exist").type("FormR");
    cy.get("tr.table-row.row-unread").should("have.length", 2);
    cy.get('[data-cy="notificationsTableRow-0"]').should("exist");
    cy.get('[data-cy="notificationsTableRow-1"]').should("exist");
  });

});