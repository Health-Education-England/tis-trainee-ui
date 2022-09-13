import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection1 from "./ViewSection1";
import history from "../../../navigation/history";
import { DateUtilities } from "../../../../utilities/DateUtilities";

const makeSectionEditButton = (section: number) => {
  return false;
};

const formDataToDisplay = [
  "forename",
  "surname",
  "gmcNumber",
  "email",
  "localOfficeName",
  //   "currRevalDate",
  //   "prevRevalDate",
  //FIXME: ignoring these for now, since they are actually strings not Date objects, and are formatted as LocalDates on the form
  "programmeSpecialty",
  "dualSpecialty"
];

describe("View", () => {
  it("should render View section heading", () => {
    const formData = submittedFormRPartBs[0];
    const viewSectionProps = { makeSectionEditButton, formData };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection1 {...viewSectionProps} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=sectionHeader1]")
      .should("exist")
      .should("include.text", "Section 1:");
  });

  it("should render correct form data", () => {
    const formData = submittedFormRPartBs[0];
    const viewSectionProps = { makeSectionEditButton, formData };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection1 {...viewSectionProps} />
        </Router>
      </Provider>
    );
    formDataToDisplay.forEach(formDataItem => {
      const dataValue = formData[formDataItem];
      cy.get(".nhsuk-summary-list__value").should("include.text", dataValue);
    });
  });
});
