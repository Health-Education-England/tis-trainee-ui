/// <reference types="cypress" />
import dayjs from "dayjs";
import { CheckType } from "./commands";
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
      checkAndFillFormBSection1(): Chainable<Element>;
      checkAndFillFormBSection2(): Chainable<Element>;
      checkAndFillFormBSection3(): Chainable<Element>;
      checkAndFillFormBSection4(): Chainable<Element>;
      checkAndFillFormBSection5(): Chainable<Element>;
      checkAndFillFormBSection6(): Chainable<Element>;
      checkAndFillFormBSection7(): Chainable<Element>;
      checkAndFillFormBSection8(): Chainable<Element>;
      checkAndFillFormBSection9(): Chainable<Element>;
      checkAndFillFormBSection10(): Chainable<Element>;
      checkAndFillCovidSection(): Chainable<Element>;
      checkForRecentForm(): Chainable<Element>;
      checkPanelLabels(
        panel: number,
        labels: ItemType[],
        panelName: string,
        checkType: CheckType
      ): Chainable<Element>;
      checkPanelElement(
        panel: number,
        labels: LabelsType[],
        panelName: string,
        checkType: CheckType
      ): Chainable<Element>;
      checkViewFields(fields: string[][]): Chainable<Element>;
      clearAndType(selector: string, text: string): Chainable<Element>;
      clickAllRemoveWorkButtons(): Chainable<Element>;
      clickRadioCheck(selector: string): Chainable<Element>;
      fillWorkPanel(
        workName: string,
        startDate1: string,
        endDate1: string
      ): Chainable<Element>;
      checkFlags(name: string): Chainable<Element>;
      clickSelect(
        selectorBeginningSegment: string,
        text: string | null,
        useFirst: boolean
      ): Chainable<Element>;
      confirmCookie(): Chainable<Element>;
      doDeclarationsFormB(): Chainable<Element>;
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
