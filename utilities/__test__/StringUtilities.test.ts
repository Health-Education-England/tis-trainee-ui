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
  it("should round an over-precise no. to 2 d.p.", () => {
    expect(StringUtilities.TrimZeros("0.750000012")).toEqual("0.75");
  });
  it("should round an over-precise no. to 1 d.p. when the 2nd d.p. is zero", () => {
    expect(StringUtilities.TrimZeros("0.600000024")).toEqual("0.6");
  });
  it("should return 'value not given' for zero plus trailing zero", () => {
    const wte = "0.0";
    expect(StringUtilities.TrimZeros(wte)).toEqual("Value not given");
  });
  it("should round to a max of 2 d.p., dropping any trailing zero", () => {
    expect(StringUtilities.RoundTo2Dp("0.600000024")).toEqual("0.6");
    expect(StringUtilities.RoundTo2Dp("0.750000012")).toEqual("0.75");
    expect(StringUtilities.RoundTo2Dp("1.000")).toEqual("1");
    expect(StringUtilities.RoundTo2Dp("0.69")).toEqual("0.69");
  });
  it("should return the original string if it is not a number", () => {
    expect(StringUtilities.RoundTo2Dp("not a number")).toEqual("not a number");
  });
  it("should not turn a cleared field into zero", () => {
    expect(StringUtilities.RoundTo2Dp("")).toEqual("");
    expect(StringUtilities.RoundTo2Dp(null as unknown as string)).toBeNull();
    expect(
      StringUtilities.RoundTo2Dp(undefined as unknown as string)
    ).toBeUndefined();
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

describe("capitalize", () => {
  it("should capitalize the first letter and lowercase the rest", () => {
    expect(StringUtilities.capitalize("SUBMITTED")).toEqual("Submitted");
  });
  it("should leave underscores untouched", () => {
    expect(StringUtilities.capitalize("UNDER_REVIEW")).toEqual(
      "Under_review"
    );
  });
  it("should return the original value if blank", () => {
    expect(StringUtilities.capitalize("")).toEqual("");
    expect(StringUtilities.capitalize(undefined as unknown as string)).toEqual(
      undefined
    );
  });
});

describe("replaceUnderscoresWithSpaces", () => {
  it("should replace underscores with spaces", () => {
    expect(StringUtilities.replaceUnderscoresWithSpaces("UNDER_REVIEW")).toEqual(
      "UNDER REVIEW"
    );
  });
  it("should leave case untouched", () => {
    expect(StringUtilities.replaceUnderscoresWithSpaces("submitted")).toEqual(
      "submitted"
    );
  });
  it("should return the original value if blank", () => {
    expect(StringUtilities.replaceUnderscoresWithSpaces("")).toEqual("");
    expect(
      StringUtilities.replaceUnderscoresWithSpaces(undefined as unknown as string)
    ).toEqual(undefined);
  });
});

describe("toSentenceCase", () => {
  it("should capitalize the first letter and lowercase the rest", () => {
    expect(StringUtilities.toSentenceCase("SUBMITTED")).toEqual("Submitted");
  });
  it("should replace underscores with spaces", () => {
    expect(StringUtilities.toSentenceCase("UNDER_REVIEW")).toEqual(
      "Under review"
    );
  });
  it("should return the original value if blank", () => {
    expect(StringUtilities.toSentenceCase("")).toEqual("");
    expect(
      StringUtilities.toSentenceCase(undefined as unknown as string)
    ).toEqual(undefined);
  });
});
