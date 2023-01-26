import React from "react";
/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../../redux/store/store";
import ViewSection4 from "../../../../../components/forms/formr-part-b/viewSections/ViewSection4";
import history from "../../../../../components/navigation/history";
import { FormRPartB } from "../../../../../models/FormRPartB";
import {
  makeSectionEditButton,
  formData
} from "../../../../../components/forms/formr-part-b/viewSections/ViewSectionTestHelper";

const prevDecs = formData.previousDeclarations;

type formRBSub4 = Pick<
  FormRPartB,
  | "havePreviousDeclarations"
  | "havePreviousUnresolvedDeclarations"
  | "previousDeclarationSummary"
>;

const formDataToDisplay: formRBSub4 = {
  havePreviousDeclarations: formData.havePreviousDeclarations,
  havePreviousUnresolvedDeclarations:
    formData.havePreviousUnresolvedDeclarations,
  previousDeclarationSummary: formData.previousDeclarationSummary
};

describe("View", () => {
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection4 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader4]")
      .should("exist")
      .should("include.text", "Section 4:");
  });

  it("should render correct form data", () => {
    cy.testData(formDataToDisplay);
  });

  it("should render the correct declaration data", () => {
    prevDecs.forEach((decObj, index) => cy.testData(decObj, index + 1));
  });
});

describe("View with previous unresolved declaration", () => {
  const formDataWithPrevUnresolved = {
    ...formData,
    havePreviousUnresolvedDeclarations: true
  };
  const viewSectionProps = {
    makeSectionEditButton,
    formDataWithPrevUnresolved
  };

  it("should show previous declaration summary", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection4
            formData={formDataWithPrevUnresolved}
            {...viewSectionProps}
          />
        </Router>
      </Provider>
    );

    cy.get("[data-cy=previousDeclarationSummary]").should("exist");
  });
});

describe("View without previous unresolved declaration", () => {
  const formDataWithoutPrevUnresolved = {
    ...formData,
    havePreviousUnresolvedDeclarations: false
  };
  const viewSectionProps = {
    makeSectionEditButton,
    formDataWithoutPrevUnresolved
  };

  it("should not show previous declaration summary", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection4
            formData={formDataWithoutPrevUnresolved}
            {...viewSectionProps}
          />
        </Router>
      </Provider>
    );

    cy.get("[data-cy=previousDeclarationSummary]").should("not.exist");
  });
});
