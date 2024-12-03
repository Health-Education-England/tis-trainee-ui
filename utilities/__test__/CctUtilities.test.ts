import dayjs from "dayjs";
import { CctChangeType } from "../../redux/slices/cctSlice";
import { calcLtftChange } from "../CctUtilities";

describe("calculateNewEndDates", () => {
  const mockCurrentDate = new Date("2024-12-03T13:55:27.000Z");
  const changeStartDate = dayjs(mockCurrentDate)
    .add(16, "weeks")
    .format("YYYY-MM-DD");
  beforeAll(() => {
    jest.spyOn(Date, "now").mockImplementation(() => mockCurrentDate.getTime());
  });

  afterAll(() => {
    jest.spyOn(Date, "now").mockRestore();
  });

  // Note purposely not added any test for e.g. startWte === wte, negative values etc. because bullet-proof FE validation catches these before this function is called.

  it("should return the indicative completion date for a single LTFT change", () => {
    const currProgEndDate = dayjs(mockCurrentDate)
      .add(1701, "days")
      .format("YYYY-MM-DD");
    const startWte = 1;
    const change: CctChangeType = {
      type: "LTFT",
      startDate: changeStartDate,
      endDate: "",
      wte: 0.5
    };
    const expectedEndDate = "2033-12-06";
    expect(calcLtftChange(currProgEndDate, startWte, change)).toBe(
      expectedEndDate
    );
  });

  it("should return the indicative completion date for a single WTE increase change", () => {
    const currProgEndDate = "2033-12-06";
    const startWte = 0.5;
    const change: CctChangeType = {
      type: "LTFT",
      startDate: changeStartDate,
      endDate: "",
      wte: 1.0
    };
    const expectedEndDate = "2029-07-31";
    expect(calcLtftChange(currProgEndDate, startWte, change)).toBe(
      expectedEndDate
    );
  });
});
