import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LtftNameModal } from "../LtftNameModal";

// Mock Dialog methods that JSDOM doesn't support
HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();

jest.mock("../../../../utilities/hooks/useSubmitting", () => ({
  useSubmitting: () => ({ isSubmitting: false })
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
  });

  it("calls onSubmit with the correct name data when form is submitted", async () => {
    const user = userEvent.setup();
    render(<LtftNameModal {...defaultProps} />);

    const nameInput = screen.getByLabelText(
      /Please give your Changing hours \(LTFT\) application a name/i
    );

    await act(async () => {
      await user.type(nameInput, "Test Application");
    });

    await act(async () => {
      await user.click(screen.getByText("Confirm & Continue"));
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(
        { name: "Test Application" },
        expect.anything()
      );
    });
  });
});
