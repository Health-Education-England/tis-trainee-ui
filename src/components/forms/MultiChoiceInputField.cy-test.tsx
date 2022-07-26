import React from "react";
import MultiChoiceInputField from "./MultiChoiceInputField";
import { mount } from "@cypress/react";
import { KeyValue } from "../../models/KeyValue";
import { Formik, Form } from "formik";

describe("MultiChoiceInputField", () => {
  const items: KeyValue[] = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
  ];

  it("should render checkbox input when type is checkbox ", () => {
    mount(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <Form>
            <MultiChoiceInputField
              name="checkboxMulti"
              type="checkbox"
              items={[{ label: "I agree", value: "true" }]}
              footer={"this is the checkbox footer"}
              hint={"this is the checkbox hint"}
            />
          </Form>
        )}
      </Formik>
    );
    cy.get("[data-cy=checkboxMulti0]")
      .should("exist")
      .should("have.attr", "type", "checkbox")
      .click()
      .should("be.checked")
      .and("have.value", "true");
    cy.get("#checkboxMulti--hint")
      .should("exist")
      .should("contain.text", "this is the checkbox hint");
    cy.get("[data-cy=inputFooterLabel]")
      .should("exist")
      .should("contain.text", "this is the checkbox footer");
    cy.get("[data-cy=checkboxMulti0]").click().should("not.be.checked");
  });

  it("should render radios input when type is radios", () => {
    mount(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <Form>
            <MultiChoiceInputField
              name="radioMulti"
              type="radios"
              items={items}
              footer={"this is the radio footer"}
              hint={"this is the radio hint"}
            />
          </Form>
        )}
      </Formik>
    );
    cy.get("[data-cy=radioMulti0]")
      .should("exist")
      .should("have.attr", "type", "radio")
      .click()
      .should("be.checked")
      .and("have.value", "yes");
    cy.get("[data-cy=radioMulti1]")
      .click()
      .should("be.checked")
      .and("have.value", "no");
    cy.get("[data-cy=radioMulti0]").should("not.be.checked");
  });
});
