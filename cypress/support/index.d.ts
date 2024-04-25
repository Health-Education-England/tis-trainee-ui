/// <reference types="cypress" />
import dayjs from "dayjs";
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      checkAndFillFormASection1(): Chainable<Element>;
      checkAndFillFormASection2(): Chainable<Element>;
      checkAndFillFormASection3(): Chainable<Element>;
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
      checkForRecentForm(): Chainable<Element>;
      addWorkPanel(startDate: string, endDate: string): Chainable<Element>;
      checkFlags(name: string): Chainable<Element>;
      checkViewFields(fields: string[][]): Chainable<Element>;
      clickSelect(
        selectorBeginningSegment: string,
        text: string | null,
        useFirst: boolean
      ): Chainable<Element>;
      clearAndType(selector: string, text: string): Chainable<Element>;
      clickRadioCheck(selector: string): Chainable<Element>;
      confirmCookie(): Chainable<Element>;
      navigateBackToConfirm(steps: number): Chainable<Element>;
      navNext(forceClick?: boolean): Chainable<Element>;
      signIn(): Chainable<Element>;
      signInToTss(
        waitTimeMs?: number,
        visitUrl?: string,
        viewport?: Cypress.ViewportPreset
      ): Chainable<Element>;
      startOver(): Chainable<Element>;
      getTotp(): Chainable<Element>;
      useTotp(): Chainable<Element>;

      testDataSourceLink(): Chainable<Element>;
      testData(dataToTest: any, index?: number): Chainable<Element>;
    }
    interface Cypress {
      dayjs(): dayjs.Dayjs;
    }
  }
}
