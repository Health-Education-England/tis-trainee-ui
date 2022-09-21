import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import ViewSection1 from "./ViewSection1";
import history from "../../../navigation/history";
import {
  testData,
  makeSectionEditButton,
  formData
} from "./ViewSectionTestHelper";
import React from "react";
import { FormRPartB } from "../../../../models/FormRPartB";

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
    testData(formDataToDisplay);
  });
});

// describe("View with null dates value", () => {
//   const formData = submittedFormRPartBs[1];
//   const viewSectionProps = { makeSectionEditButton, formData };
//   beforeEach(() => {
//     mount(
//       <Provider store={store}>
//         <Router history={history}>
//           <ViewSection1 {...viewSectionProps} />
//         </Router>
//       </Provider>
//     );
//   });

//   it("should render correct form data", () => {
//     ViewSectionShouldIncludeThisData(formDataToDisplay, formData);
//   });
// });
