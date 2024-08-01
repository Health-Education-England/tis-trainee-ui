/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import {
  FormLinkerModal,
  FormLinkerModalProps
} from "../../../../components/forms/form-linker/FormLinkerModal";
import {
  mockPersonalDetails,
  mockProgrammesForLinkerTest,
  mockProgrammesForLinkerTestOutsideArcp,
  mockProgrammesForLinkerTestOutsideNewStarter
} from "../../../../mock-data/trainee-profile";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import dayjs from "dayjs";

describe("FormLinkerModal", () => {
  beforeEach(() => {
    store.dispatch(
      updatedTraineeProfileData({
        traineeTisId: "12345",
        personalDetails: mockPersonalDetails,
        programmeMemberships: mockProgrammesForLinkerTest,
        placements: []
      })
    );
  });

  const defaultProps: FormLinkerModalProps = {
    onSubmit: () => {},
    isOpen: true,
    onClose: () => {},
    warningText: null,
    linkedFormData: {
      isArcp: null,
      programmeMembershipId: null
    }
  };

  const mountComponent = (props: Partial<FormLinkerModalProps> = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    mount(
      <Provider store={store}>
        <FormLinkerModal {...mergedProps} />
      </Provider>
    );
  };

  it("renders the FormLinkerModal component for a new/unsubmitted form", () => {
    mountComponent();
    cy.get("dialog").should("be.visible");
    cy.get('[data-cy="programmeMembershipId"]').should("not.exist");
    cy.get('[data-cy="isArcp0"]').should("exist").click();
    cy.get('[data-cy="programmeMembershipId"]').should("exist");
    cy.get('[data-cy="programmeMembershipId"] > .nhsuk-error-message')
      .should("exist")
      .should("contain.text", "Please select a programme.");
    cy.get('[data-cy="form-linker-submit-btn"]').should("be.disabled");

    // choose an option from the 'isArcp criteria' options
    cy.clickSelect('[data-cy="programmeMembershipId"]', "acute", false);
    cy.get('[data-cy="programmeMembershipId"]').contains(
      `Acute medicine (start: ${dayjs()
        .subtract(1, "year")
        .format("DD/MM/YYYY")})`
    );
    cy.get('[data-cy="form-linker-submit-btn"]').should("not.be.disabled");

    // switch to 'new starter' option
    cy.get('[data-cy="isArcp1"]').click();
    cy.get('[data-cy="programmeMembershipId"] > .nhsuk-error-message')
      .should("exist")
      .should("contain.text", "Please select a programme.");
    cy.get('[data-cy="form-linker-submit-btn"]').should("be.disabled");
    cy.clickSelect('[data-cy="programmeMembershipId"]', "adult");
    cy.get('[data-cy="programmeMembershipId"]').contains(
      `Adult psychiatry (start: ${dayjs().add(1, "year").format("DD/MM/YYYY")})`
    );
    cy.get('[data-cy="form-linker-submit-btn"]').should("not.be.disabled");
    // test cancel button
    cy.get('[data-cy="modal-cancel-btn"]').should("exist").click();
    cy.get("dialog").should("not.be.visible");
  });

  it("renders the FormLinkerModal component for a pre-submitted form", () => {
    mountComponent({
      linkedFormData: {
        isArcp: true,
        programmeMembershipId: "3"
      },
      onSubmit: cy.stub().as("onSubmit")
    });
    cy.get("dialog").should("be.visible");
    cy.get('[data-cy="programmeMembershipId"]').should("exist");
    cy.get('[data-cy="isArcp0"]').should("exist").should("be.checked");
    cy.get('[data-cy="isArcp1"]').should("exist").should("not.be.checked");
    cy.get('[data-cy="programmeMembershipId"] > .nhsuk-error-message').should(
      "not.exist"
    );
    cy.get('[data-cy="form-linker-submit-btn"]').should("not.be.disabled");

    cy.get('[data-cy="programmeMembershipId"]').contains(
      `Acute medicine (start: ${dayjs()
        .subtract(1, "year")
        .format("DD/MM/YYYY")})`
    );
    cy.get('[data-cy="form-linker-submit-btn"]').should("not.be.disabled");

    // switch to 'new starter' option
    cy.get('[data-cy="isArcp1"]').click();
    cy.get('[data-cy="programmeMembershipId"] > .nhsuk-error-message')
      .should("exist")
      .should("contain.text", "Please select a programme.");
    cy.get('[data-cy="form-linker-submit-btn"]').should("be.disabled");
    cy.clickSelect('[data-cy="programmeMembershipId"]', "acute");
    cy.get('[data-cy="programmeMembershipId"]').contains(
      `Acute medicine (start: ${dayjs().format("DD/MM/YYYY")})`
    );
    cy.get('[data-cy="form-linker-submit-btn"]').should("not.be.disabled");

    // test submit button
    cy.get('[data-cy="form-linker-submit-btn"]').click();
    cy.get("@onSubmit").should("be.calledOnce");
  });
  it("closes the modal when the escape key is pressed", () => {
    mountComponent();
    cy.get("dialog").should("be.visible");
    // first test validation with immediate submit
    cy.get('[data-cy="form-linker-submit-btn"]').click();
    cy.get("#isArcp--error-message").should("exist");
    cy.get('[data-cy="form-linker-submit-btn"]').should("be.disabled");
    // then exc key to close
    cy.get("body").type("{esc}");
    cy.get("dialog").should("not.be.visible");
  });
  it("renders the error message if no programmes are available", () => {
    store.dispatch(
      updatedTraineeProfileData({
        traineeTisId: "12345",
        personalDetails: mockPersonalDetails,
        programmeMemberships: [],
        placements: []
      })
    );
    mountComponent();
    cy.get('[data-cy="error-header-text"]')
      .should("exist")
      .should("contain.text", "Oops! Something went wrong");
    cy.get('[data-cy="error-message-text"]')
      .should("exist")
      .should("include.text", "You have no Programmes on TIS Self-Service ");
  });
  it("renders the error message if no linked programme options are available for the ARCP user to select.", () => {
    store.dispatch(
      updatedTraineeProfileData({
        traineeTisId: "12345",
        personalDetails: mockPersonalDetails,
        programmeMemberships: mockProgrammesForLinkerTestOutsideArcp,
        placements: []
      })
    );
    mountComponent();
    cy.get('[data-cy="formWarning"]').should("not.exist");
    cy.get('[data-cy="isArcp1"]').click();
    cy.get('[data-cy="error-header-text"]').should("not.exist");
    cy.get('[data-cy="error-message-text"]').should("not.exist");
    cy.get('[data-cy="programmeMembershipId"]').should("exist");
    cy.get('[data-cy="form-linker-submit-btn"]').should("be.disabled");
    cy.clickSelect('[data-cy="programmeMembershipId"]');
    cy.get('[data-cy="form-linker-submit-btn"]').should("not.be.disabled");

    cy.get('[data-cy="isArcp0"]').click();
    cy.get('[data-cy="error-header-text"]')
      .should("exist")
      .should("contain.text", "Oops! Something went wrong");
    cy.get('[data-cy="error-message-text"]')
      .should("exist")
      .should(
        "include.text",
        "You have no active programmes to link this form to."
      );
    cy.get('[data-cy="form-linker-submit-btn"]').should("be.disabled");
  });
  it("renders the error message if no linked programme options are available for the New Starter user to select.", () => {
    store.dispatch(
      updatedTraineeProfileData({
        traineeTisId: "12345",
        personalDetails: mockPersonalDetails,
        programmeMemberships: mockProgrammesForLinkerTestOutsideNewStarter,
        placements: []
      })
    );
    mountComponent({ warningText: "This is a warning message" });
    cy.get('[data-cy="formWarning"]').should("exist");
    cy.get('[data-cy="isArcp0"]').click();
    cy.get('[data-cy="error-header-text"]').should("not.exist");
    cy.clickSelect('[data-cy="programmeMembershipId"]');
    cy.get('[data-cy="form-linker-submit-btn"]').should("not.be.disabled");
    cy.get('[data-cy="isArcp1"]').click();
    cy.get('[data-cy="error-header-text"]').should("exist");
    cy.get('[data-cy="form-linker-submit-btn"]').should("be.disabled");
  });
});
