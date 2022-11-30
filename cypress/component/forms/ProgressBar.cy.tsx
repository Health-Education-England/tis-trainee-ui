import { mount } from "cypress/react18";
import React from "react";
import ProgressBar from "../../../src/components/forms/ProgressBar";
import { FormRUtilities } from "../../../src/utilities/FormRUtilities";

describe("ProgressBar", () => {
  it("should not render any steps if no sections are provided", () => {
    mount(<ProgressBar section={1} sections={[]} />);
    cy.get(".progress-step").should("not.exist");
  });
  it("should render stepper at section 7 if covid flag is set to true", () => {
    const sections = FormRUtilities.makeFormRBSections(true);
    mount(<ProgressBar section={7} sections={sections} />);
    cy.get(".progress-step")
      .eq(6)
      .should("exist")
      .should("have.class", "progress-step-active");
    cy.get(".progress-step")
      .eq(0)
      .should("exist")
      .should("have.class", "progress-step");
  });
  it("should not render stepper with covid section 7 if covid flag set to false.", () => {
    const sections = FormRUtilities.makeFormRBSections(false);
    mount(<ProgressBar section={1} sections={sections} />);
    cy.get(".progress-step")
      .eq(0)
      .should("exist")
      .should("have.class", "progress-step-active");
    cy.get(".progress-step").eq(6).should("not.exist");
  });
});
