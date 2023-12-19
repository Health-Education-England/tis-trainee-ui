import {
  isLatestSubmissionDateYearPlus,
  isLatestSubmissionDateWithinLastYear
} from "../ActionSummaryUtilities";
import {
  dateExactlyYearAgo,
  dateMoreThanYearAgo,
  dateWithinYear,
  todayDate
} from "../DateUtilities";

describe("isLatestSubmissionDateWithinLastYear", () => {
  it("should return true when latest submission date is within the last year.", () => {
    expect(isLatestSubmissionDateWithinLastYear(dateWithinYear)).toBe(true);
  });
  it("should return true when latest submission date is today.", () => {
    expect(isLatestSubmissionDateWithinLastYear(todayDate)).toBe(true);
  });
  it("should return false when latest submission date is exactly a year ago.", () => {
    expect(isLatestSubmissionDateWithinLastYear(dateExactlyYearAgo)).toBe(
      false
    );
  });
  it("should return false when latest submission date is more than a year ago.", () => {
    expect(isLatestSubmissionDateWithinLastYear(dateMoreThanYearAgo)).toBe(
      false
    );
  });
});

describe("isLatestSubmissionDateYearPlus", () => {
  it("should return true when latest submission date is more than a year ago.", () => {
    expect(isLatestSubmissionDateYearPlus(dateMoreThanYearAgo)).toBe(true);
  });
  it("should return false when latest submission date is within the last year.", () => {
    expect(isLatestSubmissionDateYearPlus(dateWithinYear)).toBe(false);
  });
  it("should return true when latest submission date is exactly a year ago.", () => {
    expect(isLatestSubmissionDateYearPlus(dateExactlyYearAgo)).toBe(true);
  });
});
