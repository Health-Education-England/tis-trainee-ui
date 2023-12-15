import dayjs from "dayjs";
import { isLatestSubmissionDateWithinLastYear } from "../ActionSummaryUtilities";

describe("isLatestSubmissionDateWithinLastYear", () => {
  it("should return true when latest submission date is within the last year.", () => {
    const lastSubStartDate = dayjs().subtract(1, "year").add(1, "day").toDate();
    expect(isLatestSubmissionDateWithinLastYear(lastSubStartDate)).toBe(true);
  });
  it("should return true when latest submission date is today.", () => {
    const lastSubStartDate = dayjs().toDate();
    expect(isLatestSubmissionDateWithinLastYear(lastSubStartDate)).toBe(true);
  });
  it("should return false when latest submission date is exactly a year ago.", () => {
    const lastSubStartDate = dayjs().subtract(1, "year").toDate();
    expect(isLatestSubmissionDateWithinLastYear(lastSubStartDate)).toBe(false);
  });
  it("should return false when latest submission date is more than a year ago.", () => {
    const lastSubStartDate = dayjs()
      .subtract(1, "year")
      .subtract(1, "day")
      .toDate();
    expect(isLatestSubmissionDateWithinLastYear(lastSubStartDate)).toBe(false);
  });
});
