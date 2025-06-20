import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SaveAndExitButton } from "../../SaveAndExitButton";
import { FormName } from "../../form-builder/FormBuilder";

describe("SaveAndExitButton", () => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    onClick: mockOnClick,
    isSubmitting: false,
    isAutosaving: false,
    formName: "formA" as FormName
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with 'Save & exit' text when not saving", () => {
    render(<SaveAndExitButton {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Save & exit");
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("data-cy", "BtnSaveExit-formA");
  });

  it("is disabled with 'Saving...' text when isSubmitting is true", () => {
    render(<SaveAndExitButton {...defaultProps} isSubmitting={true} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Saving...");
    expect(button).toBeDisabled();
  });

  it("is disabled with 'Saving...' text when isAutosaving is true", () => {
    render(<SaveAndExitButton {...defaultProps} isAutosaving={true} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Saving...");
    expect(button).toBeDisabled();
  });

  it("is disabled when both isSubmitting and isAutosaving are true", () => {
    render(
      <SaveAndExitButton
        {...defaultProps}
        isSubmitting={true}
        isAutosaving={true}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Saving...");
    expect(button).toBeDisabled();
  });

  it("calls onClick handler when clicked", () => {
    render(<SaveAndExitButton {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders with correct data-cy attribute based on formName", () => {
    render(<SaveAndExitButton {...defaultProps} formName="formB" />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-cy", "BtnSaveExit-formB");
  });
});
