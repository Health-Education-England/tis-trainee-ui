import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection2 from "./ViewSection2";
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
  { fieldName: "sicknessAbsence", format: "" },
  { fieldName: "parentalLeave", format: "" },
  { fieldName: "careerBreaks", format: "" },
  { fieldName: "paidLeave", format: "" },
  { fieldName: "unauthorisedLeave", format: "" },
  { fieldName: "otherLeave", format: "" },
  { fieldName: "totalLeave", format: "" },
  { fieldName: "dualSpecialty", format: "" }
];

const formDataWorkToDisplay: ISectionDataField[] = [
  { fieldName: "typeOfWork", format: "" },
  { fieldName: "trainingPost", format: "" },
  { fieldName: "startDate", format: "LocalDate" },
  { fieldName: "endDate", format: "LocalDate" },
  { fieldName: "site", format: "" },
  { fieldName: "siteLocation", format: "" }
];

describe("View", () => {
  it("should render View section heading", () => {
    const formData = submittedFormRPartBs[0];
    const viewSectionProps = { makeSectionEditButton, formData };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection2 {...viewSectionProps} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=sectionHeader2]")
      .should("exist")
      .should("include.text", "Section 2:");
  });

  it("should render correct form data", () => {
    const formData = submittedFormRPartBs[0];
    const viewSectionProps = { makeSectionEditButton, formData };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection2 {...viewSectionProps} />
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
    formDataWorkToDisplay.forEach(formDataItem => {
      formData.work.map((w, i) => {
        const dataValue = w[formDataItem.fieldName];
        if (formDataItem.format === "LocalDate") {
          const formattedDate = DateUtilities.ToLocalDate(dataValue);
          cy.get(".nhsuk-summary-list__value").should(
            "include.text",
            formattedDate
          );
        } else {
          cy.get(".nhsuk-summary-list__value").should(
            "include.text",
            dataValue
          );
        }
      });
    });
  });
});
