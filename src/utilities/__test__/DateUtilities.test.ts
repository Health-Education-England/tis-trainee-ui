import dayjs from "dayjs";
import { DateUtilities } from "../DateUtilities";

describe("DateUtilities", () => {
  const now = dayjs();
  const yesterday = now.subtract(1, "day").toDate();
  const tomorrow = now.add(1, "day").toDate();
  const today = now.toDate();

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

  it("IsLegalAge should return true if date is null", () => {
    expect(DateUtilities.IsLegalAge(null)).toEqual(true);
  });

  it("IsLegalAge should return true if age is above 18", () => {
    expect(DateUtilities.IsLegalAge(new Date("2000-04-20"))).toEqual(true);
  });

  it("IsLegalAge should return false if age is below 18", () => {
    expect(DateUtilities.IsLegalAge(new Date("2019-04-20"))).toEqual(false);
  });

  it("IsPastDate should return true if date is null", () => {
    expect(DateUtilities.IsPastDate(null)).toEqual(true);
  });

  it("IsPastDate should return true if date is past date", () => {
    expect(DateUtilities.IsPastDate(yesterday)).toEqual(true);
  });

  it("IsPastDate should return true if date is today's date", () => {
    expect(DateUtilities.IsPastDate(today)).toEqual(true);
  });

  it("IsPastDate should return false if date is future date", () => {
    expect(DateUtilities.IsPastDate(tomorrow)).toEqual(false);
  });

  it("IsFutureDate should return true if date is null", () => {
    expect(DateUtilities.IsFutureDate(null)).toEqual(true);
  });

  it("IsFutureDate should return false if date is past date", () => {
    expect(DateUtilities.IsFutureDate(yesterday)).toEqual(false);
  });

  it("IsFutureDate should return true if date is future date", () => {
    expect(DateUtilities.IsFutureDate(tomorrow)).toEqual(true);
  });

  it("IsFutureDate should return true if date is today's date", () => {
    expect(DateUtilities.IsFutureDate(today)).toEqual(true);
  });

  it("should accept a date type of ISO_8601", () => {
    expect(DateUtilities.IsFutureDate(tomorrow.toISOString())).toEqual(true);
  });

  it("IsInsideDateRange should return true using ISO_8601 format", () => {
    expect(DateUtilities.IsInsideDateRange(today.toISOString())).toEqual(true);
  });
  it("IsInsideDateRange should return true if null value", () => {
    expect(DateUtilities.IsInsideDateRange(null)).toEqual(true);
  });
  it("IsMoreThanMinDate should return true if null value ", () => {
    expect(DateUtilities.IsMoreThanMinDate(null)).toEqual(true);
  });
  it("IsMoreThanMinDate should return true if null value ", () => {
    expect(DateUtilities.IsLessThanMaxDate(null)).toEqual(true);
  });
  // Note: Some test conditions covered by cypress comp tests so tried not to duplicate.
  // See coverage.json generated on PR or locally via 'npm run local:report-combined' for more info.
});
