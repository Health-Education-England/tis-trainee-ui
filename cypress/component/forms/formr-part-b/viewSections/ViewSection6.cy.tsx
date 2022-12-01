/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import React from "react";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../../src/redux/store/store";
import ViewSection6 from "../../../../../src/components/forms/formr-part-b/viewSections/ViewSection6";
import history from "../../../../../src/components/navigation/history";
import { FormRPartB } from "../../../../../src/models/FormRPartB";
import {
  makeSectionEditButton,
  formData
} from "../../../../../src/components/forms/formr-part-b/viewSections/ViewSectionTestHelper";

type formRBSub6 = Pick<FormRPartB, "compliments">;

const formDataToDisplay: formRBSub6 = {
  compliments: formData.compliments
};

describe("View", () => {
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection6 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader6]")
      .should("exist")
      .should("include.text", "Section 6:");
  });

  it("should render correct form data", () => {
    cy.testData(formDataToDisplay);
  });
});
