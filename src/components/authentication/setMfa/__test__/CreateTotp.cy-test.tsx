/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedtempMfa } from "../../../../redux/slices/userSlice";
import store from "../../../../redux/store/store";
import CreateTotp from "../totp/CreateTotp";
import history from "../../../navigation/history";

describe("CreateTotp sections", () => {
  it("should not render a totp section if NOMFA", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <CreateTotp user={{ username: "Fred" }} mfa="NOMFA" />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-card__heading").should("not.exist");
  });

  it("should render the decide totp component when section number is 1 ", () => {
    const MockedDecideTotpSection = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedtempMfa("TOTP"));
      return <CreateTotp user={{ username: "stan" }} mfa="TOTP" />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedDecideTotpSection />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-card__heading")
      .should("exist")
      .should("include.text", "I've already installed an Authenticator App");
    cy.get("#appInstalledAlready-1--label")
      .should("exist")
      .should("include.text", "Yes");
    cy.get("#appInstalledAlready-2--label")
      .should("exist")
      .should("include.text", "No");
    cy.get("[data-cy=appInstalledAlready0]").click();
    cy.get(".nhsuk-warning-callout").should("exist");
    cy.get(".nhsuk-button")
      .should("exist")
      .should(
        "contain.text",
        "Add 'NHS TIS Self-Service' to your Authenticator App"
      );
    cy.get("[data-cy=appInstalledAlready1]").click();
    cy.get(".nhsuk-warning-callout").should("not.exist");

    // progress to Install totp section
    cy.get(".nhsuk-button").should("exist").click();
    cy.get("[data-cy=installTotpPanel] > :nth-child(1)")
      .should("exist")
      .should(
        "contain.text",
        "Installing the Microsoft Authenticator App on your phone"
      );
    cy.get("[data-cy=msAuthInfoSummary]").should("exist").click();
    cy.get("[data-cy=msAuthInfoText]")
      .should("exist")
      .should(
        "include.text",
        "Below are instructions to help you install Microsoft Authenticator"
      );
    cy.get(
      "[data-cy=scanQrPanel] > .nhsuk-card__content > .nhsuk-card__heading"
    )
      .should("exist")
      .should("contain.text", "Scan the QR Code with your phone");
    cy.get("[data-cy=qrApple]").should("exist");
    cy.get("[data-cy=qrAndroid]").should("exist");
    cy.get("[data-cy=appLinkApple] > img").should("exist");
    cy.get("[data-cy=appLinkApple] > img").should("exist");
    cy.get("[data-cy=moreHelpSummary]").should("exist").click();
    cy.get("[data-cy=moreHelpText]").should("exist");
    cy.get("[data-cy=authGuideLink]").should("exist");
    cy.get("[data-cy=appInstalledNow0]").should("exist").click();
    cy.get("[data-cy=threeMinWarning]")
      .should("exist")
      .should(
        "include.text",
        "On the next screen you will have 3 minutes to scan a QR code"
      );
    // progress to the verify totp account section
    cy.get(".nhsuk-button")
      .should("exist")
      .should("contain.text", "Add")
      .click();
    cy.get("[data-cy=threeMinReminderText]")
      .should("exist")
      .should("include.text", "You have 3 minutes to scan the QR code below");
    cy.get("[data-cy=addTssTotpHeader] > :nth-child(1)").should(
      "contain.text",
      "Add 'NHS TIS-Self-Service' to your Authenticator App"
    );
    cy.get("[data-cy=msAuthInfoSummary]").should("exist").click();
    cy.get("[data-cy=tssQrCode]").should("exist");
    cy.get("[data-cy=tssQrCodeHelp]").click();
    cy.get("[data-cy=tssQrCodeStr]").should("be.visible");
    cy.get("[data-cy=confirmTOTPCode]")
      .should("be.visible")
      .should("have.attr", "placeholder", "6-digit code");
    // return to totp setup when QR code expires after 3 mins
    cy.wait(180000);
    cy.get("[data-cy=appInstalledAlreadyChoose]").should("exist");
    //then return to totp verification section
    cy.get("[data-cy=appInstalledAlready0]").click();
    cy.get(".nhsuk-button")
      .should("exist")
      .should(
        "contain.text",
        "Add 'NHS TIS Self-Service' to your Authenticator App"
      );
  });
});
