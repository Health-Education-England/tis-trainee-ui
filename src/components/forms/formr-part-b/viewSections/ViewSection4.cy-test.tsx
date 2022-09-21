import React from "react";
import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import ViewSection4 from "./ViewSection4";
import history from "../../../navigation/history";
import { FormRPartB } from "../../../../models/FormRPartB";
import {
  testData,
  makeSectionEditButton,
  formData
} from "./ViewSectionTestHelper";

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
    testData(formDataToDisplay);
  });

  it("should render the correct declaration data", () => {
    prevDecs.map((decObj, index) => {
      testData(decObj, index + 1);
    });
  });
});

// describe("View with null dates value", () => {
//   const formData = submittedFormRPartBs[1];
//   const viewSectionProps = { makeSectionEditButton, formData };
//   beforeEach(() => {
//     mount(
//       <Provider store={store}>
//         <Router history={history}>
//           <ViewSection4 {...viewSectionProps} />
//         </Router>
//       </Provider>
//     );
//   });

//   it("should render correct form data", () => {
//     ViewSectionShouldIncludeThisData(formDataToDisplay, formData);
//   });
// });
