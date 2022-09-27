import React from "react";
import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import ViewSection8 from "./ViewSection8";
import history from "../../../navigation/history";
import { FormRPartB } from "../../../../models/FormRPartB";
import {
  testData,
  makeSectionEditButton,
  formData
} from "./ViewSectionTestHelper";

describe("View", () => {
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection8 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader8]")
      .should("exist")
      .should("include.text", "Declarations");
  });

  it("should render correct form data", () => {
    cy.get("[data-cy=declarationAccept]").should(
      "include.text",
      "This form is a true and accurate declaration"
    );
    cy.get("[data-cy=consentAccept]").should(
      "include.text",
      "I give permission for my past and present ARCP/RITA portfolios"
    );
  });
});
