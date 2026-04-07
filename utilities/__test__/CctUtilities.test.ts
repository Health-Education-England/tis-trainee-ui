import { calcCctDate } from "../CctUtilities";
import testCases from "./cct-calc-test-cases.json";

describe("calcCctDate", () => {
  it.each(testCases.calcCctDate)("$description", ({ input, expected }) => {
    const result = calcCctDate(
      input.currentProgEndDate,
      input.currentWte,
      input.newWte,
      input.changeStartDate
    );
    expect(result).toBe(expected);
  });
});
