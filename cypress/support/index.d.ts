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
      checkAndFillSection1(): Chainable<Element>;
      checkAndFillSection2(): Chainable<Element>;
      checkAndFillSection3(): Chainable<Element>;
      checkAndFillSection4(): Chainable<Element>;
      checkAndFillSection5(): Chainable<Element>;
      checkAndFillSection6(): Chainable<Element>;
      checkAndFillSection7(): Chainable<Element>;
      checkAndFillSection8(): Chainable<Element>;
      checkAndFillSection9(): Chainable<Element>;
      checkAndFillSection10(): Chainable<Element>;
      checkAndFillCovidSection(): Chainable<Element>;
      checkAndFillNewCctCalcForm(): Chainable<Element>;
      checkElement(
        selector: string,
        text: string | number | null = null,
        shouldExist: boolean = true
      ): Chainable<Element>;
      checkForFormLinkerAndComplete(): Chainable<Element>;
      addWorkPanel(startDate: string, endDate: string): Chainable<Element>;
      checkFlags(name: string): Chainable<Element>;
      checkViewFields(fields: string[][]): Chainable<Element>;
      clickSelect(
        selectorBeginningSegment: string,
        text: string | null = null,
        useFirst: boolean = true
      ): Chainable<Element>;
      clearAndType(selector: string, text: string): Chainable<Element>;
      clickAllRemoveWorkButtons(): Chainable<Element>;
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
      fillTextAreaToLimit(
        selector: string,
        char: string,
        limit: number
      ): Chainable<Element>;
    }
    interface Cypress {
      dayjs(): dayjs.Dayjs;
    }
  }
}
