import { mount } from "cypress/react";
import { ActionModal } from "../../../components/common/ActionModal";
import { sureText, ACTION_CONFIG } from "../../../utilities/Constants";

const baseProps = {
  isOpen: true,
  cancelBtnText: "Cancel",
  warningLabel: "Deleting",
  warningText: sureText,
  submittingBtnText: "Deleting",
  isSubmitting: false
};

function mountActionModal(customProps = {}) {
  const defaultProps = {
    ...baseProps,
    onSubmit: cy.stub().as("onSubmitHandler"),
    onClose: cy.stub().as("onCloseHandler")
  };
  const props = { ...defaultProps, ...customProps };
  return mount(<ActionModal {...props} />);
}

describe("ActionModal", () => {
  it("shows normal state when not submitting", () => {
    mountActionModal(); // default props

    cy.get('[data-cy="submitBtn-Deleting"]')
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain", "Confirm & Continue");
  });

  it("shows submitting state when isSubmitting is true", () => {
    mountActionModal({
      isSubmitting: true
    });

    cy.get('[data-cy="submitBtn-Deleting"]')
      .should("be.visible")
      .should("be.disabled")
      .should("contain", "Deleting...");
  });

  it("displays additional info when provided", () => {
    mountActionModal({
      additionalInfo: ACTION_CONFIG.submit.additionalInfo
    });

    cy.get('[data-cy="additionalInfo"]')
      .should("be.visible")
      .should("contain", ACTION_CONFIG.submit.additionalInfo);
  });

  it("does not display additional info when not provided", () => {
    mountActionModal();

    cy.get('[data-cy="additionalInfo"]').should("not.exist");
  });

  describe("reason and supplementary message", () => {
    const reasonProps = {
      actionType: "Unsubmit" as const,
      warningLabel: "Unsubmit",
      submittingBtnText: "Unsubmitting"
    };

    it("keeps Confirm disabled until a reason is chosen", () => {
      mountActionModal(reasonProps);

      cy.get('[data-cy="submitBtn-Unsubmit"]').should("be.disabled");
      cy.get("#reason-2--label").click();
      cy.get('[data-cy="submitBtn-Unsubmit"]').should("not.be.disabled");
    });

    it("submits the chosen reason and the typed message", () => {
      mountActionModal(reasonProps);

      cy.get("#reason-2--label").click();
      cy.get("#reason-2").should("be.checked");
      cy.get('[data-cy="message"]').type("Pushing my start date back a month");
      cy.get('[data-cy="submitBtn-Unsubmit"]').click();

      cy.get("@onSubmitHandler").should("have.been.calledOnceWith", {
        reason: "changeStartDate",
        message: "Pushing my start date back a month"
      });
    });

    it("submits an empty message when none is typed", () => {
      mountActionModal(reasonProps);

      cy.get("#reason-3--label").click();
      cy.get('[data-cy="submitBtn-Unsubmit"]').click();

      cy.get("@onSubmitHandler").should("have.been.calledOnceWith", {
        reason: "other",
        message: ""
      });
    });

    it("submits a reason from the Withdraw set", () => {
      mountActionModal({
        actionType: "Withdraw" as const,
        warningLabel: "Withdraw",
        submittingBtnText: "Withdrawing"
      });

      cy.get("#reason-1--label").click();
      cy.get('[data-cy="submitBtn-Withdraw"]').click();

      cy.get("@onSubmitHandler").should("have.been.calledOnceWith", {
        reason: "changeOfCircs",
        message: ""
      });
    });

    it("does not render the reason fields for an action type without reasons", () => {
      mountActionModal({ actionType: "Delete" as const });

      cy.get('[data-cy="reason"]').should("not.exist");
      cy.get('[data-cy="message"]').should("not.exist");
      cy.get('[data-cy="submitBtn-Deleting"]').should("not.be.disabled");
    });
  });
});
