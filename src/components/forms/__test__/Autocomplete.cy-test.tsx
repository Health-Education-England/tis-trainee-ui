import React from "react";
import Autocomplete from "../Autocomplete";
import { mount } from "@cypress/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { KeyValue } from "../../../models/KeyValue";
const options: KeyValue[] = [
  { label: "Item 1", value: "Item 1" },
  { label: "Item 2", value: "Item 2" },
  { label: "Item 3", value: "Item 3" },
  { label: "Item 4", value: "Item 4" }
];

const getComponent = (
  opts: KeyValue[],
  initialValue: {} = {},
  inputValue: string = ""
) => (
  <Formik
    validationSchema={Yup.object().shape({
      cctSpecialty1: Yup.string().required("Required").min(4)
    })}
    validateOnChange={true}
    validateOnBlur={true}
    initialValues={initialValue}
    onSubmit={() => {
      cy.get("input").clear();
    }}
  >
    {() => (
      <Form>
        <Autocomplete
          label="Specialty 1 for Award of CCT"
          name="cctSpecialty1"
          id="DeclarationSpeciality1"
          options={opts}
          width="50%"
          inputValue={inputValue}
        />
      </Form>
    )}
  </Formik>
);
describe("Autocomplete component", () => {
  it("Should mount ", () => {
    mount(getComponent(options));
    cy.get("input").should("exist");
  });
  it("should display value as selected when passed in form data", () => {
    mount(getComponent(options, { cctSpecialty1: "Item 2" }));
    cy.get("input").should("have.value", "Item 2");
  });
  it("should display no value when not in form data", () => {
    mount(getComponent(options));
    cy.get("input").should("have.value", "");
  });
  it("should display unordered list as a drop down when input value set", () => {
    mount(getComponent(options));
    cy.get("input").type("Item");
    cy.get("ul").should("have.length", 1);
  });
  it("should display 4 items that match when value set to 'Item'", () => {
    mount(getComponent(options));
    cy.get("input").type("Item");
    cy.get("li").should("have.length", 4);
  });
  it("should display 1 item that match when value set to 'Item 3'", () => {
    mount(getComponent(options));
    cy.get("input").type("Item 3");
    cy.get("li").should("have.length", 1);
  });
  it("should display error when validation criteria not met", () => {
    mount(getComponent(options));
    cy.get("input").type("I");
    cy.get(".nhsuk-error-message").should("have.length", 1);
  });
  it("should not display error when validation criteria met", () => {
    mount(getComponent(options));
    cy.get("input").type("Item");
    cy.get("li").first().click();
    cy.get(".nhsuk-error-message").should("have.length", 0);
  });
});
