import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LtftNameModal } from "../LtftNameModal";

// Mock Dialog methods that JSDOM doesn't support
HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();

const mockUseSubmitting = { isSubmitting: false };
jest.mock("../../../../utilities/hooks/useSubmitting", () => ({
  useSubmitting: () => mockUseSubmitting
}));

describe("LtftNameModal", () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isOpen: true,
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSubmitting.isSubmitting = false;
  });

  it("displays the warning confirmation message", () => {
    render(<LtftNameModal {...defaultProps} />);

    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Please check the details of the form carefully before submission/i
      )
    ).toBeInTheDocument();
  });

  it("calls onSubmit when Confirm & Continue button is clicked", async () => {
    const user = userEvent.setup();
    render(<LtftNameModal {...defaultProps} />);

    await act(async () => {
      await user.click(screen.getByText("Confirm & Continue"));
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows submitting text when form is being submitted", () => {
    mockUseSubmitting.isSubmitting = true;

    render(<LtftNameModal {...defaultProps} />);

    expect(screen.getByText("Submitting...")).toBeInTheDocument();
  });
});
