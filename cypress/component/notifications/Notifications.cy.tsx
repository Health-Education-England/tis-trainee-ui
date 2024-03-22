import { mount } from "cypress/react18";
import { Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import { Authenticator } from "@aws-amplify/ui-react";
import { NotificationsBtn } from "../../../components/notifications/NotificationsBtn";

const comp = (unreadNotificationCount: number) => (
  <Authenticator.Provider>
    <Router history={history}>
      <NotificationsBtn unreadNotificationCount={unreadNotificationCount} />
    </Router>
  </Authenticator.Provider>
);

describe("Notification Icon and Badge display", () => {
  beforeEach(() => {
    cy.viewport(1024, 768);
  });

  it("should contain notification Icon & badge not exist when zero unread notifications", () => {
    mount(comp(0));
    cy.get(".notification-btn").should("be.visible");
    cy.get(".notification-badge").should("not.exist");
  });

  it("should contain notification Icon and badge when unread notifications", () => {
    mount(comp(12));
    cy.get(".notification-btn").should("be.visible");
    cy.get(".notification-badge").should("exist").should("contain", "12");
  });
});

describe("Notification display in mobile view", () => {
  beforeEach(() => {
    cy.viewport(900, 768);
  });

  it("should contain notification Icon & badge not exist when zero unread notifications", () => {
    mount(comp(0));
    cy.get(".notification-btn").should("be.visible");
    cy.get(".notification-badge").should("not.exist");
  });

  it("should contain notification Icon and badge when unread notifications", () => {
    mount(comp(12));
    cy.get(".notification-btn").should("be.visible");
    cy.get(".notification-badge").should("exist").should("contain", "12");
  });
});
