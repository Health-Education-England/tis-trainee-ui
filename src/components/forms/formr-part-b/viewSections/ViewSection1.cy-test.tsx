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

interface ISectionDataField {
  fieldName: string;
  format: string;
}

const formDataToDisplay: ISectionDataField[] = [
  { fieldName: "forename", format: "" },
  { fieldName: "surname", format: "" },
  { fieldName: "gmcNumber", format: "" },
  { fieldName: "email", format: "" },
  { fieldName: "localOfficeName", format: "" },
  { fieldName: "currRevalDate", format: "LocalDate" },
  { fieldName: "prevRevalDate", format: "LocalDate" },
  { fieldName: "programmeSpecialty", format: "" },
  { fieldName: "dualSpecialty", format: "" }
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
      const dataValue = formData[formDataItem.fieldName];
      if (formDataItem.format === "LocalDate") {
        const formattedDate = DateUtilities.ToLocalDate(dataValue);
        cy.get(".nhsuk-summary-list__value").should(
          "include.text",
          formattedDate
        );
      } else {
        cy.get(".nhsuk-summary-list__value").should("include.text", dataValue);
      }
    });
  });
});
