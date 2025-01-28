import React from "react";
import { mount } from "cypress/react18";
import { LtftTracker } from "../../../../components/forms/ltft/LtftTracker";
import { mockLtftsList1 } from "../../../../mock-data/mock-ltft-data";

describe("LtftTracker Component", () => {
  it("should render default LtftTracker component when no in progress Ltft applications", () => {
    mount(<LtftTracker />);
    cy.get(".tracker-container").should("exist");
    cy.get(".tracker-section-header").should("have.length", 3);
  });
  it("should render in progress LtftTracker component when DRAFT or UNSUBMITTED LTFT application exists", () => {
    mount(<LtftTracker draftOrUnsubmittedLtftSummary={mockLtftsList1[0]} />);
    cy.get(".tracker-container").should("exist");
  });

  it("should display correct icons when DRAFT or UNSUBMITTED LTFT application exists", () => {
    mount(<LtftTracker draftOrUnsubmittedLtftSummary={mockLtftsList1[0]} />);
    cy.get(".tracker-section-header").each((header, index) => {
      if (index === 2) {
        cy.wrap(header).find("svg[data-icon='clock']").should("exist");
      } else {
        cy.wrap(header).find("svg[data-icon='circle-check']").should("exist");
      }
    });
  });

  it("should display correct digits when no DRAFT/UNSUBMITTED application", () => {
    mount(<LtftTracker />);
    cy.get(".tracker-section-header").each((header, index) => {
      cy.wrap(header).contains(index + 1);
    });
  });

  it("should display correct header names", () => {
    mount(<LtftTracker />);
    const headers = ["CCT calculation", "TPD discussion", "Main application"];
    cy.get(".tracker-section-header_name").each((header, index) => {
      cy.wrap(header).contains(headers[index]);
    });
  });
});
