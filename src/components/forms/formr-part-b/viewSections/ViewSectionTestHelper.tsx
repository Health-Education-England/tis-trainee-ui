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

type FormRPartBKeys = keyof FormRPartB;
type FormRPartBWorkKeys = keyof Work;
type FormRPartBDeclarationKeys = keyof Declaration;
type FormRPartBCovidDeclarationKeys = keyof CovidDeclaration;

interface ISectionDataField {
  fieldName: FormRPartBKeys;
  format: string;
}

interface ISectionWorkDataField {
  fieldName: FormRPartBWorkKeys;
  format: string;
}

interface ISectionDeclarationDataField {
  fieldName: FormRPartBDeclarationKeys;
  format: string;
}

interface ISectionCovidDeclarationDataField {
  fieldName: FormRPartBCovidDeclarationKeys;
  format: string;
}

export interface ISectionSomeDataField {
  fieldName:
    | FormRPartBKeys
    | FormRPartBWorkKeys
    | FormRPartBDeclarationKeys
    | FormRPartBCovidDeclarationKeys;
  format: string;
}

export default function CheckDataIsDisplayed(
  formDataToDisplay: ISectionSomeDataField[],
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
