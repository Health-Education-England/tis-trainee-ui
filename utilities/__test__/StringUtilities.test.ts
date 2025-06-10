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
});
it("should return true when string 'true' is passed", () => {
  expect(StringUtilities.convertToBool("true")).toBe(true);
});

it("should return true when boolean true is passed", () => {
  expect(StringUtilities.convertToBool(true)).toBe(true);
});

it("should return false when string 'false' is passed", () => {
  expect(StringUtilities.convertToBool("false")).toBe(false);
});

it("should return false when boolean false is passed", () => {
  expect(StringUtilities.convertToBool(false)).toBe(false);
});

it("should return false when null is passed", () => {
  expect(StringUtilities.convertToBool(null)).toBe(false);
});

it("should return false when undefined is passed", () => {
  expect(StringUtilities.convertToBool(undefined)).toBe(false);
});

it("should return false when any other string is passed", () => {
  expect(StringUtilities.convertToBool("yes")).toBe(false);
  expect(StringUtilities.convertToBool("1")).toBe(false);
});

it("should handle case-insensitive 'true' strings", () => {
  expect(StringUtilities.convertToBool("TRUE")).toBe(true);
  expect(StringUtilities.convertToBool("True")).toBe(true);
  expect(StringUtilities.convertToBool("tRuE")).toBe(true);
});
