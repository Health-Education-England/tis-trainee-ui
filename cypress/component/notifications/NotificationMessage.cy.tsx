import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react";
import { NotificationMessageView } from "../../../components/notifications/NotificationMessageView";
import dayjs from "dayjs";
import { mockNotificationMsg } from "../../../mock-data/mock-notifications-data";

describe("NotificationMessageView", () => {
  it("renders loading state", () => {
    mount(
      <MemoryRouter>
        <NotificationMessageView
          notificationMessageContent={null}
          notificationMessageStatus="loading"
        />
      </MemoryRouter>
    );
    cy.get('[data-cy="loading"]').should("exist");
  });

  it("renders succeeded state with HTML content", () => {
    mount(
      <MemoryRouter initialEntries={["/notifications/1"]}>
        <NotificationMessageView
          notificationMessageContent={mockNotificationMsg}
          notificationMessageStatus="succeeded"
        />
      </MemoryRouter>
    );
    cy.get('[data-cy="backLink-to-back-to-notifications-list"]')
      .should("contain", "Back to notifications list")
      .click();
    cy.url().should("include", "/notifications");
    cy.get('[data-cy="notification-message-header"]').contains(
      "Test Notification"
    );
    cy.get('[data-cy="notification-message-sent-at"]').contains(
      `Sent ${dayjs().format("DD/MM/YYYY")}`
    );
    cy.get('[data-cy="notification-message-content"]').contains(
      "Test notification message"
    );
  });

  it("renders error state", () => {
    mount(
      <MemoryRouter>
        <NotificationMessageView
          notificationMessageContent={null}
          notificationMessageStatus="failed"
        />
      </MemoryRouter>
    );
    cy.contains("Notification message error");
    cy.get('[data-cy="backLink-to-back-to-notifications-list"]').should(
      "contain",
      "Back to notifications list"
    );
  });
});
