// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />
import dayjs from "dayjs";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      checkFormRAValues: Chainable<Element>;
      checkAndFillSection1: Chainable<Element>;
      checkAndFillSection2: Chainable<Element>;
      checkAndFillSection3: Chainable<Element>;
      checkAndFillSection4: Chainable<Element>;
      checkAndFillSection5: Chainable<Element>;
      checkAndFillSection6: Chainable<Element>;
      checkAndFillCovidSection: Chainable<Element>;
      addWorkPanel: Chainable<Element>;
      logout: Chainable<Element>;
      login: Chainable<Element>;
      checkFlags: Chainable<Element>;
      confirmCookie: Chainable<Element>;
      signIn: Chainable<Element>;
      signBackIn: Chainable<Element>;
      getTotp: Chainable<Element>;
      useTotp: Chainable<Element>;
      logoutDesktop: Chainable<Element>;
      testDataSourceLink: Chainable<Element>;
      checkForSuccessNotif(notifType: string): Chainable<Element>;
      checkForErrorNotif(notifType: string): Chainable<Element>;
      testData: Chainable<Element>;
    }
    interface Cypress {
      dayjs: dayjs.Dayjs;
    }
  }
}
