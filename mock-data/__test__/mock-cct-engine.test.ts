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

describe("mock CCT engine (stub port of the POC)", () => {
  it("projects full time from the day after the last change ends", () => {
    const changes: CctChangeDto[] = [
      {
        type: "LTFT",
        startDate: "2018-01-01",
        endDate: "2022-12-31",
        wte: 0.5,
        countsTowardsCompletion: true
      }
    ];

    const result = calculateCctResult(longProgramme, changes);

    expect(result.totalWteMonthsCompleted).toBeCloseTo(30.0164383562, 9);
    expect(result.periods?.at(-1)?.startDate).toBe("2023-01-01");
    expect(result.cctDate).toBe("2030-06-28");
  });

  it("matches the POC for an uncounted absence then an open LTFT change at 50%", () => {
    const changes: CctChangeDto[] = [
      {
        type: "OOPC",
        startDate: "2020-01-01",
        endDate: "2022-12-31",
        wte: null,
        countsTowardsCompletion: false
      },
      {
        type: "LTFT",
        startDate: "2024-01-01",
        endDate: null,
        wte: 0.5,
        countsTowardsCompletion: true
      }
    ];

    const result = calculateCctResult(longProgramme, changes);

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
      []
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
      changes
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

  it("rounds the months remaining to 2 dp before projecting the date, as Excel's I15 does", () => {
    const changes: CctChangeDto[] = [
      {
        type: "LTFT",
        startDate: "2023-11-21",
        endDate: "2025-11-09",
        wte: 0.5,
        countsTowardsCompletion: true
      }
    ];

    const result = calculateCctResult(
      { ...longProgramme, startDate: "2023-08-02", lengthMonths: 84 },
      changes
    );

    expect(result.monthsRemaining).toBe(68.52);
    expect(result.periods?.at(-1)?.wteMonths).toBe(68.52);
    expect(result.cctDate).toBe("2031-07-25");
  });

  it("projects the rounded months remaining at the open LTFT wte, which can pull the date a day earlier", () => {
    const changes: CctChangeDto[] = [
      {
        type: "LTFT",
        startDate: "2024-02-01",
        endDate: null,
        wte: 0.6,
        countsTowardsCompletion: true
      }
    ];

    const result = calculateCctResult(
      { ...longProgramme, startDate: "2023-08-02", lengthMonths: 84 },
      changes
    );

    expect(result.monthsRemaining).toBe(77.98);
    expect(result.periods?.at(-1)?.calendarMonths).toBeCloseTo(77.98 / 0.6, 9);
    expect(result.cctDate).toBe("2034-11-25");
  });

  it("floors a date that is exactly a whole number of days to that day, even when floating-point noise leaves it just short", () => {
    const changes: CctChangeDto[] = [
      {
        type: "LTFT",
        startDate: "2023-08-02",
        endDate: null,
        wte: 0.56,
        countsTowardsCompletion: true
      }
    ];

    const result = calculateCctResult(
      { ...longProgramme, startDate: "2023-08-02", lengthMonths: 84 },
      changes
    );

    expect(result.monthsRemaining).toBe(84);
    expect(result.cctDate).toBe("2036-01-26");
  });

  it("gives the day training completes when a change runs past it, not a date projected back from the change's end", () => {
    const changes: CctChangeDto[] = [
      {
        type: "LTFT",
        startDate: "2030-01-01",
        endDate: "2032-12-31",
        wte: 0.5,
        countsTowardsCompletion: true
      }
    ];

    const result = calculateCctResult(
      { ...longProgramme, startDate: "2023-08-02", lengthMonths: 84 },
      changes
    );

    expect(result.monthsRemaining).toBe(-11.08);
    expect(result.cctDate).toBe("2031-02-26");
    expect(result.periods?.at(-1)?.startDate).toBe("2033-01-01");
    expect(result.periods?.at(-1)?.endDate).toBe("2031-02-26");
  });

  it("gives the change's last day, not the day after, when the change ends on the day training completes", () => {
    const changes: CctChangeDto[] = [
      {
        type: "LTFT",
        startDate: "2030-01-01",
        endDate: "2031-02-26",
        wte: 0.5,
        countsTowardsCompletion: true
      }
    ];

    const result = calculateCctResult(
      { ...longProgramme, startDate: "2023-08-02", lengthMonths: 84 },
      changes
    );

    expect(result.monthsRemaining).toBeCloseTo(0, 9);
    expect(result.cctDate).toBe("2031-02-26");
    expect(result.periods?.at(-1)?.startDate).toBe("2031-02-27");
    expect(result.periods?.at(-1)?.wteMonths).toBeCloseTo(0, 9);
  });
});
