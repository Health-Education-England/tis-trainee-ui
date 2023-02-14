/// <reference types="cypress" />
import dayjs from "dayjs";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      checkFormRAValues(
        dateAttained: string,
        completionDate: string,
        startDate: string,
        wholeTimeEquivalent: string
      ): Chainable<Element>;
      completeFormAPersonalDetailsSection(
        dateAttained: string
      ): Chainable<Element>;
      completeFormRAProgrammeSpecialtySection(): Chainable<Element>;
      checkAndFillSection1(
        currRevalDate: string,
        prevRevalDate: string
      ): Chainable<Element>;
      checkAndFillSection2(
        workStartDate: string,
        endDate: string
      ): Chainable<Element>;
      checkAndFillSection3(): Chainable<Element>;
      checkAndFillSection4(pastDate: string): Chainable<Element>;
      checkAndFillSection5(pastDate: string): Chainable<Element>;
      checkAndFillSection6(compliments: string): Chainable<Element>;
      checkAndFillCovidSection(): Chainable<Element>;
      addWorkPanel(startDate: string, endDate: string): Chainable<Element>;
      logout(): Chainable<Element>;
      login(): Chainable<Element>;
      checkFlags(name: string): Chainable<Element>;
      confirmCookie(): Chainable<Element>;
      signIn(): Chainable<Element>;
      getTotp(): Chainable<Element>;
      useTotp(): Chainable<Element>;
      logoutDesktop(): Chainable<Element>;
      testDataSourceLink(): Chainable<Element>;
      checkForSuccessNotif(notifType: string): Chainable<Element>;
      checkForErrorNotif(notifType: string): Chainable<Element>;
      testData(dataToTest: any, index?: number): Chainable<Element>;
    }
    interface Cypress {
      dayjs(): dayjs.Dayjs;
    }
  }
}
