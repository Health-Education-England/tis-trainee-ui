// NotificationMessageText.cy.tsx

import { mount } from "cypress/react18";
import { NotificationMessageText } from "../../../components/notifications/NotificationMessageText";

describe("NotificationMessageText", () => {
  it("displays loading state", () => {
    mount(
      <NotificationMessageText
        notificationMessageStatus="loading"
        notificationMessageText=""
      />
    );
    cy.contains("p", "Loading...");
  });

  it("displays error state", () => {
    mount(
      <NotificationMessageText
        notificationMessageStatus="failed"
        notificationMessageText=""
      />
    );
    cy.get('[data-cy="error-header-text"]')
      .should("exist")
      .contains("Oops! Something went wrong");
    cy.get('[data-cy="error-message-text"]')
      .should("exist")
      .contains("Failed to load this message.");
  });

  it("displays notification message", () => {
    const message = "This is a test notification message";
    mount(
      <NotificationMessageText
        notificationMessageStatus="success"
        notificationMessageText={message}
      />
    );
    cy.contains("p", message);
  });
});
