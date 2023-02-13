/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import React from "react";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../../redux/store/store";
import ViewSection5 from "../../../../../components/forms/formr-part-b/viewSections/ViewSection5";
import history from "../../../../../components/navigation/history";
import { FormRPartB } from "../../../../../models/FormRPartB";
import {
  makeSectionEditButton,
  formData
} from "../../../../../components/forms/formr-part-b/viewSections/ViewSectionTestHelper";

const currDecs = formData.currentDeclarations;

type formRBSub5 = Pick<
  FormRPartB,
  | "haveCurrentDeclarations"
  | "haveCurrentUnresolvedDeclarations"
  | "currentDeclarationSummary"
>;

const formDataToDisplay: formRBSub5 = {
  haveCurrentDeclarations: formData.haveCurrentDeclarations,
  haveCurrentUnresolvedDeclarations: formData.haveCurrentUnresolvedDeclarations,
  currentDeclarationSummary: formData.currentDeclarationSummary
};

describe("View", () => {
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection5 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader5]")
      .should("exist")
      .should("include.text", "Section 5:");
  });

  it("should render correct form data", () => {
    cy.testData(formDataToDisplay);
  });

  it("should render the correct declaration data", () => {
    currDecs.forEach((decObj, index) => cy.testData(decObj, index + 1));
  });
});

describe("View with current unresolved declarations", () => {
  const formDataWithCurrentUnresolved = {
    ...formData,
    haveCurrentUnresolvedDeclarations: true
  };
  const viewSectionProps = {
    makeSectionEditButton,
    formDataWithCurrentUnresolved
  };

  it("should show current declaration summary", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection5
            formData={formDataWithCurrentUnresolved}
            {...viewSectionProps}
          />
        </Router>
      </Provider>
    );

    cy.get("[data-cy=currentDeclarationSummary]").should("exist");
  });
});

describe("View without current unresolved declarations", () => {
  const formDataWithoutCurrentUnresolved = {
    ...formData,
    haveCurrentUnresolvedDeclarations: false
  };
  const viewSectionProps = {
    makeSectionEditButton,
    formDataWithoutCurrentUnresolved
  };

  it("should not show current declaration summary", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection5
            formData={formDataWithoutCurrentUnresolved}
            {...viewSectionProps}
          />
        </Router>
      </Provider>
    );

    cy.get("[data-cy=currentDeclarationSummary]").should("not.exist");
  });
});
