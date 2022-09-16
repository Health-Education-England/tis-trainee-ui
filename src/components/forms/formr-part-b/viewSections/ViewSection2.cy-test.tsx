import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection2 from "./ViewSection2";
import history from "../../../navigation/history";
import ViewSectionShouldIncludeThisData, {
  ISectionDataField,
  ISectionWorkDataField,
  ViewSectionWorkShouldIncludeThisData
} from "./ViewSectionTestHelper";

const makeSectionEditButton = (section: number) => {
  return false;
};

const formDataToDisplay: ISectionDataField[] = [
  { fieldName: "sicknessAbsence", format: "" },
  { fieldName: "parentalLeave", format: "" },
  { fieldName: "careerBreaks", format: "" },
  { fieldName: "paidLeave", format: "" },
  { fieldName: "unauthorisedLeave", format: "" },
  { fieldName: "otherLeave", format: "" },
  { fieldName: "totalLeave", format: "" }
];

const formDataWorkToDisplay: ISectionWorkDataField[] = [
  { fieldName: "typeOfWork", format: "" },
  { fieldName: "trainingPost", format: "" },
  { fieldName: "startDate", format: "LocalDate" },
  { fieldName: "endDate", format: "LocalDate" },
  { fieldName: "site", format: "" },
  { fieldName: "siteLocation", format: "" }
];

describe("View", () => {
  const formData = submittedFormRPartBs[0];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection2 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader2]")
      .should("exist")
      .should("include.text", "Section 2:");
  });

  it("should render correct form data", () => {
    ViewSectionShouldIncludeThisData(formDataToDisplay, formData);
    formData.work.map((w, i) => {
      ViewSectionWorkShouldIncludeThisData(formDataWorkToDisplay, w);
    });
  });
});
