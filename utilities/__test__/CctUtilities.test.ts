import {
  CctCalculatedChange,
  CctChange,
  CctProgrammeDetails,
  CctResult,
  CctSpecialty,
  CctTrainingTime
} from "../../models/CctTypes";
import {
  cctChangeIndexFromPointer,
  deriveCctAdjustedLengthMonths,
  deriveCctChangesTable,
  findCctTrainingTimeGrades,
  fromCctChangeDtos,
  isCctLengthAdjusted,
  isCctLengthOverridden,
  isCctStartGradeOverridden,
  mapFormDataToProgrammeDetails,
  mapFormDataToTrainingTime,
  mapProgrammeDetailsToFormData,
  mapTrainingTimeToFormData,
  newCctChangeId,
  pickCctCalculatedChanges,
  sortCctChanges,
  toCctChangeDtos
} from "../CctUtilities";

const change = (id: string, startDate = "2024-02-01"): CctChange => ({
  id,
  type: "PARENTAL",
  startDate,
  endDate: "2024-08-01",
  wte: null,
  countsTowardsCompletion: false
});

const calculatedChange = (startDate: string): CctCalculatedChange => ({
  type: "PARENTAL",
  startDate,
  endDate: "2024-08-01",
  wte: null,
  countsTowardsCompletion: false,
  calendarMonths: 6,
  wteMonths: 0
});

describe("sortCctChanges", () => {
  it("orders the changes by start date whatever order they were added in", () => {
    const sorted = sortCctChanges([
      change("second", "2025-01-01"),
      change("first", "2024-02-01"),
      change("third", "2026-03-01")
    ]);

    expect(sorted.map(c => c.id)).toEqual(["first", "second", "third"]);
  });

  it("keeps changes that start on the same date in the order they were added", () => {
    const sorted = sortCctChanges([
      change("added-first", "2024-02-01"),
      change("added-second", "2024-02-01")
    ]);

    expect(sorted.map(c => c.id)).toEqual(["added-first", "added-second"]);
  });

  it("leaves the changes it was given untouched", () => {
    const changes = [change("later", "2025-01-01"), change("earlier")];
    sortCctChanges(changes);

    expect(changes.map(c => c.id)).toEqual(["later", "earlier"]);
  });
});

describe("toCctChangeDtos", () => {
  it("drops the client-only id from every change", () => {
    const dtos = toCctChangeDtos([change("one"), change("two")]);

    expect(dtos).toHaveLength(2);
    dtos.forEach(dto => expect(dto).not.toHaveProperty("id"));
    expect(dtos[0]).toEqual({
      type: "PARENTAL",
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      wte: null,
      countsTowardsCompletion: false
    });
  });

  it("leaves the changes it was given untouched", () => {
    const changes = [change("one")];
    toCctChangeDtos(changes);

    expect(changes[0].id).toBe("one");
  });
});

describe("fromCctChangeDtos", () => {
  it("gives every change a fresh id that no other change has, loaded or newly added", () => {
    const firstLoad = fromCctChangeDtos([
      calculatedChange("2024-02-01"),
      calculatedChange("2025-01-01")
    ]);
    const secondLoad = fromCctChangeDtos([calculatedChange("2024-02-01")]);
    const ids = [
      ...firstLoad.map(c => c.id),
      ...secondLoad.map(c => c.id),
      newCctChangeId()
    ];

    expect(new Set(ids).size).toBe(4);
  });

  it("drops the figures the engine worked out", () => {
    const [loaded] = fromCctChangeDtos([calculatedChange("2024-02-01")]);

    expect(loaded).toEqual({
      id: expect.any(String),
      type: "PARENTAL",
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      wte: null,
      countsTowardsCompletion: false
    });
  });

  it("blanks an open-ended change's end date for the form, and sends it back out as null", () => {
    const openEnded: CctCalculatedChange = {
      type: "LTFT",
      startDate: "2025-01-01",
      endDate: null,
      wte: 0.6,
      countsTowardsCompletion: true,
      calendarMonths: null,
      wteMonths: null
    };

    const loaded = fromCctChangeDtos([openEnded]);

    expect(loaded[0].endDate).toBe("");
    expect(toCctChangeDtos(loaded)).toEqual([
      {
        type: "LTFT",
        startDate: "2025-01-01",
        endDate: null,
        wte: 0.6,
        countsTowardsCompletion: true
      }
    ]);
  });
});

describe("cctChangeIndexFromPointer", () => {
  it("reads the change's index from a pointer to one of its fields", () => {
    expect(cctChangeIndexFromPointer("#/changes[0]/startDate")).toBe(0);
    expect(cctChangeIndexFromPointer("#/changes[12]/endDate")).toBe(12);
  });

  it("is null for a pointer to anything but a change", () => {
    expect(
      cctChangeIndexFromPointer("#/programmeDetails/startDate")
    ).toBeNull();
    expect(cctChangeIndexFromPointer("#/changes")).toBeNull();
  });
});

describe("pickCctCalculatedChanges", () => {
  const calculatedChanges = [
    calculatedChange("2024-02-01"),
    calculatedChange("2025-01-01")
  ];

  it("returns the calculated changes in the order the engine gave them", () => {
    const picked = pickCctCalculatedChanges(calculatedChanges, 2);

    expect(picked.map(c => c?.startDate)).toEqual(["2024-02-01", "2025-01-01"]);
  });

  it("returns all nulls when the count does not match the rows on screen", () => {
    expect(pickCctCalculatedChanges(calculatedChanges, 3)).toEqual([
      null,
      null,
      null
    ]);
  });

  it("returns all nulls when there is no result yet", () => {
    expect(pickCctCalculatedChanges([], 2)).toEqual([null, null]);
  });
});

describe("deriveCctChangesTable", () => {
  const changes = [change("one")];
  const calculatedChanges = [calculatedChange("2024-02-01")];
  const result: CctResult = {
    cctDate: "2030-12-31",
    originalProgrammeEndDate: "2030-07-29",
    adjustedProgrammeEndDate: "2030-07-29",
    totalCalendarMonthsCompleted: 20,
    totalWteMonthsCompleted: 14,
    monthsRemaining: 70,
    assumedFullTimePeriods: [
      { startDate: "2023-08-02", endDate: "2024-01-31", months: 6 }
    ],
    projection: {
      startDate: "2024-08-02",
      wte: 1,
      calendarMonths: 70,
      wteMonths: 70
    }
  };

  it("takes the total from the engine's result rather than adding up the rows", () => {
    const { allTotals } = deriveCctChangesTable(
      changes,
      calculatedChanges,
      result
    );

    expect(allTotals).toEqual({ calendarMonths: 20, wteMonths: 14 });
  });

  it("adds the projection to the engine's total for the total to completion", () => {
    const { completionTotals } = deriveCctChangesTable(
      changes,
      calculatedChanges,
      result
    );

    expect(completionTotals).toEqual({ calendarMonths: 90, wteMonths: 84 });
  });

  it("adds up only the trainee's own changes for the entered total", () => {
    const { enteredTotals } = deriveCctChangesTable(
      changes,
      calculatedChanges,
      result
    );

    expect(enteredTotals).toEqual({ calendarMonths: 6, wteMonths: 0 });
  });

  it("has no totals before there is a result", () => {
    const noTotals = { calendarMonths: null, wteMonths: null };

    expect(deriveCctChangesTable(changes, [], null)).toMatchObject({
      enteredTotals: noTotals,
      allTotals: noTotals,
      completionTotals: noTotals
    });
  });
});

describe("isCctStartGradeOverridden", () => {
  const paediatrics: CctSpecialty = {
    name: "Paediatrics",
    lengthMonths: 84,
    entryGrade: "ST1"
  };

  it("is true when the start grade differs from the specialty's entry grade", () => {
    expect(isCctStartGradeOverridden(paediatrics, "ST2")).toBe(true);
  });

  it("is false when the start grade is the specialty's entry grade", () => {
    expect(isCctStartGradeOverridden(paediatrics, "ST1")).toBe(false);
  });

  it("is false when the specialty is not in the list", () => {
    expect(isCctStartGradeOverridden(undefined, "ST2")).toBe(false);
  });

  it("is false while no start grade has been chosen", () => {
    expect(isCctStartGradeOverridden(paediatrics, "")).toBe(false);
    expect(isCctStartGradeOverridden(paediatrics, null)).toBe(false);
    expect(isCctStartGradeOverridden(paediatrics, undefined)).toBe(false);
  });
});

describe("isCctLengthOverridden", () => {
  const paediatrics: CctSpecialty = {
    name: "Paediatrics",
    lengthMonths: 84,
    entryGrade: "ST1"
  };

  it("is true when the length differs from the specialty's default", () => {
    expect(isCctLengthOverridden(paediatrics, "48")).toBe(true);
    expect(isCctLengthOverridden(paediatrics, 48)).toBe(true);
  });

  it("is false when the length is the specialty's default", () => {
    expect(isCctLengthOverridden(paediatrics, "84")).toBe(false);
    expect(isCctLengthOverridden(paediatrics, 84)).toBe(false);
  });

  it("is false when the specialty is not in the list", () => {
    expect(isCctLengthOverridden(undefined, "48")).toBe(false);
  });

  it("is false while no length has been entered", () => {
    expect(isCctLengthOverridden(paediatrics, "")).toBe(false);
    expect(isCctLengthOverridden(paediatrics, null)).toBe(false);
    expect(isCctLengthOverridden(paediatrics, undefined)).toBe(false);
  });
});

describe("mapFormDataToProgrammeDetails", () => {
  it("carries the length and its override reason from the form", () => {
    expect(
      mapFormDataToProgrammeDetails({
        lengthMonths: "48",
        lengthOverrideNotes: "Agreed with my local office"
      })
    ).toMatchObject({
      lengthMonths: 48,
      lengthOverrideNotes: "Agreed with my local office"
    });
  });

  it("carries the training time lists through the form untouched", () => {
    const additionalTrainingTime: CctTrainingTime[] = [
      { grade: "ST3", months: 6, notes: "Outcome 3" }
    ];
    expect(
      mapFormDataToProgrammeDetails({ additionalTrainingTime })
    ).toMatchObject({ additionalTrainingTime, acceleratedTrainingTime: [] });
  });
});

describe("deriveCctAdjustedLengthMonths", () => {
  it("adds every additional entry and takes off every accelerated entry, whatever the grade", () => {
    const programmeDetails = {
      lengthMonths: 84,
      additionalTrainingTime: [
        { grade: "ST2", months: 6, notes: "Outcome 3" },
        { grade: "ST5", months: 4, notes: "Outcome 3" }
      ],
      acceleratedTrainingTime: [
        { grade: "ST1", months: 3, notes: "Prior learning" }
      ]
    } as CctProgrammeDetails;

    expect(deriveCctAdjustedLengthMonths(programmeDetails)).toBe(91);
    expect(isCctLengthAdjusted(programmeDetails)).toBe(true);
  });

  it("is the programme length when there is no training time", () => {
    const programmeDetails = {
      lengthMonths: 84,
      additionalTrainingTime: [],
      acceleratedTrainingTime: []
    } as unknown as CctProgrammeDetails;

    expect(deriveCctAdjustedLengthMonths(programmeDetails)).toBe(84);
    expect(isCctLengthAdjusted(programmeDetails)).toBe(false);
  });
});

describe("findCctTrainingTimeGrades", () => {
  it.each([
    ["ST3", ["ST3", "ST4", "ST5", "ST6", "ST7", "ST8", "ST9"]],
    ["CT2", ["CT2", "CT3", "CT4"]],
    ["DCT1", ["DCT1", "DCT2", "DCT3"]],
    ["F1", ["F1", "F2"]],
    ["DFT", ["DFT"]]
  ] as const)(
    "offers %s and the later grades of its kind",
    (startGrade, grades) => {
      expect(findCctTrainingTimeGrades(startGrade)).toEqual(grades);
    }
  );
});

describe("mapFormDataToTrainingTime", () => {
  it("reads the months as a number and trims the reason", () => {
    expect(
      mapFormDataToTrainingTime({
        grade: "ST3",
        months: "6",
        notes: "  Outcome 3  "
      })
    ).toEqual({ grade: "ST3", months: 6, notes: "Outcome 3" });
  });

  it("round-trips an entry through the form", () => {
    const entry: CctTrainingTime = {
      grade: "ST3",
      months: 6,
      notes: "Outcome 3"
    };
    expect(mapTrainingTimeToFormData(entry)).toEqual({
      grade: "ST3",
      months: "6",
      notes: "Outcome 3"
    });
    expect(mapFormDataToTrainingTime(mapTrainingTimeToFormData(entry))).toEqual(
      entry
    );
  });

  it("starts a new entry blank", () => {
    expect(mapTrainingTimeToFormData(null)).toEqual({});
  });
});

describe("mapProgrammeDetailsToFormData", () => {
  const specialties: CctSpecialty[] = [
    { name: "Paediatrics", lengthMonths: 84, entryGrade: "ST1" }
  ];
  const programmeDetails: CctProgrammeDetails = {
    specialty: "Paediatrics",
    startDate: "2023-08-02",
    lengthMonths: 84,
    lengthOverrideNotes: "",
    startGrade: "ST1",
    startGradeOverrideNotes: "",
    additionalTrainingTime: [],
    acceleratedTrainingTime: [],
    eighteenMonthFinalGrade: null,
    eighteenMonthFinalGradeNotes: "",
    skippedGrade: null,
    skippedGradeNotes: ""
  };

  it("marks the start grade as overridden when it differs from the specialty's default", () => {
    expect(
      mapProgrammeDetailsToFormData(
        { ...programmeDetails, startGrade: "ST2" },
        specialties
      ).startGradeOverridden
    ).toBe(true);
    expect(
      mapProgrammeDetailsToFormData(programmeDetails, specialties)
        .startGradeOverridden
    ).toBe(false);
  });

  it("marks the length as overridden when it differs from the specialty's default", () => {
    expect(
      mapProgrammeDetailsToFormData(
        { ...programmeDetails, lengthMonths: 48 },
        specialties
      ).lengthOverridden
    ).toBe(true);
    expect(
      mapProgrammeDetailsToFormData(programmeDetails, specialties)
        .lengthOverridden
    ).toBe(false);
  });

  it("does not mark an override when the specialty is no longer in the list", () => {
    expect(
      mapProgrammeDetailsToFormData(
        { ...programmeDetails, startGrade: "ST2" },
        []
      ).startGradeOverridden
    ).toBe(false);
  });
});
