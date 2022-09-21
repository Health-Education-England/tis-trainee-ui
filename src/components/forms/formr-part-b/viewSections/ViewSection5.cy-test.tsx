import React from "react";
import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import ViewSection5 from "./ViewSection5";
import history from "../../../navigation/history";
import { FormRPartB } from "../../../../models/FormRPartB";
import {
  testData,
  makeSectionEditButton,
  formData
} from "./ViewSectionTestHelper";

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
    testData(formDataToDisplay);
  });

  it("should render the correct declaration data", () => {
    currDecs.map((decObj, index) => {
      testData(decObj, index + 1);
    });
  });
});
