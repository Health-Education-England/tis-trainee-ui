import React from "react";
import { render, screen } from "@testing-library/react";
import { TextArea } from "../TextArea";

// Mock the FormContext
jest.mock("../../FormContext", () => ({
  useFormContext: () => ({
    handleBlur: jest.fn(),
    handleChange: jest.fn()
  })
}));

describe("TextArea Component", () => {
  const defaultProps = {
    name: "test-textarea",
    label: "Test Label",
    fieldError: "",
    value: ""
  };

  test("renders textarea with default maxLength of 1000", () => {
    render(<TextArea {...defaultProps} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("maxLength", "1000");
    expect(
      screen.getByText("You have 1000 characters remaining")
    ).toBeInTheDocument();
  });

  test("applies custom maxLength when provided", () => {
    render(<TextArea {...defaultProps} maxLength={500} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("maxLength", "500");
    expect(
      screen.getByText("You have 500 characters remaining")
    ).toBeInTheDocument();
  });

  test("calculates remaining characters correctly", () => {
    render(
      <TextArea {...defaultProps} value="Hello, world!" maxLength={100} />
    );
    expect(
      screen.getByText("You have 87 characters remaining")
    ).toBeInTheDocument();
  });

  test("hides character count when showCharCount is false", () => {
    render(<TextArea {...defaultProps} showCharCount={false} />);

    expect(screen.queryByText(/characters remaining/)).not.toBeInTheDocument();
  });

  test("shows character count by default (showCharCount=true)", () => {
    render(<TextArea {...defaultProps} />);

    expect(screen.getByText(/characters remaining/)).toBeInTheDocument();
  });

  test("shows zero characters remaining when text equals maxLength", () => {
    const exactLengthText = "A".repeat(50);
    render(
      <TextArea {...defaultProps} value={exactLengthText} maxLength={50} />
    );

    expect(
      screen.getByText("You have 0 characters remaining")
    ).toBeInTheDocument();
  });
});
