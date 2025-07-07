import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QRCodeSVG } from "qrcode.react";
import { RenderQRCodeContent } from "../VerifyTotp";

// Mock dependencies
jest.mock("qrcode.react", () => ({
  QRCodeSVG: jest.fn(() => <div data-testid="mocked-qr-code" />)
}));

jest.mock("../../../../common/Loading", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-component">Loading...</div>
}));

jest.mock("../../../../common/ErrorPage", () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid="error-page">{message}</div>
  )
}));

describe("RenderQRCodeContent", () => {
  const defaultProps = {
    qrCode: "testQRCodeValue",
    isLoading: false,
    isExpired: false,
    errorQR: false,
    generateQrCode: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state correctly", () => {
    render(<RenderQRCodeContent {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Generating your QR code...")).toBeInTheDocument();
    expect(screen.getByTestId("loading-component")).toBeInTheDocument();
  });

  test("renders error state correctly and handles button click", () => {
    render(<RenderQRCodeContent {...defaultProps} errorQR={true} />);

    expect(screen.getByTestId("error-page")).toBeInTheDocument();
    expect(screen.getByText("Generate new QR Code")).toBeInTheDocument();

    const button = screen.getByRole("button", {
      name: /Generate new QR Code/i
    });
    fireEvent.click(button);

    expect(defaultProps.generateQrCode).toHaveBeenCalledTimes(1);
  });

  test("renders expired state correctly and handles button click", () => {
    render(<RenderQRCodeContent {...defaultProps} isExpired={true} />);

    expect(
      screen.getByText("The QR code has expired. Please generate a new one.")
    ).toBeInTheDocument();
    expect(screen.getByText("Generate New QR Code")).toBeInTheDocument();

    const button = screen.getByRole("button", {
      name: /Generate New QR Code/i
    });
    fireEvent.click(button);

    expect(defaultProps.generateQrCode).toHaveBeenCalledTimes(1);
  });

  test("renders QR code when in normal state", () => {
    render(<RenderQRCodeContent {...defaultProps} />);

    expect(screen.getByTestId("mocked-qr-code")).toBeInTheDocument();
    expect(QRCodeSVG).toHaveBeenCalledWith(
      expect.objectContaining({
        value: "testQRCodeValue"
      }),
      expect.anything()
    );
  });
});
