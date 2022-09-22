// load type definitions that come with Cypress module
/// <reference types="cypress" />

import day from "dayjs";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";
import { DateUtilities } from "../../../../utilities/DateUtilities";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";

const isDateType = (value: any) =>
  !!value && day(value).isValid() && value.toString().indexOf("-") > -1;

export const testData = (dataToTest: any, index?: number) =>
  Object.entries(dataToTest).map(([key, val]: [key: string, val: any]) => {
    const cyDataRef = index && index >= 0 ? `${key}${index}` : key;
    if (val && isDateType(val)) {
      const formattedDate = DateUtilities.ToLocalDate(val.toString());
      cy.get(`[data-cy=${cyDataRef}]`).contains(formattedDate);
    } else if (typeof val === "number") {
      cy.get(`[data-cy=${cyDataRef}]`).contains(val);
    } else if (typeof val === "boolean") {
      cy.get(`[data-cy=${cyDataRef}]`).contains(BooleanUtilities.ToYesNo(val));
    } else if (val) {
      cy.get(`[data-cy=${cyDataRef}]`).contains(val.toString());
    }
  });

export const makeSectionEditButton = (_section: number) => false;
export const formData = submittedFormRPartBs[0];
