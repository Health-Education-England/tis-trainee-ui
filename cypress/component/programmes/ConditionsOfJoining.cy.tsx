import { mount } from "cypress/react18";
import React from "react";
import { COJ_EPOCH } from "../../../utilities/Constants";
import { ConditionsOfJoining } from "../../../components/programmes/ConditionsOfJoining";
import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../../models/ProgrammeMembership";
import { DateUtilities } from "../../../utilities/DateUtilities";

describe("ConditionsOfJoining", () => {
  beforeEach(() => {
    cy.clock(COJ_EPOCH);
  });

  describe("when COJ signed", () => {
    const conditionsOfJoining = {
      signedAt: COJ_EPOCH,
      version: "GG8"
    } as ConditionsOfJoiningModel;

    it("should display signed COJ fields", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={COJ_EPOCH.toISOString()}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=signedCoj]").should("exist");
    });

    it("should not display unsigned COJ fields", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={COJ_EPOCH.toISOString()}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=unsignedCoj]").should("not.exist");
    });

    it("should display signed date", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={COJ_EPOCH.toISOString()}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=cojSignedDate]")
        .should("exist")
        .and("have.text", DateUtilities.ToLocalDate(COJ_EPOCH));
    });

    it("should display signed gold guide version when GGxx format", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={COJ_EPOCH.toISOString()}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=cojSignedVersion]")
        .should("exist")
        .and("have.text", "Gold Guide 8");
    });

    it("should display unknown version when not GGxx format", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={{ ...conditionsOfJoining, version: "v123" }}
          startDate={COJ_EPOCH.toISOString()}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=cojSignedVersion]")
        .should("exist")
        .and("have.text", "Unknown");
    });
  });

  describe("when COJ not signed", () => {
    const conditionsOfJoining = {
      signedAt: null,
      version: "GG8"
    } as ConditionsOfJoiningModel;

    it("should display unsigned COJ fields", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={COJ_EPOCH.toISOString()}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=unsignedCoj]").should("exist");
    });

    it("should not display signed COJ fields", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={COJ_EPOCH.toISOString()}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=signedCoj]").should("not.exist");
    });

    it("should show unknown status when no start date", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={null}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=cojStatusText]")
        .should("exist")
        .and("have.text", "Unknown status");
    });

    it("should show submitted to LO when start date before COJ epoch", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={new Date(
            COJ_EPOCH.getTime() - 24 * 60 * 60 * 1000
          ).toISOString()}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=cojStatusText]")
        .should("exist")
        .and("have.text", "Follow Local Office process");
    });

    it("should show available signing date when start date after COJ epoch but outside 13 weeks", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={new Date(
            COJ_EPOCH.getTime() + 14 * 7 * 24 * 60 * 60 * 1000
          ).toISOString()}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=cojStatusText]")
        .should("exist")
        .and(
          "have.text",
          `Not signed, available from ${DateUtilities.ToLocalDate(
            new Date(COJ_EPOCH.getTime() + 7 * 24 * 60 * 60 * 1000)
          )}`
        );
    });

    it("should show not signed when start date after COJ epoch and inside 13 weeks", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={COJ_EPOCH.toISOString()}
          programmeMembershipId={""}
          programmeName={""}
        />
      );

      cy.get("[data-cy=cojStatusText]")
        .should("exist")
        .and("have.text", "Not signed");
    });

    it("should allow signing when start date after COJ epoch and inside 13 weeks", () => {
      mount(
        <ConditionsOfJoining
          conditionsOfJoining={conditionsOfJoining}
          startDate={COJ_EPOCH.toISOString()}
          programmeMembershipId={"1"}
          programmeName={"pmName"}
        />
      );

      cy.get("[data-cy=cojSignBtn-1]").should("exist");
    });
  });
});
