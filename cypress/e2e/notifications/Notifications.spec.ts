/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />
import { notificationsMixedTypeData } from "../../../mock-data/notifications";

describe("Notifications", () => {
  beforeEach(() => {
    cy.signInToTss(30000, "/notifications");
    cy.intercept(
      {
        method: "GET",
        url: "api/notifications?page=0&size=0&type=IN_APP"
      },
      {
        statusCode: 200,
        body: {content: notificationsMixedTypeData}
      }
    ).as("getNotifications");
    cy.wait("@getNotifications", {
      requestTimeout: 30000,
      responseTimeout: 30000
    });
  });

  it("should load the notifications page", () => {
    cy.get('[data-cy="notificationsHeading"]')
      .should("exist")
      .should("contain.text", "Notifications");
  });
});
