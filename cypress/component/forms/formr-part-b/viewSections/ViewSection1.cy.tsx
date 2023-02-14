/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../../redux/store/store";
import ViewSection1 from "../../../../../components/forms/formr-part-b/viewSections/ViewSection1";
import history from "../../../../../components/navigation/history";
import {
  makeSectionEditButton,
  formData
} from "../../../../../components/forms/formr-part-b/viewSections/ViewSectionTestHelper";
import React from "react";
import { FormRPartB } from "../../../../../models/FormRPartB";

type formRBSub = Pick<
  FormRPartB,
  | "forename"
  | "surname"
  | "gmcNumber"
  | "email"
  | "localOfficeName"
  | "currRevalDate"
  | "prevRevalDate"
  | "programmeSpecialty"
  | "dualSpecialty"
>;

const formDataToDisplay: formRBSub = {
  forename: formData.forename,
  surname: formData.surname,
  gmcNumber: formData.gmcNumber,
  email: formData.email,
  localOfficeName: formData.localOfficeName,
  currRevalDate: formData.currRevalDate,
  prevRevalDate: formData.prevRevalDate,
  programmeSpecialty: formData.programmeSpecialty,
  dualSpecialty: formData.dualSpecialty
};

describe("View1", () => {
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection1 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader1]")
      .should("exist")
      .should("include.text", "Section 1:");
  });

  it("should render correct form data", () => {
    cy.testData(formDataToDisplay);
  });
});

describe("View with null prevRevalDate value", () => {
  const formDataWithNullDate = {
    ...formData,
    prevRevalDate: null
  };
  const viewSectionProps = { makeSectionEditButton, formDataWithNullDate };

  const formDataToDisplayNullDate = {
    ...formDataToDisplay,
    prevRevalDate: null
  };

  it("should render correct form data", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection1 formData={formDataWithNullDate} {...viewSectionProps} />
        </Router>
      </Provider>
    );

    cy.testData(formDataToDisplayNullDate);
  });
});

describe("View with other previous revalidation body", () => {
  const formDataWithPrevReval = {
    ...formData,
    prevRevalBodyOther: "Sarnia Yachts Management (UK) Limited"
  };
  const viewSectionProps = { makeSectionEditButton, formDataWithPrevReval };

  it("should not show other previous revalidation body", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection1
            formData={formDataWithPrevReval}
            {...viewSectionProps}
          />
        </Router>
      </Provider>
    );

    cy.get("[data-cy=prevRevalBodyOther]").should("exist");
  });
});

describe("View with no other previous revalidation body", () => {
  const formDataWithoutPrevReval = { ...formData, prevRevalBodyOther: "" };
  const viewSectionProps = { makeSectionEditButton, formDataWithoutPrevReval };

  it("should not show other previous revalidation body", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection1
            formData={formDataWithoutPrevReval}
            {...viewSectionProps}
          />
        </Router>
      </Provider>
    );

    cy.get("[data-cy=prevRevalBodyOther]").should("not.exist");
  });
});
