/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />
import { notificationsMixedTypeData } from "../../../mock-data/notifications";

describe("No notification", () => {
  beforeEach(() => {
    cy.signInToTss(300, "/notifications");
    cy.intercept(
      {
        method: "GET",
        url: "api/notifications?page=0&size=0&type=IN_APP"
      },
      {
        statusCode: 200,
        body: [] // No returned notifications
      }
    ).as("getNotifications");
    cy.wait("@getNotifications", {
      requestTimeout: 30000,
      responseTimeout: 30000
    });
  });

  it("should show no notification message when notification is empty", () => {  
      cy.get('[data-cy="notificationsTableNoNotifs"]').should("exist");
  });
});

describe("Notifications", () => {
  beforeEach(() => {
    cy.signInToTss(300, "/notifications");
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

  it("should load IN_APP notifications table if filter is on even when notification is empty", () => {
    cy.get('[data-cy="notificationsHeading"]')
      .should("exist")
      .should("contain.text", "In-app Notifications");

      cy.intercept("GET", "api/notifications?page=0&size=0&type=IN_APP&status=UNREAD", {
        statusCode: 200,
        body: [] // No returned notifications
      }).as("getUnreadNotificationsEmpty");
          
      cy.get('#unreadCheck').check({ force: true });
      cy.wait("@getUnreadNotificationsEmpty", {
        requestTimeout: 30000,
        responseTimeout: 30000
      });
  
      cy.get('[data-cy="notificationsTable"]').should("exist");
  });

  it("should load EMAIL notifications table if filter is on even when notification is empty", () => {    
    cy.get(':nth-child(2) > [data-cy="emailBtn"]').click();
    cy.get('[data-cy="notificationsHeading"]')
      .should("exist")
      .should("contain.text", "Email Notifications");

      cy.intercept("GET", "api/notifications?page=0&size=0&type=EMAIL&status=FAILED", {
        statusCode: 200,
        body: [] // No returned notifications
      }).as("getUnreadNotificationsEmpty");
          
      cy.get('#failedCheck').check({ force: true });
      cy.wait("@getUnreadNotificationsEmpty", {
        requestTimeout: 30000,
        responseTimeout: 30000
      });
  
      cy.get('[data-cy="notificationsTable"]').should("exist");
  });
});