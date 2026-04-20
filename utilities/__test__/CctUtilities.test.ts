import { calcCctDate, calculateAllChanges } from "../CctUtilities";
import { CctChangeType } from "../../redux/slices/cctSlice";
import testCases from "./cct-calc-test-cases.json";

describe("calcCctDate", () => {
  it.each(testCases.calculateCctDate)("$description", ({ input, expected }) => {
    const result = calcCctDate(
      input.currentProgEndDate,
      input.changeStartDate,
      input.changeEndDate,
      input.newWte
    );
    expect(result).toBe(expected);
  });
});

describe("calculateAllChanges", () => {
  it.each(testCases.calculateAllCctChanges)(
    "$description",
    ({
      programmeEndDate,
      changes,
      expectedFinalCctDate,
      expectedDaysAdded
    }) => {
      const result = calculateAllChanges(
        changes as CctChangeType[],
        programmeEndDate
      );
      expect(result.map(c => c.daysAdded)).toEqual(expectedDaysAdded);
      const finalDate = result.at(-1)?.resultingCctDate ?? programmeEndDate;
      expect(finalDate).toBe(expectedFinalCctDate);
    }
  );
});
