/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import React from "react";
import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import ViewSection2 from "./ViewSection2";
import history from "../../../navigation/history";
import { FormRPartB } from "../../../../models/FormRPartB";
import { makeSectionEditButton, formData } from "./ViewSectionTestHelper";

const workData = formData.work;

type formRBSub2 = Pick<
  FormRPartB,
  | "sicknessAbsence"
  | "parentalLeave"
  | "careerBreaks"
  | "paidLeave"
  | "unauthorisedLeave"
  | "otherLeave"
  | "totalLeave"
>;

const formDataToDisplay: formRBSub2 = {
  sicknessAbsence: formData.sicknessAbsence,
  parentalLeave: formData.parentalLeave,
  careerBreaks: formData.careerBreaks,
  paidLeave: formData.paidLeave,
  unauthorisedLeave: formData.unauthorisedLeave,
  otherLeave: formData.otherLeave,
  totalLeave: formData.totalLeave
};

describe("View", () => {
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection2 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader2]")
      .should("exist")
      .should("include.text", "Section 2:");
  });

  it("should render the correct form data", () => {
    cy.testData(formDataToDisplay);
  });

  it("should render the correct work data", () => {
    workData.map((workObj, index) => {
      cy.testData(workObj, index + 1);
    });
  });
});
