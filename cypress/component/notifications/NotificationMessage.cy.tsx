import { mount } from "cypress/react";
import { NotificationMessageView } from "../../../components/notifications/NotificationMessageView";

describe("NotificationMessageView", () => {
  it("renders loading state", () => {
    mount(
      <NotificationMessageView
        notificationMessageHTML=""
        notificationMessageStatus="loading"
      />
    );
    cy.get('[data-cy="loading"]').should("exist");
  });

  it("renders succeeded state with HTML content", () => {
    const html = "<p>Test notification message</p>";
    mount(
      <NotificationMessageView
        notificationMessageHTML={html}
        notificationMessageStatus="succeeded"
      />
    );
    cy.get('[data-cy="backLink-to-notifications"]').should(
      "contain",
      "Back to list"
    );
    cy.get(".nhsuk-u-margin-top-2").should(
      "contain.html",
      "<p>Test notification message</p>"
    );
  });

  it("renders error state", () => {
    mount(
      <NotificationMessageView
        notificationMessageHTML=""
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
