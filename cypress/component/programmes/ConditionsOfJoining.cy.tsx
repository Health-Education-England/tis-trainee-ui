import { mount } from "cypress/react";
import React from "react";
import { COJ_EPOCH } from "../../../utilities/Constants";
import { ConditionsOfJoining } from "../../../components/programmes/ConditionsOfJoining";
import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../../models/ProgrammeMembership";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { BrowserRouter } from "react-router-dom";

describe("ConditionsOfJoining", () => {
  beforeEach(() => {
    cy.clock(COJ_EPOCH);
  });

  describe("when COJ signed", () => {
    const conditionsOfJoining = {
      signedAt: COJ_EPOCH,
      version: "GG9"
    } as ConditionsOfJoiningModel;

    it("should only display signed COJ fields", () => {
      mount(
        <BrowserRouter>
          <ConditionsOfJoining
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            programmeMembershipId={"1"}
            programmeName={""}
          />
        </BrowserRouter>
      );

      cy.get("[data-cy=cojSignedDate]")
        .should("exist")
        .and(
          "have.text",
          `Signed: ${DateUtilities.ConvertToLondonTime(COJ_EPOCH)}`
        );
      cy.get("[data-cy=cojSignedVersion]").should("exist");
      cy.get("[data-cy=cojViewBtn-1]").should("exist");
      cy.get("[data-cy=cojStatusText]").should("not.exist");
      cy.get("[data-cy=cojSignBtn-1]").should("not.exist");
    });

    it("should display signed gold guide version when GGxx format", () => {
      mount(
        <BrowserRouter>
          <ConditionsOfJoining
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            programmeMembershipId={""}
            programmeName={""}
          />
        </BrowserRouter>
      );

      cy.get("[data-cy=cojSignedVersion]")
        .should("exist")
        .and("have.text", "Version: Gold Guide 9");
    });
  });

  describe("when COJ not signed", () => {
    const conditionsOfJoining = {
      signedAt: null,
      version: "GG10"
    } as ConditionsOfJoiningModel;

    it("should display unsigned COJ fields", () => {
      mount(
        <BrowserRouter>
          <ConditionsOfJoining
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            programmeMembershipId={"1"}
            programmeName={""}
          />
        </BrowserRouter>
      );
      cy.get("[data-cy=cojStatusText]").should("exist");
      cy.get("[data-cy=cojSignBtn-1]").should("exist");
      cy.get("[data-cy=cojSignedDate]").should("not.exist");
      cy.get("[data-cy=cojSignedVersion]").should("not.exist");
      cy.get("[data-cy=cojViewBtn-1]").should("not.exist");
    });

    it("should show unknown status when no start date", () => {
      mount(
        <BrowserRouter>
          <ConditionsOfJoining
            conditionsOfJoining={conditionsOfJoining}
            startDate={null}
            programmeMembershipId={""}
            programmeName={""}
          />
        </BrowserRouter>
      );

      cy.get("[data-cy=cojStatusText]")
        .should("exist")
        .and("have.text", "Unknown status");
    });

    it("should show submitted to LO when start date before COJ epoch", () => {
      mount(
        <BrowserRouter>
          <ConditionsOfJoining
            conditionsOfJoining={conditionsOfJoining}
            startDate={new Date(
              COJ_EPOCH.getTime() - 24 * 60 * 60 * 1000
            ).toISOString()}
            programmeMembershipId={""}
            programmeName={""}
          />
        </BrowserRouter>
      );

      cy.get("[data-cy=cojStatusText]")
        .should("exist")
        .and("have.text", "Follow Local Office process");
    });

    it("should show not signed when start date after COJ epoch", () => {
      mount(
        <BrowserRouter>
          <ConditionsOfJoining
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            programmeMembershipId={""}
            programmeName={""}
          />
        </BrowserRouter>
      );

      cy.get("[data-cy=cojStatusText]")
        .should("exist")
        .and("have.text", "Not signed");
    });

    it("should allow signing when start date after COJ epoch", () => {
      mount(
        <BrowserRouter>
          <ConditionsOfJoining
            conditionsOfJoining={conditionsOfJoining}
            startDate={COJ_EPOCH.toISOString()}
            programmeMembershipId={"1"}
            programmeName={"pmName"}
          />
        </BrowserRouter>
      );

      cy.get("[data-cy=cojSignBtn-1]").should("exist");
    });
  });
});
