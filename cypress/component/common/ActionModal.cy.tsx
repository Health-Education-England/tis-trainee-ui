import { mount } from "cypress/react18";
import { ActionModal } from "../../../components/common/ActionModal";
import { sureText } from "../../../utilities/Constants";

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
});
