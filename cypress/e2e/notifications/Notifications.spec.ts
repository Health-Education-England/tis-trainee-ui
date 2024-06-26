/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />
import { notificationsMixedTypeData } from "../../../mock-data/notifications";

describe("Notifications", () => {
  beforeEach(() => {
    cy.signInToTss(30000, "/notifications");
    cy.intercept(
      {
        method: "GET",
        url: "api/notifications"
      },
      {
        statusCode: 200,
        body: notificationsMixedTypeData
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

  it("should filter the recived list of notifications so that only IN_APP are visiable", () => {
    cy.get('[data-cy="NotificationsTablePageSizeSelect"]').select(
      "Show 30 rows"
    );
    cy.get('[data-cy="notificationsTable"] tbody tr').should("have.length", 9);
  });
});
