import { StringUtilities } from "../StringUtilities";

describe("StringUtilities", () => {
  it("should return 'not given' if blank", () => {
    const wte = "";
    expect(StringUtilities.TrimZeros(wte)).toEqual("Value not given");
  });
  it("should return '1' if first char is '1' ", () => {
    const wte = "1.000";
    expect(StringUtilities.TrimZeros(wte)).toEqual("1");
  });
  it("should return wte if number is < 2 d.p ", () => {
    const wte = "0.9";
    expect(StringUtilities.TrimZeros(wte)).toEqual(wte);
  });
  it("should return trimmed no. if 2nd d.p. is zero", () => {
    const wte = "0.10";
    expect(StringUtilities.TrimZeros(wte)).toEqual("0.1");
  });
  it("should return trimmed no. if 3rd d.p. is zero", () => {
    const wte = "0.1200";
    expect(StringUtilities.TrimZeros(wte)).toEqual("0.12");
  });
  it("should return 'value not given' for zero plus trailing zero", () => {
    const wte = "0.0";
    expect(StringUtilities.TrimZeros(wte)).toEqual("Value not given");
  });
  it("should concat to a single string without the null args", () => {
    const pType = "Placement Type";
    const pGrade = null;
    const pSpec = "Placement Spec";
    expect(StringUtilities.argsToString(pType, pGrade, pSpec)).toEqual(
      "Placement Type Placement Spec"
    );
  });

  // validate integer
  it("should return null if the value is null", () => {
    expect(StringUtilities.validateInteger(null)).toBe(null);
  });
  it("should return null if the value is undefined", () => {
    expect(StringUtilities.validateInteger(undefined)).toBe(null);
  });
  it("should return null if the value is a valid integer", () => {
    expect(StringUtilities.validateInteger(42)).toBe(null);
  });
  it("should return an error message if the value is a decimal", () => {
    expect(StringUtilities.validateInteger(3.14)).toBe(
      "Whole numbers only. No decimals please."
    );
  });
});
