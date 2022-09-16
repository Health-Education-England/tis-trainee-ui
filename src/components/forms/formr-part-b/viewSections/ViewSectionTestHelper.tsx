// load type definitions that come with Cypress module
/// <reference types="cypress" />
import {
  FormRPartB,
  Work,
  Declaration,
  CovidDeclaration
} from "../../../../models/FormRPartB";
import { DateUtilities } from "../../../../utilities/DateUtilities";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";

type FormRPartBField = keyof FormRPartB;
type FormRPartBWorkField = keyof Work;
type FormRPartBDeclarationField = keyof Declaration;
type FormRPartBCovidDeclarationField = keyof CovidDeclaration;

export interface ISectionDataField {
  fieldName: FormRPartBField;
  format: string;
}

export interface ISectionWorkDataField {
  fieldName: FormRPartBWorkField;
  format: string;
}

export interface ISectionDeclarationDataField {
  fieldName: FormRPartBDeclarationField;
  format: string;
}

export interface ISectionCovidDeclarationDataField {
  fieldName: FormRPartBCovidDeclarationField;
  format: string;
}

function CheckDataIsDisplayed(dataValue: any, format: string) {
  if (typeof dataValue !== "undefined" && dataValue) {
    if (format === "LocalDate") {
      const formattedDate = DateUtilities.ToLocalDate(dataValue.toString());
      cy.get(".nhsuk-summary-list__value").should(
        "include.text",
        formattedDate
      );
    } else if (format === "YesNo") {
      const formattedBoolean = BooleanUtilities.ToYesNo(dataValue);
      cy.get(".nhsuk-summary-list__value").should(
        "include.text",
        formattedBoolean
      );
    } else {
      cy.get(".nhsuk-summary-list__value").should("include.text", dataValue);
    }
  }
}

export function ViewSectionShouldIncludeThisData(
  formDataToDisplay: ISectionDataField[],
  formData: FormRPartB
) {
  formDataToDisplay.forEach(formDataItem => {
    if (formDataItem.fieldName in formData) {
      CheckDataIsDisplayed(
        formData[formDataItem.fieldName],
        formDataItem.format
      );
    }
  });
}

export function ViewSectionWorkShouldIncludeThisData(
  formDataToDisplay: ISectionWorkDataField[],
  formData: Work
) {
  formDataToDisplay.forEach(formDataItem => {
    if (formDataItem.fieldName in formData) {
      CheckDataIsDisplayed(
        formData[formDataItem.fieldName],
        formDataItem.format
      );
    }
  });
}

export function ViewSectionDeclarationShouldIncludeThisData(
  formDataToDisplay: ISectionDeclarationDataField[],
  formData: Declaration
) {
  formDataToDisplay.forEach(formDataItem => {
    if (formDataItem.fieldName in formData) {
      CheckDataIsDisplayed(
        formData[formDataItem.fieldName],
        formDataItem.format
      );
    }
  });
}

export function ViewSectionCovidDeclarationShouldIncludeThisData(
  formDataToDisplay: ISectionCovidDeclarationDataField[],
  formData: CovidDeclaration
) {
  formDataToDisplay.forEach(formDataItem => {
    if (formDataItem.fieldName in formData) {
      CheckDataIsDisplayed(
        formData[formDataItem.fieldName],
        formDataItem.format
      );
    }
  });
}

export default ViewSectionShouldIncludeThisData;
