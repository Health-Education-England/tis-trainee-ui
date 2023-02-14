/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import React from "react";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../../redux/store/store";
import ViewSection3 from "../../../../../components/forms/formr-part-b/viewSections/ViewSection3";
import history from "../../../../../components/navigation/history";
import {
  makeSectionEditButton,
  formData
} from "../../../../../components/forms/formr-part-b/viewSections/ViewSectionTestHelper";
import { FormRPartB } from "../../../../../models/FormRPartB";

type formRBSub3 = Pick<
  FormRPartB,
  "isHonest" | "isHealthy" | "isWarned" | "isComplying" | "healthStatement"
>;

const formDataToDisplay: formRBSub3 = {
  isHonest: formData.isHonest,
  isHealthy: formData.isHealthy,
  isWarned: formData.isWarned,
  isComplying: formData.isComplying,
  healthStatement: formData.healthStatement
};

describe("View", () => {
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection3 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader3]")
      .should("exist")
      .should("include.text", "Section 3:");
  });

  it("should render correct form data", () => {
    cy.testData(formDataToDisplay);
  });
});
