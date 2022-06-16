import FieldWarningMsg from "../../components/forms/FieldWarningMsg";
import { FormRUtilities } from "../FormRUtilities";

describe("FormRUtilities", () => {
  const matcher = /[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}/i;
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
  it("should return message if empty string detected", () => {
    const value = "";
    expect(FormRUtilities.defaultValueIfEmpty(value, "None provided")).toBe(
      "None provided"
    );
  });
  it("should return message if undefined string detected", () => {
    const value = undefined;
    expect(FormRUtilities.defaultValueIfEmpty(value, "None provided")).toBe(
      "None provided"
    );
  });
  it("should not return message if string detected", () => {
    const value = "Super Compliment";
    expect(FormRUtilities.defaultValueIfEmpty(value, "None provided")).toBe(
      undefined
    );
  });
});
