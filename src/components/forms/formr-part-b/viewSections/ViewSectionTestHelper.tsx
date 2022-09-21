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

export default function CheckDataIsDisplayed(
  formDataToDisplay:
    | ISectionDataField[]
    | ISectionWorkDataField[]
    | ISectionDeclarationDataField[]
    | ISectionCovidDeclarationDataField[],
  formData: any
) {
  formDataToDisplay.forEach(formDataItem => {
    if (formDataItem.fieldName in formData) {
      const dataValue = formData[formDataItem.fieldName];
      if (typeof dataValue !== "undefined" && dataValue) {
        if (formDataItem.format === "LocalDate") {
          const formattedDate = DateUtilities.ToLocalDate(dataValue.toString());
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
          cy.get(".nhsuk-summary-list__value").should(
            "include.text",
            dataValue
          );
        }
      }
    }
  });
}

export function ViewSectionShouldIncludeThisData(
  formDataToDisplay: ISectionDataField[],
  formData: FormRPartB
) {
  CheckDataIsDisplayed(formDataToDisplay, formData);
}

export function ViewSectionWorkShouldIncludeThisData(
  formDataToDisplay: ISectionWorkDataField[],
  formData: Work
) {
  CheckDataIsDisplayed(formDataToDisplay, formData);
}

export function ViewSectionDeclarationShouldIncludeThisData(
  formDataToDisplay: ISectionDeclarationDataField[],
  formData: Declaration
) {
  CheckDataIsDisplayed(formDataToDisplay, formData);
}

export function ViewSectionCovidDeclarationShouldIncludeThisData(
  formDataToDisplay: ISectionCovidDeclarationDataField[],
  formData: CovidDeclaration
) {
  CheckDataIsDisplayed(formDataToDisplay, formData);
}

