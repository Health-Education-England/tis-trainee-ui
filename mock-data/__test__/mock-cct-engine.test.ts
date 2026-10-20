import { CctChangeDto, CctProgrammeDetails } from "../../models/CctTypes";
import { calculateCctResult, wteMonthsFor } from "../mock-cct-engine";

const longProgramme: CctProgrammeDetails = {
  specialty: "Long comparison programme",
  startDate: "2018-01-01",
  lengthMonths: 120,
  startGrade: "ST1",
  startGradeOverrideNotes: "",
  additionalMonths: 0,
  additionalMonthsNotes: "",
  acceleratedMonths: 0,
  acceleratedMonthsNotes: "",
  eighteenMonthFinalGrade: null,
  eighteenMonthFinalGradeNotes: "",
  skippedGrade: null,
  skippedGradeNotes: ""
};

const nextPostStart = "2024-01-01";

describe("mock CCT engine (stub port of the POC)", () => {
  it("matches the POC for a long LTFT history projected full time", () => {
    const changes: CctChangeDto[] = [
      {
        type: "LTFT",
        startDate: "2018-01-01",
        endDate: "2022-12-31",
        wte: 0.5,
        countsTowardsCompletion: true
      }
    ];

    const result = calculateCctResult(longProgramme, changes, {
      startDate: nextPostStart,
      wte: 1
    });

    expect(result.totalWteMonthsCompleted).toBeCloseTo(42.0164383562, 9);
    expect(result.cctDate).toBe("2030-06-28");
  });

  it("matches the POC for an uncounted absence projected at 50% LTFT", () => {
    const changes: CctChangeDto[] = [
      {
        type: "OOPC",
        startDate: "2020-01-01",
        endDate: "2022-12-31",
        wte: null,
        countsTowardsCompletion: false
      }
    ];

    const result = calculateCctResult(longProgramme, changes, {
      startDate: nextPostStart,
      wte: 0.5
    });

    expect(result.totalWteMonthsCompleted).toBeCloseTo(36, 9);
    expect(result.cctDate).toBe("2037-12-25");
  });

  it("credits OOPT at full time when it is counted, and nothing when it is not", () => {
    const oopt: CctChangeDto = {
      type: "OOPT",
      startDate: "2020-01-01",
      endDate: "2020-06-30",
      wte: null,
      countsTowardsCompletion: true
    };

    expect(wteMonthsFor(oopt)).toBeCloseTo(6, 1);
    expect(wteMonthsFor({ ...oopt, countsTowardsCompletion: false })).toBe(0);
  });

  it("credits counted OOPR at its approved wte fraction", () => {
    const oopr: CctChangeDto = {
      type: "OOPR",
      startDate: "2020-01-01",
      endDate: "2020-06-30",
      wte: 0.8,
      countsTowardsCompletion: true
    };

    expect(wteMonthsFor(oopr)).toBeCloseTo(4.8, 1);
  });

  it("leaves the whole adjusted length remaining when there are no changes", () => {
    const result = calculateCctResult(
      { ...longProgramme, additionalMonths: 6, acceleratedMonths: 3 },
      [],
      { startDate: longProgramme.startDate, wte: 1 }
    );

    expect(result.totalWteMonthsCompleted).toBe(0);
    expect(result.monthsRemaining).toBe(123);
    expect(result.periods).toHaveLength(1);
    expect(result.periods?.[0].wteMonths).toBe(123);
  });

  it("breaks the result down into one period per row the table renders", () => {
    const changes: CctChangeDto[] = [
      {
        type: "PARENTAL",
        startDate: "2024-02-01",
        endDate: "2024-08-01",
        wte: null,
        countsTowardsCompletion: false
      }
    ];

    const result = calculateCctResult(
      { ...longProgramme, startDate: "2023-08-02", lengthMonths: 96 },
      changes,
      { startDate: "2024-08-02", wte: 1 }
    );

    expect(result.periods?.map(period => period.kind)).toEqual([
      "CHANGE",
      "ASSUMED_FULL_TIME",
      "PROJECTION"
    ]);
    expect(result.periods?.[0].wteMonths).toBe(0);
    expect(result.periods?.[1].startDate).toBe("2023-08-02");
    expect(result.periods?.[1].endDate).toBe("2024-01-31");
    expect(result.periods?.[2].endDate).toBe(result.cctDate);
  });
});
