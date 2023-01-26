import React from "react";
import FieldWarningMsg from "../../components/forms/FieldWarningMsg";
import { FormRUtilities } from "../FormRUtilities";
import { CHECK_POSTCODE_REGEX } from "../Constants";

describe("FormRUtilities", () => {
  const matcher = CHECK_POSTCODE_REGEX;
  const warningMsg =
    "Warning. Non-UK Postcode (Please ignore if you meant it.)";
  it("should return undefined (no warning) if no field to check", () => {
    const field = null;
    expect(
      FormRUtilities.showFieldMatchWarning(field, matcher, warningMsg)
    ).toBe(null);
  });
  it("should return undefined (no warning) if valid UK postcode format", () => {
    const field = "M3 7AQ";
    expect(
      FormRUtilities.showFieldMatchWarning(field, matcher, warningMsg)
    ).toBe(null);
  });
  it("should return warning msg if non-UK postcode format", () => {
    const field = "123456";
    expect(
      FormRUtilities.showFieldMatchWarning(field, matcher, warningMsg)
    ).toStrictEqual(
      <FieldWarningMsg warningMsg="Warning. Non-UK Postcode (Please ignore if you meant it.)" />
    );
  });
  it("should return value if data (string) provided", () => {
    const value = "Super Compliment";
    expect(FormRUtilities.showMsgIfEmpty(value)).toBe(value);
  });
  it("should return given message if no data (empty string) provided", () => {
    const value = "";
    const message = "This is my message if no data";
    expect(FormRUtilities.showMsgIfEmpty(value, message)).toBe(message);
  });
  it("should return default message if no value (empty string) and no message provided", () => {
    const value = "";
    expect(FormRUtilities.showMsgIfEmpty(value)).toBe("None recorded");
  });
});
