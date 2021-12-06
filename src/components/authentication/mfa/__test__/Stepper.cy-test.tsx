import React from "react";
import { Stepper, Step } from "../Stepper";
import { mount } from "@cypress/react";

interface IStep {
  title: string;
  disableNextButton: boolean;
  disableBackButton: boolean;
  content: string;
}
const initialSteps: IStep[] = [
  {
    title: "First step",
    disableNextButton: false,
    disableBackButton: false,
    content: "First step content."
  },
  {
    title: "Second step",
    disableNextButton: false,
    disableBackButton: false,
    content: "Second step content."
  },
  {
    title: "Third title",
    disableNextButton: false,
    disableBackButton: false,
    content: "Third step content."
  }
];

const getComponent = (steps = initialSteps, initialStep = 0): JSX.Element => {
  const stepElements = steps.map((step: IStep) => (
    <Step
      disableNextButton={step.disableNextButton}
      disableBackButton={step.disableBackButton}
      title={step.title}
    >
      <p>{step.content}</p>
    </Step>
  ));

  return <Stepper currentStep={initialStep}>{stepElements}</Stepper>;
};
describe("Stepper component", () => {
  it("Should mount ", () => {
    mount(getComponent());
    cy.get("ol").should("exist");
  });
  it("Should contain 3 steps ", () => {
    mount(getComponent());
    cy.get("li").should("have.length", 3);
  });

  it("Should display only the first step content ", () => {
    mount(getComponent());
    cy.get("li").first().get("div.step-content").should("exist");
    cy.get("div.step-content").should("have.length", 1);
  });

  it("Clicking 'Continue' button should display only the second step content ", () => {
    mount(getComponent());
    cy.get("button.btnNext").first().click();
    cy.get("div.step-content").should("have.length", 1);
    cy.get("div.step-content").should("contain", "Second step content.");
  });

  it("Clicking 'Previous' button should display only the first step content.", () => {
    mount(getComponent());
    cy.get("button.btnNext").first().click();
    cy.get("div.step-content").should("have.length", 1);
    cy.get("button.btnPrevious").first().click();
    cy.get("div.step-content").should("have.length", 1);
    cy.get("div.step-content").should("contain", "First step content.");
  });

  it("Should disable next button when property set on step. ", () => {
    mount(
      getComponent([
        {
          title: "First step",
          disableNextButton: true,
          disableBackButton: false,
          content: "First step content."
        },
        {
          title: "Second step",
          disableNextButton: false,
          disableBackButton: false,
          content: "Second step content."
        }
      ])
    );
    cy.get("button.btnNext").first().should("be.disabled");
  });

  it("Should disable previous button property set on step. ", () => {
    mount(
      getComponent([
        {
          title: "First step",
          disableNextButton: false,
          disableBackButton: false,
          content: "First step content."
        },
        {
          title: "Second step",
          disableNextButton: false,
          disableBackButton: true,
          content: "Second step content."
        }
      ])
    );
    cy.get("button.btnNext").first().click();
    cy.get("button.btnPrevious").first().should("be.disabled");
  });
});
