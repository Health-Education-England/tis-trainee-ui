import { mount } from "cypress/react";
import { Router } from "react-router-dom";
import TSSFooter from "../../../components/navigation/TSSFooter";
import history from "../../../components/navigation/history";

describe("Footer", () => {
  beforeEach(() => {
    mount(
      <Router history={history}>
        <TSSFooter appVersion={"0.0.1"} />
      </Router>
    );
  });

  const links = [
    { name: "Support", href: "/support", id: "[data-cy=linkSupport]" },
    {
      name: "About",
      href: "https://tis-support.hee.nhs.uk/about-tis/",
      id: "[data-cy=linkAbout]"
    },
    {
      name: "Privacy & Cookies Policy",
      href: "https://www.hee.nhs.uk/about/privacy-notice",
      id: "[data-cy=linkPrivacyPolicy]"
    }
  ];

  links.forEach(link => {
    it(`should go to the ${link.name} page from the ${link.name} link`, () => {
      cy.get(`${link.id}`)
        .should("contain.text", `${link.name}`)
        .should("have.attr", "href", `${link.href}`);
    });
  });

  it("Copyright notice should contain HEE text", () => {
    cy.get("[data-cy=copyrightText]").should("contain.text", "NHS England");
  });

  it("should have the correct version shown in the footer", () => {
    cy.get("[data-cy=versionText]").should("contain.text", "0.0.1");
  });
});
