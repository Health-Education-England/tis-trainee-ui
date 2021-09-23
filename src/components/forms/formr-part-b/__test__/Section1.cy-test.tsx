import { mount } from "@cypress/react";
import Section1 from "../Sections/Section1";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import { beforeEach } from "mocha";
describe("Section 2", () => {
  beforeEach(() => {
    const props = {
      formData: submittedFormRPartBs[0],
      localOffices: [],
      designatedBodies: [
        {
          tisId: "1",
          label: "Northern Ireland Medical and Dental Training Agency",
          value: "Northern Ireland Medical and Dental Training Agency",
          type: null,
          internal: true
        },
        {
          tisId: "2",
          label: "Health Education England Wessex",
          value: "Health Education England Wessex",
          type: null,
          internal: true
        },
        {
          tisId: "3",
          label: "Health Education England Thames Valley",
          value: "Health Education England Thames Valley",
          type: null,
          internal: false
        },
        {
          tisId: "4",
          label: "Health Education England South London",
          value: "Health Education England South London",
          type: null,
          internal: false
        },
        {
          tisId: "5",
          label: "Health Education England East of England",
          value: "Health Education England East of England",
          type: null,
          internal: false
        }
      ],
      curricula: [],
      nextSection: cy.stub(),
      previousSection: cy.stub(),
      saveDraft: cy.stub(),
      section: 0
    };
    mount(<Section1 {...props} />);
  });

  it("should not display 'other' Autocomplete box until 'other' opiton selected in 'Previous Designated Body'", () => {
    cy.get("#prevRevalBody").should("exist");
    cy.get("#prevRevalBodyOther").should("not.exist");
    cy.get("#prevRevalBody").select("other");
    cy.get("#prevRevalBodyOther").should("exist");
  });

  it("should only find internal Designated Bodies in 'Previous Designated Body' inputField", () => {
    cy.get("#prevRevalBody").should("exist");
    cy.get("#prevRevalBody").select("Health Education England Wessex");
    cy.get("#prevRevalBody").should(
      "have.value",
      "Health Education England Wessex"
    );
    cy.get("#prevRevalBody").should(
      "not.have.value",
      "Health Education England Thames Valley"
    );
  });

  it("should only find external Designated Bodies in 'other' AutoComplete", () => {
    cy.get("#prevRevalBody").select("other");
    cy.get("#prevRevalBodyOther").should("exist");
    cy.get("#prevRevalBodyOther").clear().type("Thames");
    cy.get("#prevRevalBodyOther + ul li").first().click();
    cy.get("#prevRevalBodyOther").should(
      "have.value",
      "Health Education England Thames Valley"
    );
    cy.get("#prevRevalBodyOther").clear().type("Wessex");
    cy.get("#prevRevalBodyOther + ul li").should("not.exist");
  });
});
