/// <reference types="cypress" />
/// <reference path="../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import { ConditionsOfJoining } from "../../../components/programmes/ConditionsOfJoining";
import { COJ_EPOCH } from "../../../utilities/Constants";
import { DateUtilities } from "../../../utilities/DateUtilities";

describe("ConditionsOfJoining", () => {
  beforeEach(() => {
    cy.clock(COJ_EPOCH);
  });
  const programmeMembershipId = "123";
  const programmeName = "Test Programme";

  const epochStartDateString = COJ_EPOCH.toISOString();
  const beforeEpochDate = new Date(COJ_EPOCH.getTime() - 24 * 60 * 60 * 1000);
  const beforeEpochDateString = beforeEpochDate.toISOString();

  it("displays 'Unknown status' when startDate is null", () => {
    mount(
      <MemoryRouter>
        <ConditionsOfJoining
          conditionsOfJoining={{ signedAt: null, version: "GG10" }}
          startDate={null}
          programmeMembershipId={programmeMembershipId}
          programmeName={programmeName}
        />
      </MemoryRouter>
    );

    cy.contains("Unknown status");
  });

  it("displays 'Follow Local Office process' when startDate is before COJ_EPOCH", () => {
    mount(
      <MemoryRouter>
        <ConditionsOfJoining
          conditionsOfJoining={{ signedAt: null, version: "GG10" }}
          startDate={beforeEpochDateString}
          programmeMembershipId={programmeMembershipId}
          programmeName={programmeName}
        />
      </MemoryRouter>
    );

    cy.contains("Follow Local Office process");
  });

  it("displays 'Sign' link when not signed and startDate is on or after COJ_EPOCH", () => {
    mount(
      <MemoryRouter>
        <ConditionsOfJoining
          conditionsOfJoining={{ signedAt: null, version: "GG10" }}
          startDate={epochStartDateString}
          programmeMembershipId={programmeMembershipId}
          programmeName={programmeName}
        />
      </MemoryRouter>
    );

    cy.get(`[data-cy="cojViewBtn-${programmeMembershipId}"]`).contains("Sign");
    cy.get(`[data-cy="cojSignedDate"]`).should("not.exist");
    cy.get(`[data-cy="cojSignedVersion"]`).should("not.exist");
  });

  it("displays signed information and 'View' link when signed and startDate is on or after COJ_EPOCH", () => {
    const signedDate = "2023-03-02T01:00:00Z";
    mount(
      <MemoryRouter>
        <ConditionsOfJoining
          conditionsOfJoining={{
            signedAt: new Date(signedDate),
            version: "GG10"
          }}
          startDate={epochStartDateString}
          programmeMembershipId={programmeMembershipId}
          programmeName={programmeName}
        />
      </MemoryRouter>
    );

    cy.get(`[data-cy="cojSignedDate"]`).contains(
      `Signed: ${DateUtilities.ConvertToLondonTime(signedDate)}`
    );
    cy.get(`[data-cy="cojSignedVersion"]`).contains("Version: Gold Guide 10");
    cy.get(`[data-cy="cojViewBtn-${programmeMembershipId}"]`).contains("View");
  });
});
