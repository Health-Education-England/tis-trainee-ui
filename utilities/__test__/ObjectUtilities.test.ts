import { isDeepEqual } from "../ObjectUtilities";

describe("isDeepEqual", () => {
  it("is true for objects with the same values in a different key order", () => {
    expect(isDeepEqual({ a: 1, b: "x" }, { b: "x", a: 1 })).toBe(true);
  });

  it("compares nested objects and arrays by value", () => {
    expect(
      isDeepEqual({ list: [{ a: 1 }, null] }, { list: [{ a: 1 }, null] })
    ).toBe(true);
    expect(isDeepEqual({ list: [{ a: 1 }] }, { list: [{ a: 2 }] })).toBe(false);
  });

  it("is false for arrays in a different order or of a different length", () => {
    expect(isDeepEqual([1, 2], [2, 1])).toBe(false);
    expect(isDeepEqual([1], [1, 1])).toBe(false);
  });

  it("tells a missing key from a key set to undefined", () => {
    expect(isDeepEqual({ a: undefined }, { b: 1 })).toBe(false);
    expect(isDeepEqual({ a: undefined }, {})).toBe(false);
  });

  it("tells null, an empty string, an empty object and an empty array apart", () => {
    expect(isDeepEqual(null, "")).toBe(false);
    expect(isDeepEqual(null, {})).toBe(false);
    expect(isDeepEqual("", {})).toBe(false);
    expect(isDeepEqual([], {})).toBe(false);
  });
});
