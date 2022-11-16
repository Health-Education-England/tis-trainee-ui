// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// cypress/support/index.js

import day from "dayjs";
import { DateUtilities } from "../../src/utilities/DateUtilities";
import { BooleanUtilities } from "../../src/utilities/BooleanUtilities";

Cypress.Commands.add("checkForSuccessNotif", (successMsg: string) => {
  cy.get(".notification").should(
    "have.css",
    "background-color",
    "rgb(0, 100, 0)"
  );
  cy.get("[data-cy=faIcon]")
    .should("exist")
    .should("have.class", "fa-circle-check");
  cy.get("[data-cy=notifText]").should("include.text", successMsg);
  // Success notifications should be auto removed after 8s
  cy.wait(8500);
  cy.get(".notification").should("not.exist");
});

Cypress.Commands.add("checkForErrorNotif", (errorMsg: string) => {
  cy.get(".notification").should(
    "have.css",
    "background-color",
    "rgb(167, 23, 26)"
  );
  cy.get("[data-cy=faIcon]")
    .should("exist")
    .should("have.class", "fa-circle-exclamation");
  cy.get("[data-cy=notifText]").should("include.text", errorMsg);
  // check error notification is NOT auto removed
  cy.wait(8500);
  cy.get(".notification").should("exist");
  cy.get("[data-cy=notifCloseBtn]").should("exist").click();
  cy.get(".notification").should("not.exist");
});

Cypress.Commands.add("testDataSourceLink", () => {
  cy.get("[data-cy=dataSourceSummary]")
    .should("exist")
    .should("include.text", "My details are wrong")
    .click();
  cy.get("[data-cy=dataSourceText] > :nth-child(1)").should("be.visible");
  cy.get(".nhsuk-action-link__text").should(
    "contain.text",
    "How to update my personal details"
  );
  cy.get("[data-cy='dataSourceLink']").should(
    "have.attr",
    "href",
    "https://tis-support.hee.nhs.uk/trainees/how-to-update-personal-data/"
  );
});

Cypress.Commands.add("signIn", () => {
  cy.get("#radix-2-trigger-0").click();
  cy.get("#amplify-id-0").clear().type(Cypress.env("username"));
  cy.get("#amplify-id-2").clear().type(Cypress.env("password"));
  cy.get(".amplify-button--primary").click();
  cy.task("generateOTP").then(token => {
    cy.get("#amplify-id-6").clear().type(`${token}{enter}`);
  });
});

Cypress.Commands.add("signBackIn", () => {
  cy.get("#radix-5-trigger-0").click();
  cy.get("#amplify-id-9").clear().type(Cypress.env("username"));
  cy.get("#amplify-id-11").clear().type(Cypress.env("password"));
  cy.get(".amplify-button--primary").click();
  cy.task("generateOTP").then(token => {
    cy.get("#amplify-id-15").clear().type(`${token}{enter}`);
  });
});

Cypress.Commands.add(
  "checkFormRAValues",
  (
    dateAttained: string,
    completionDate: string,
    startDate: string,
    wholeTimeEquivalent: number
  ) => {
    cy.get("#forename").should("exist").invoke("val").should("not.be.empty");
    cy.get("#surname").should("exist").invoke("val").should("not.be.empty");
    cy.get("#gmcNumber").should("exist").invoke("val").should("not.be.empty");
    cy.get("[data-cy=localOfficeName]")
      .should("exist")
      .should("have.value", "Health Education England Wessex");
    cy.get("#dateOfBirth").should("exist").invoke("val").should("not.be.empty");

    cy.get("#gender").should("exist").should("have.value", "Male");
    cy.get("#immigrationStatus")
      .should("exist")
      .select("Tier 1")
      .should("have.value", "Tier 1");

    cy.get("#qualification")
      .should("exist")
      .invoke("val")
      .should("not.be.empty");

    cy.get("#dateAttained").should("exist").should("have.value", dateAttained);
    cy.get("#medicalSchool")
      .should("exist")
      .should("have.value", "University of Medical Things");
    cy.get("#address1").should("exist").invoke("val").should("not.be.empty");
    cy.get("#address2").should("exist").invoke("val").should("not.be.empty");
    cy.get("#address3").should("exist").invoke("val").should("not.be.empty");

    cy.get("#postCode").should("exist").invoke("val").should("not.be.empty");
    cy.get("#telephoneNumber")
      .should("exist")
      .invoke("val")
      .should("not.be.empty");
    cy.get("#mobileNumber")
      .should("exist")
      .should("have.value", "0777777777777");
    cy.get("#email")
      .should("exist")
      .should("have.value", "traineeui.tester@hee.nhs.uk");

    cy.get("[data-cy=declarationType0]").should("be.checked");

    cy.get("#programmeSpecialty")
      .should("exist")
      .should("not.have.value", "--Please select--");

    cy.get("[data-cy=cctSpecialty1]")
      .should("exist")
      .should("not.have.value", "--Please select--");

    cy.get("[data-cy=cctSpecialty2]")
      .should("exist")
      .should("not.have.value", "--Please select--");

    cy.get("#college")
      .should("exist")
      .should("not.have.value", "--Please select--");

    cy.get("#completionDate")
      .should("exist")
      .should("have.value", completionDate);

    cy.get("#trainingGrade")
      .should("exist")
      .should("not.have.value", "--Please select--");

    cy.get("#startDate").should("exist").should("have.value", startDate);
    cy.get("#programmeMembershipType")
      .should("exist")
      .should("have.value", "LAT");

    cy.get("#wholeTimeEquivalent")
      .should("exist")
      .should("have.value", wholeTimeEquivalent);
  }
);

// ### SECTION 1: CHECK AND FILL
Cypress.Commands.add(
  "checkAndFillSection1",
  (currRevalDate: string, prevRevalDate: string) => {
    cy.contains("Section 1: Doctor's details").should("exist");
    cy.get("[data-cy=mainWarning1]").should("exist");
    cy.get("[data-cy=legendFieldset1]").should("exist");
    cy.get(".nhsuk-warning-callout > p").should("exist");

    cy.get("#prevRevalBody").should("exist");
    cy.get("#prevRevalBodyOther").should("not.exist");

    cy.get("#forename").should("exist").invoke("val");
    cy.get("#forename").focus();
    cy.get("#forename").clear();
    cy.get("#forename").type("Fore name");
    cy.get("#surname").should("exist").invoke("val");
    cy.get("#surname").clear();
    cy.get("#surname").type("Last name");

    cy.get("#gmcNumber").should("exist").invoke("val");
    cy.get("#gmcNumber").clear();
    cy.get("#gmcNumber").type("11111111");

    cy.get("#email").should("exist").invoke("val");
    cy.get("#email").clear();
    cy.get("#email").type("traineeui.tester@hee.nhs.uk");

    cy.get("[data-cy='localOfficeName']")
      .should("exist")
      .focus()
      .select("Health Education England Wessex");
    cy.get("#prevRevalBody > option")
      .last()
      .then(element => {
        const selectedItem = element.val()!.toString();
        cy.get("#prevRevalBody")
          .select(selectedItem)
          .should("have.value", "other");
      });
    cy.get("#currRevalDate").should("exist").clear().type(currRevalDate);
    cy.get("#prevRevalDate").should("exist").clear().type(prevRevalDate);
    cy.get("#programmeSpecialty > option")
      .eq(1)
      .then(element => {
        const selectedItem = element.val()!.toString();
        cy.get("#programmeSpecialty")
          .select(selectedItem)
          .should("not.have.value", "--Please select--");
      });
    cy.get("#dualSpecialty > option")
      .eq(1)
      .then(element => {
        const selectedItem = element.val()!.toString();
        cy.get("#dualSpecialty")
          .select(selectedItem)
          .should("not.have.value", "--Please select--");
      });
    cy.get("#prevRevalBody").select(
      "Northern Ireland Medical and Dental Training Agency"
    );
    cy.get("#prevRevalBody").should(
      "have.value",
      "Northern Ireland Medical and Dental Training Agency"
    );
    cy.get("#prevRevalBody").should(
      "not.have.value",
      "Health Education England Wessex"
    );
    cy.get("#prevRevalBody").select("other");
    cy.get("#prevRevalBodyOther").should("exist");

    cy.get("#prevRevalBodyOther").clear().type("Health ");
    cy.get("#prevRevalBodyOther + ul li").should("exist");

    cy.get("#prevRevalBodyOther").clear().type("Dental Training Agency");
    cy.get("#prevRevalBodyOther + ul li").should("not.exist");

    cy.get('[data-cy="currRevalDate"]').click();
    cy.get('[data-cy="prevRevalBodyOther"]').should("have.value", "");
    cy.get('[data-cy="prevRevalBodyOther"]').clear().type("Health");
    cy.get("#prevRevalBodyOther + ul li").should("exist");
    cy.get("#prevRevalBodyOther + ul li").eq(0).click();

    cy.get("#prevRevalBody").select("other");
    cy.get("#prevRevalBodyOther").should("have.value", "");
  }
);

// ### SECTION 2: CHECK AND FILL
Cypress.Commands.add(
  "checkAndFillSection2",
  (workStartDate: string, endDate: string) => {
    // This command fills the section with default work panel only

    cy.contains("Whole Scope of Practice").should("exist");
    cy.get(".nhsuk-warning-callout > p").should("exist");
    cy.contains("Type of work").should("exist");
    cy.contains("Add more").should("exist");
    cy.contains("TOOT").should("exist");

    // Delete all other work panels except default work panel
    cy.get('[data-jest="removePanel"]').each(() =>
      cy.get('[data-cy="closeIcon1"]').click()
    );

    // Fill default work panel
    cy.get('[data-cy="work[0].trainingPost"]').select("Yes");
    cy.get('[data-cy="work[0].typeOfWork"]')
      .should("exist")
      .clear()
      .type("In Post Doing Something");
    cy.get('[data-cy="work[0].startDate"]')
      .should("exist")
      .clear()
      .type(workStartDate);

    cy.get(`[data-cy="work[0].endDate"]`).should("exist").clear().type(endDate);
    cy.get(`[data-cy="work[0].site"]`).should("exist").clear().type("Site");
    cy.get(`[data-cy="work[0].siteLocation"]`)
      .should("exist")
      .clear()
      .type("Location");

    cy.get("#sicknessAbsence").should("exist").clear().type("1");
    cy.get("#paidLeave").should("exist").clear().type("2");
    cy.get("#parentalLeave").should("exist").clear().type("3");
    cy.get("#careerBreaks").should("exist").clear().type("4");
    cy.get("#unauthorisedLeave").should("exist").clear().type("5");
    cy.get("#otherLeave").should("exist").clear().type("6");
    cy.get("#totalLeave").should("have.value", "21");

    cy.get("[data-cy=BtnAddWorkType]").should("exist");
  }
);

// ### SECTION 3: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection3", () => {
  cy.get("[data-cy=legendFieldset3]").should("include.text", "Section 3");
  cy.get("[data-cy=mainWarning3]").should("exist");
  cy.get("[data-cy=declarations]").should("exist");
  cy.get("[data-cy=healthStatement]").should("exist");

  cy.get("[data-cy=isHonest0]")
    .should("exist")
    .should("contain.value", "")
    .check("true");

  cy.get("[data-cy=isHealthy0]")
    .should("exist")
    .should("contain.value", "")
    .check("true");

  cy.get("[data-cy=isWarned0]")
    .should("exist")
    .should("contain.value", "")
    .check("true");

  cy.get("[data-cy=isComplying0]").should("exist").check("true");
  cy.get(".nhsuk-form-group > [data-cy=healthStatement]")
    .should("exist")
    .clear()
    .type("I'm in astonishingly excellent health.");
});

// ### SECTION 4: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection4", (pastDate: string) => {
  cy.get("[data-cy=legendFieldset4]").should("include.text", "Section 4");
  cy.get("[data-cy=mainWarning4]").should("exist");
  cy.get("[data-cy=declarations4]").should("exist");

  cy.get("[data-cy=havePreviousDeclarations1]")
    .should("exist")
    .should("contain.value", "")
    .check("false");

  cy.get("#declarationPanel0").should("not.exist");

  cy.get("[data-cy=havePreviousDeclarations0]")
    .should("exist")
    .should("contain.value", "")
    .check("true");

  // Fill declaration
  cy.get("[data-cy=legendFieldset4]")
    .should("exist")
    .should("include.text", "Section 4");

  //click no previous unresolved declerations and no Previous resolved declarations
  //submit should be enabled

  cy.get("[data-cy=havePreviousDeclarations1]").click();
  cy.get("[data-cy=havePreviousUnresolvedDeclarations1]").click();
  cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
  cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page").click();

  //click yes Previous resolved declarations and no previous unresolved declerations

  cy.get("[data-cy=havePreviousDeclarations0]").click();
  //should not allow navigation to next page and show error
  cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
  cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("exist");

  cy.get('[data-cy="previousDeclarations[0].declarationType"]').should("exist");
  cy.get('[data-cy="previousDeclarations[0].declarationType"]').select(
    "Complaint"
  );
  cy.get('[data-cy="previousDeclarations[0].dateOfEntry"]').click();
  cy.get('[data-cy="previousDeclarations[0].dateOfEntry"]').type("2000-05-28");
  cy.get('[data-cy="previousDeclarations[0].title"]').type("testTitle");
  cy.get("#previousDeclarations[0].title--error-message").should("not.exist");
  cy.get('[data-cy="previousDeclarations[0].locationOfEntry"]').type(
    "testLocation"
  );
  cy.get("[data-cy=havePreviousUnresolvedDeclarations1]").click();
  cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
  cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("not.exist");
  cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page").click();

  //click no Previous resolved declarations and yes revious unresolved declerations
  cy.get("[data-cy=havePreviousDeclarations1]").click();
  cy.get("[data-cy=havePreviousUnresolvedDeclarations0]").click();
  cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("exist");
  cy.get(".nhsuk-form-group > [data-cy=previousDeclarationSummary]").type(
    "test text"
  );
  cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("not.exist");
});

// ### SECTION 5: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection5", (pastDate: string) => {
  cy.get("[data-cy=legendFieldset5]").should("include.text", "Section 5");
  cy.get("[data-cy=mainWarning5]").should("exist");
  cy.get("[data-cy=declarations5]").should("exist");

  cy.get("[data-cy=haveCurrentDeclarations1]").click();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get("[data-cy=haveCurrentUnresolvedDeclarations1]").click();
  cy.get(".nhsuk-error-summary").should("not.exist");

  cy.get("[data-cy=haveCurrentDeclarations0]").click();
  cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
  cy.get(".nhsuk-error-summary").should("exist");
  //fill
  cy.get('[data-cy="currentDeclarations[0].declarationType"]').select(
    "Complaint"
  );
  cy.get('[data-cy="currentDeclarations[0].dateOfEntry"]').click();
  cy.get('[data-cy="currentDeclarations[0].dateOfEntry"]').type("2021-05-28");
  cy.get('[data-cy="currentDeclarations[0].title"]').type("testTitle");
  cy.get('[data-cy="currentDeclarations[0].locationOfEntry"]').type(
    "testLocation"
  );
  cy.get(".nhsuk-error-summary").should("not.exist");

  cy.get("[data-cy=haveCurrentUnresolvedDeclarations0]").click();
  cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get(".nhsuk-form-group > [data-cy=currentDeclarationSummary]").type(
    "test text"
  );
  cy.get(".nhsuk-error-summary").should("not.exist");
});

// ### SECTION 6: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection6", (compliments: string) => {
  cy.get("[data-cy=legendFieldset6]").should("include.text", "Section 6");

  cy.get("[data-cy=compliments]")
    .should("exist")
    .should("contain.value", "")
    .clear()
    .type(compliments);
});

// ### COVID SECTION: CHECK AND FILL

Cypress.Commands.add("checkAndFillCovidSection", () => {
  cy.get("[data-cy=legendFieldsetCovid]").should("include.text", "COVID");
  cy.get("[data-cy='haveCovidDeclarations0']").should("exist").check();
  cy.get("[data-cy='covidForm']").should("exist");
  cy.get("[data-cy='covidDeclarationDto.reasonOfSelfRate']").should(
    "not.exist"
  );
  cy.get("[data-cy=covidErrorSummary").should("not.exist");
  cy.get("[data-cy='covidDeclarationDto.selfRateForCovid0']")
    .should("exist")
    .check();
  cy.get("[data-cy='covidDeclarationDto.reasonOfSelfRate']").should("exist");
  cy.get("[data-cy='covidDeclarationDto.reasonOfSelfRate']").clear();
  cy.get("[data-cy='covidDeclarationDto.reasonOfSelfRate']").type(
    "Covid Training Progress Reason"
  );

  cy.get("[data-cy='covidDeclarationDto.otherInformationForPanel']").should(
    "exist"
  );
  cy.get("[data-cy='covidDeclarationDto.otherInformationForPanel']").clear();
  cy.get("[data-cy='covidDeclarationDto.otherInformationForPanel']").type(
    "Other Covid information"
  );

  cy.get("[data-cy='covidDeclarationDto.discussWithSupervisorChecked0']")
    .should("exist")
    .check();
  cy.get("[data-cy='covidDeclarationDto.discussWithSomeoneChecked0']")
    .should("exist")
    .check();

  cy.get("[data-cy='covidDeclarationDto.haveChangesToPlacement0']")
    .should("exist")
    .check();

  cy.get("[data-cy='covidDeclarationDto.changeCircumstances']")
    .should("exist")
    .select("Other")
    .should("have.value", "Other");
  cy.get("[data-cy='covidDeclarationDto.changeCircumstanceOther']")
    .should("exist")
    .type("Other circumstance of change");
  cy.get("[data-cy='covidDeclarationDto.howPlacementAdjusted']")
    .should("exist")
    .type("How your placement was adjusted");
  cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("not.exist");
});

Cypress.Commands.add("addWorkPanel", (startDate: string, endDate: string) => {
  cy.get("[data-cy=BtnAddWorkType]").click();

  const workPanels = Cypress.$("[data-cy=workPanel]").length;

  cy.get(`[data-cy="work[${workPanels}].typeOfWork"]`)
    .should("exist")
    .clear()
    .type("Type of work");

  cy.get(`[data-cy="work[${workPanels}].trainingPost"]`)
    .should("exist")
    .select("No");

  cy.get(`[data-cy="work[${workPanels}].startDate"]`)
    .should("exist")
    .clear()
    .type(startDate);

  cy.get(`[data-cy="work[${workPanels}].endDate"]`)
    .should("exist")
    .clear()
    .type(endDate);

  cy.get(`[data-cy="work[${workPanels}].site"]`)
    .should("exist")
    .clear()
    .type("Site name");

  cy.get(`[data-cy="work[${workPanels}].siteLocation"]`)
    .should("exist")
    .clear()
    .type("Site location");
});

Cypress.Commands.add("logout", () => {
  cy.viewport("iphone-6");
  cy.get("[data-cy=BtnMenu]").should("exist").click();
  cy.get("[data-cy=logoutBtn]").click();
});

Cypress.Commands.add("login", () => {
  cy.viewport("iphone-6");

  if (cy.get("input[name=username]")) {
    cy.get("input[name=username]").type(Cypress.env("username"));
    cy.get("input[name=password]").type(`${Cypress.env("password")}{enter}`, {
      log: false
    });
  }
});

Cypress.Commands.add("logoutDesktop", () => {
  cy.get("[data-cy=logoutBtn]").click();
});

Cypress.Commands.add("checkFlags", (name: string) => {
  return cy
    .request({
      method: "GET",
      url: `/api/forms/form-switches`
    })
    .then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.be.greaterThan(0);
      const data = response.body.filter(
        (flag: { name: string }) => flag.name === name
      );
      expect(data.length).to.eq(1);
      return data[0].enabled;
    });
});

Cypress.Commands.add("testData", (dataToTest: any, index?: number) => {
  const isDateType = (value: any) =>
    !!value && day(value).isValid() && value.toString().indexOf("-") > -1;

  Object.entries(dataToTest).forEach(([key, val]: [key: string, val: any]) => {
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
});