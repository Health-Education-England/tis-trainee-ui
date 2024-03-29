import dayjs from "dayjs";
import { mockPlacements } from "../../mock-data/trainee-profile";
import { DateUtilities, isWithinRange } from "../DateUtilities";

describe("DateUtilities", () => {
  const now = dayjs();
  const yesterday = now.subtract(1, "day").toDate();
  const tomorrow = now.add(1, "day").toDate();
  const today = now.toDate();
  const belowLegalAge = now.subtract(17, "year").toDate();
  const legalAge = now.subtract(18, "year").toDate();

  it("ToLocalDateTime should return date in DD/MM/YYYY HH:mm format", () => {
    expect(DateUtilities.ToLocalDateTime(new Date("2020-04-20 12:42"))).toEqual(
      "20/04/2020 12:42"
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

  it("IsLegalAge should return true if age is 18 or above", () => {
    expect(DateUtilities.IsLegalAge(legalAge)).toEqual(true);
  });

  it("IsLegalAge should return false if age is below 18", () => {
    expect(DateUtilities.IsLegalAge(belowLegalAge)).toEqual(false);
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
  it("isWithinRange should return false if given date is undefined", () => {
    expect(isWithinRange(undefined)).toEqual(false);
  });
  it("isWithinRange should return false if given date is null", () => {
    expect(isWithinRange(null)).toEqual(false);
  });
  it("isWithinRange should return false if given date is empty string", () => {
    expect(isWithinRange("")).toEqual(false);
  });
  it("isWithinRange should return false if given date is non-date string", () => {
    expect(isWithinRange("nodate")).toEqual(false);
  });
  it("isWithinRange should return false if given date is outside range", () => {
    const outsideDate = dayjs().subtract(31, "d").toDate();
    expect(isWithinRange(outsideDate, 31, "d")).toEqual(false);
  });
  it("isWithinRange should return true if given date is inside range", () => {
    const insideDate = dayjs().subtract(30, "d").toDate();
    expect(isWithinRange(insideDate, 31, "d")).toEqual(true);
  });
  it("isWithinRange should still return true if given date is inside range and value passed for dateToCompare is undefined", () => {
    const insideDate = dayjs().subtract(30, "d").toDate();
    expect(isWithinRange(insideDate, 31, "d")).toEqual(true);
  });
  it("isWithinRange should still return false if given date is outside range and value passed for dateToCompare is null", () => {
    const insideDate = dayjs().subtract(31, "d").toDate();
    expect(isWithinRange(insideDate, 31, "d", null)).toEqual(false);
  });
  it("should order array in desc order when genericSort desc prop is true", () => {
    const descMockPl = [...mockPlacements].reverse();
    expect(
      DateUtilities.genericSort(mockPlacements, "startDate", true)
    ).toEqual(descMockPl);
  });
  it("should order array in asc order when genericSort desc prop is false", () => {
    expect(
      DateUtilities.genericSort(mockPlacements, "startDate", false)
    ).toEqual(mockPlacements);
  });
  it("should return the UK timezone date plus GMT for a given date that falls within GMT", () => {
    const inputDate = new Date("2023-10-29T02:00:00.995683500Z");
    const expectedDate = "29/10/2023 02:00 (GMT)";
    expect(DateUtilities.ConvertToLondonTime(inputDate)).toEqual(expectedDate);
  });
  it("should default to GMT when an ambiguous October UTC date provided", () => {
    const inputDate = new Date("2023-10-29T01:59:59.995683500Z");
    const expectedDate = "29/10/2023 01:59 (GMT)";
    expect(DateUtilities.ConvertToLondonTime(inputDate)).toEqual(expectedDate);
  });
  it("should return a valid BST date for a valid date string type ", () => {
    const inputDate = "2023-03-26T01:00:00.065683500Z";
    const expectedDate = "26/03/2023 02:00 (BST)";
    expect(DateUtilities.ConvertToLondonTime(inputDate)).toEqual(expectedDate);
  });
  it("should return the UK timezone date plus seconds if the includeSecs param is true ", () => {
    const inputDate = new Date("2023-03-26T00:59:59.065683500Z");
    const expectedDate = "26/03/2023 00:59:59 (GMT)";
    expect(DateUtilities.ConvertToLondonTime(inputDate, true)).toEqual(
      expectedDate
    );
  });
  it("should return No date provided msg for no date ", () => {
    let inputDate = undefined;
    const expectedDate = "No date provided";
    expect(DateUtilities.ConvertToLondonTime(inputDate)).toEqual(expectedDate);
    inputDate = null;
    expect(DateUtilities.ConvertToLondonTime(inputDate)).toEqual(expectedDate);
  });
  it("should return Invalid date provided msg for invalid date ", () => {
    const inputDate = "invalid date";
    const expectedDate = "Invalid date provided";
    expect(DateUtilities.ConvertToLondonTime(inputDate)).toEqual(expectedDate);
  });

  // Note: Some test conditions covered by cypress comp tests so tried not to duplicate.
  // See coverage.json generated on PR or locally via 'npm run local:report-combined' for more info.
});
