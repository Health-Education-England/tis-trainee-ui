import { mount } from "cypress/react";
import { NotificationMessageView } from "../../../components/notifications/NotificationMessageView";
import dayjs from "dayjs";
import { mockNotificationMsg } from "../../../mock-data/mock-notifications-data";

describe("NotificationMessageView", () => {
  it("renders loading state", () => {
    mount(
      <NotificationMessageView
        notificationMessageContent={null}
        notificationMessageStatus="loading"
      />
    );
    cy.get('[data-cy="loading"]').should("exist");
  });

  it("renders succeeded state with HTML content", () => {
    mount(
      <NotificationMessageView
        notificationMessageContent={mockNotificationMsg}
        notificationMessageStatus="succeeded"
      />
    );
    cy.get('[data-cy="backLink-to-notifications"]').should(
      "contain",
      "Back to list"
    );
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
      <NotificationMessageView
        notificationMessageContent={null}
        notificationMessageStatus="failed"
      />
    );
    cy.contains("Notification message error");
    cy.get('[data-cy="backLink-to-notifications"]').should(
      "contain",
      "Back to list"
    );
  });
});
