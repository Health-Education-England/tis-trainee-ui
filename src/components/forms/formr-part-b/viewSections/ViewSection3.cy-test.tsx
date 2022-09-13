import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection3 from "./ViewSection3";
import history from "../../../navigation/history";
import { DateUtilities } from "../../../../utilities/DateUtilities";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";

const makeSectionEditButton = (section: number) => {
  return false;
};

interface ISectionDataField {
  fieldName: string;
  format: string;
}

const formDataToDisplay: ISectionDataField[] = [
  { fieldName: "isHonest", format: "YesNo" },
  { fieldName: "isHealthy", format: "YesNo" },
  { fieldName: "isWarned", format: "YesNo" },
  { fieldName: "isComplying", format: "YesNo" },
  { fieldName: "healthStatement", format: "" }
];

describe("View", () => {
  it("should render View section heading", () => {
    const formData = submittedFormRPartBs[0];
    const viewSectionProps = { makeSectionEditButton, formData };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection3 {...viewSectionProps} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=sectionHeader3]")
      .should("exist")
      .should("include.text", "Section 3:");
  });

  it("should render correct form data", () => {
    const formData = submittedFormRPartBs[0];
    const viewSectionProps = { makeSectionEditButton, formData };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection3 {...viewSectionProps} />
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
      } else if (formDataItem.format === "YesNo") {
        const formattedBoolean = BooleanUtilities.ToYesNo(dataValue);
        cy.get(".nhsuk-summary-list__value").should(
          "include.text",
          formattedBoolean
        );
      } else {
        cy.get(".nhsuk-summary-list__value").should("include.text", dataValue);
      }
    });
  });
});
