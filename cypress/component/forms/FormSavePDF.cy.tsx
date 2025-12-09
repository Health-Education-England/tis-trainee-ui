import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import FormSavePDF from "../../../components/forms/FormSavePDF";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
import history from "../../../components/navigation/history";
import React, { ReactNode } from "react";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { mockTraineeProfile } from "../../../mock-data/trainee-profile";
import { updatedTraineeProfileData } from "../../../redux/slices/traineeProfileSlice";
import { FileUtilities } from "../../../utilities/FileUtilities";

const mountWithProviders = (children: ReactNode) => {
  return mount(
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );
};

describe("FormSavePDF", () => {
  it("should show the 'PDF help' link when 'save Pdf' button clicked and no matched PM", () => {
    cy.stub(FormRUtilities, "historyPush").as("Back");
    cy.stub(FormRUtilities, "windowPrint").as("PrintPDF");

    mountWithProviders(<FormSavePDF pmId="1" />);
    cy.get("[data-cy=pdfHelpLink]").should("not.exist");
    cy.get("[data-cy=savePdfBtn]").click();
    cy.get("@PrintPDF").should("have.been.called");
    cy.get("[data-cy=pdfHelpLink]").should("exist");
    cy.get("[data-cy=backLink]").click();
    cy.get("@Back").should("have.been.called");
  });

  it("should not show the 'PDF help' link when 'save Pdf' button clicked and matched PM", () => {
    cy.stub(FileUtilities, "downloadPdf").as("DownloadPDF");
    const MockedFormsListBtnNoDraftForms = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileData(mockTraineeProfile));
      return <FormSavePDF pmId="1" />;
    };
    mountWithProviders(<MockedFormsListBtnNoDraftForms />);
    cy.get("[data-cy=savePdfBtn]").click();
    cy.get("@DownloadPDF").should("have.been.called");
    cy.get("[data-cy=pdfHelpLink]").should("not.exist");
  });
});
