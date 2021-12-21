import { mount } from "@cypress/react";
import { beforeEach } from "mocha";
import { BrowserRouter } from "react-router-dom";
import HEEFooter from "../HEEFooter";

describe("Footer", () => {
  beforeEach(() => {
    mount(
      <BrowserRouter>
        <HEEFooter appVersion={"0.0.1"} mfa={"SMS"} />
      </BrowserRouter>
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
    cy.get("[data-cy=copyrightText]").should(
      "contain.text",
      "Health Education England"
    );
  });

  it("should have the correct version shown in the footer", () => {
    cy.get("[data-cy=versionText]").should("contain.text", "0.0.1");
  });

  it("should go to external tis-support when NOMFA", () => {
    mount(
      <BrowserRouter>
        <HEEFooter appVersion={"0.0.1"} mfa={"NOMFA"} />
      </BrowserRouter>
    );
    cy.get("[data-cy=linkSupport]")
      .should("contain.text", "Support")
      .should("have.attr", "href", "https://tis-support.hee.nhs.uk/");
  });
});