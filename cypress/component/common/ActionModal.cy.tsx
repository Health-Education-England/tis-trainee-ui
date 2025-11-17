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
});
