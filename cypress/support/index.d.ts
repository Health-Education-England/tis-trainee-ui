// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    checkFormRAValues: any;
    checkAndFillSection1: any;
    checkAndFillSection2: any;
    checkAndFillSection3: any;
    checkAndFillSection4: any;
    checkAndFillSection5: any;
    checkAndFillSection6: any;
    checkAndFillCovidSection: any;
    addWorkPanel: any;
    logout: any;
    login: any;
    checkFlags: any;
    confirmCookie: any;
    signIn: any;
    signBackIn: any;
    getTotp: any;
    useTotp: any;
    logoutDesktop: any;
    testDataSourceLink: any;
  }

  import dayjs from "dayjs";
  interface Cypress {
    dayjs: dayjs.Dayjs;
  }
}
