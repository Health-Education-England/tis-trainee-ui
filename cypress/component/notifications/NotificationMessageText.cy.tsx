import { mount } from "cypress/react";
import { NotificationMessageText } from "../../../components/notifications/NotificationMessageText";

describe("NotificationMessageText", () => {
  it("should display loading state", () => {
    mount(
      <NotificationMessageText
        notificationMessageStatus="loading"
        notificationMessageText=""
      />
    );
    cy.contains("p", "Loading...");
  });

  it("should display error state", () => {
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
      .contains(
        "Couldn't load this message. Please check your internet connection and try again."
      );
  });

  it("should display notification message", () => {
    const message = "This is a test notification message";
    mount(
      <NotificationMessageText
        notificationMessageStatus="success"
        notificationMessageText={`<p>${message}</p>`}
      />
    );
    cy.contains("p", message);
  });

  it("should sanitize notification message", () => {
    mount(
      <NotificationMessageText
        notificationMessageStatus="success"
        notificationMessageText="Test:<script>alert(1);</script>"
      />
    );
    cy.contains("div", "Test:");
  });
});
