import { mount } from "@cypress/react";
import HowToPrintToPDF from "../HowToPrintToPDF";

it("HowToPrintToPDF ", () => {
  mount(<HowToPrintToPDF />);
  cy.get("h2").contains("How to save a Form R as PDF using the browser.");
});
