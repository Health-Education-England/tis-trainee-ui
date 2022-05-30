import { BooleanUtilities } from "../BooleanUtilities";

describe("BooleanUtilities", () => {
  it("ToYesNo should return 'Yes' for true value", () => {
    expect(BooleanUtilities.ToYesNo(true)).toEqual("Yes");
  });

  it("ToYesNo should return 'No' for false value", () => {
    expect(BooleanUtilities.ToYesNo(false)).toEqual("No");
  });

  it("ToYesNo should return 'No' for undefined or null value", () => {
    expect(BooleanUtilities.ToYesNo(undefined)).toEqual("No");
    expect(BooleanUtilities.ToYesNo(null)).toEqual("No");
  });

  it("ToYesNo should return 'No' for 'true' value", () => {
    expect(BooleanUtilities.ToYesNo("true")).toEqual("Yes");
  });

  it("ToYesNo should return 'No' for 'false' value", () => {
    expect(BooleanUtilities.ToYesNo("false")).toEqual("No");
  });

  it("ToBoolean should return true for 'true'", () => {
    expect(BooleanUtilities.ToBoolean("true")).toEqual(true);
  });

  it("ToBoolean should return false for value other than 'true' ", () => {
    expect(BooleanUtilities.ToBoolean("false")).toEqual(false);
  });

  it("ToBoolean should return false for undefined or null value", () => {
    expect(BooleanUtilities.ToBoolean(undefined)).toEqual(false);
    expect(BooleanUtilities.ToBoolean(null)).toEqual(false);
  });
});
