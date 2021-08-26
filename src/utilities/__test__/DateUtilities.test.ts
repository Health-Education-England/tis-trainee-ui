import { DateUtilities } from "../DateUtilities";

describe("DateUtilities", () => {
  it("ToLocalDate should return date in DD/MM/YYYY format", () => {
    expect(DateUtilities.ToLocalDate(new Date("2020-04-20"))).toEqual(
      "20/04/2020"
    );
  });

  it("ToLocalDate should return empty string if date is null", () => {
    expect(DateUtilities.ToLocalDate(null)).toEqual("");
  });

  it("ToLocalDate should return empty string if date is invalid", () => {
    expect(DateUtilities.ToLocalDate("invalid")).toEqual("");
  });

  it("ToUTCDate should return date in YYYY-MM-DD format", () => {
    expect(DateUtilities.ToUTCDate(new Date("2020-04-20"))).toEqual(
      "2020-04-20"
    );
  });

  it("ToUTCDate should return empty string if date is null", () => {
    expect(DateUtilities.ToUTCDate(null)).toEqual("");
  });

  it("ToUTCDate should return empty string if date is invalid", () => {
    expect(DateUtilities.ToUTCDate("invalid")).toEqual("");
  });

  it("IsLegalAge should return false if date is invalid", () => {
    expect(DateUtilities.IsLegalAge("invalid")).toEqual(false);
  });

  it("IsLegalAge should return true if age is above 18", () => {
    expect(DateUtilities.IsLegalAge(new Date("2000-04-20"))).toEqual(true);
  });

  it("IsLegalAge should return false if age is below 18", () => {
    expect(DateUtilities.IsLegalAge(new Date("2019-04-20"))).toEqual(false);
  });

  it("IsPastDate should return false if date is invalid", () => {
    expect(DateUtilities.IsPastDate("invalid")).toEqual(false);
  });

  it("IsPastDate should return true if date is past date", () => {
    expect(DateUtilities.IsPastDate(new Date("2000-04-20"))).toEqual(true);
  });

  it("IsPastDate should return false if date is future date", () => {
    expect(DateUtilities.IsPastDate(new Date("2025-04-20"))).toEqual(false);
  });

  it("IsFutureDate should return false if date is invalid", () => {
    expect(DateUtilities.IsFutureDate("invalid")).toEqual(false);
  });

  it("IsFutureDate should return false if date is past date", () => {
    expect(DateUtilities.IsFutureDate(new Date("2000-04-20"))).toEqual(false);
  });

  it("IsFutureDate should return true if date is future date", () => {
    expect(DateUtilities.IsFutureDate(new Date("2025-04-20"))).toEqual(true);
  });

  it("should accept a date type of ISO_8601", () => {
    expect(DateUtilities.IsFutureDate(new Date("2025-04-25T02:00:00.000Z"))).toEqual(true);
  });

  it("IsInsideDateRange should return true using ISO_8601 format", () => {
    expect(DateUtilities.IsInsideDateRange(new Date("2020-04-20T02:00:00.000Z"))).toEqual(true);
  });
});
