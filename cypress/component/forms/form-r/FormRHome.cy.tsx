import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "../../../../redux/store/store";
import { FormRHome } from "../../../../components/forms/form-builder/form-r/FormRHome";
import { submittedFormRPartAs } from "../../../../mock-data/submitted-formr-parta";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";

describe("FormRHome", () => {
  it("should render the loading state initially", () => {
    cy.intercept("GET", "/api/forms/formr-partas", {
      body: submittedFormRPartAs
    }).as("getFormAs");

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-a"]}>
          <FormRHome />
        </MemoryRouter>
      </Provider>
    );

    cy.get('[data-cy="loading"]').should("exist");

    cy.wait("@getFormAs");

    cy.get('[data-cy="loading"]').should("not.exist");
  });

  it("should render the list of Form R Part A when data fetch is successful", () => {
    cy.intercept("GET", "/api/forms/formr-partas", submittedFormRPartAs).as(
      "getFormAs"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-a"]}>
          <FormRHome />
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getFormAs");

    cy.contains("Edit unsubmitted form").should("exist");
    cy.get("table").should("exist");
    cy.get('[data-cy="formr-previous-header"]').should("exist");
    cy.get(".table-sort-button").eq(2).click();
    cy.get("time").first().contains("22/04/2012");
    cy.get(".table-sort-button").eq(2).click();
    cy.get("time").first().contains("02/07/2022");
  });

  it("should render the list of Form R Part B when data fetch is successful", () => {
    cy.intercept("GET", "/api/forms/formr-partbs", submittedFormRPartBs).as(
      "getFormBs"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b"]}>
          <FormRHome />
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getFormBs");

    cy.contains("Submit new form").should("exist");
    cy.get("table").should("exist");
    cy.contains("Your previous form was submitted recently on").should(
      "not.exist"
    );
  });

  it("should render an error message when data fetch fails", () => {
    cy.intercept("GET", "/api/forms/formr-partas", {
      statusCode: 500,
      body: { message: "Internal Server Error" }
    }).as("getFormAsFail");

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-a"]}>
          <FormRHome />
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getFormAsFail");

    cy.contains("There was a problem loading your saved forms").should("exist");
  });

  it("should render the recent submission warning when the latest form was submitted within 31 days", () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 30);

    const recentFormAs = [...submittedFormRPartAs];
    recentFormAs[0] = {
      ...recentFormAs[0],
      submissionDate: recentDate.toISOString()
    };

    cy.intercept("GET", "/api/forms/formr-partas", recentFormAs).as(
      "getFormAsRecent"
    );

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-a"]}>
          <FormRHome />
        </MemoryRouter>
      </Provider>
    );

    cy.wait("@getFormAsRecent");

    cy.contains("Your previous form was submitted recently on").should("exist");
  });
});
