import {
  CctCalculatedChange,
  CctChange,
  CctGradeYear,
  CctProgrammeDetails,
  CctResult,
  CctSpecialty,
  CctTrainingTime
} from "../../models/CctTypes";
import {
  cctChangeIndexFromPointer,
  cctProgrammeDetailsErrorTarget,
  deriveCctAdjustedLengthMonths,
  deriveCctChangesTable,
  findCctEighteenMonthFinalGrade,
  findCctProgressionGrades,
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
  toCctChangeDtos,
  toCctGradeOptions
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
    expect(cctChangeIndexFromPointer("#/changes/0/startDate")).toBe(0);
    expect(cctChangeIndexFromPointer("#/changes/12/endDate")).toBe(12);
  });

  it("is null for a pointer to anything but a change", () => {
    expect(
      cctChangeIndexFromPointer("#/programmeDetails/startDate")
    ).toBeNull();
    expect(cctChangeIndexFromPointer("#/changes")).toBeNull();
    expect(cctChangeIndexFromPointer("#/changes/0")).toBeNull();
  });
});

describe("cctProgrammeDetailsErrorTarget", () => {
  it("reads the field and entry index from a pointer to a training time entry", () => {
    expect(
      cctProgrammeDetailsErrorTarget(
        "#/programmeDetails/additionalTrainingTime/0/grade"
      )
    ).toEqual({ field: "additionalTrainingTime", index: 0, property: "grade" });
    expect(
      cctProgrammeDetailsErrorTarget(
        "#/programmeDetails/acceleratedTrainingTime/11/months"
      )
    ).toEqual({
      field: "acceleratedTrainingTime",
      index: 11,
      property: "months"
    });
  });

  it("reads the field, with no index or property, from a pointer to a single field", () => {
    expect(
      cctProgrammeDetailsErrorTarget("#/programmeDetails/skippedGrade")
    ).toEqual({ field: "skippedGrade", index: null, property: null });
    expect(
      cctProgrammeDetailsErrorTarget(
        "#/programmeDetails/eighteenMonthFinalGrade"
      )
    ).toEqual({
      field: "eighteenMonthFinalGrade",
      index: null,
      property: null
    });
    expect(
      cctProgrammeDetailsErrorTarget("#/programmeDetails/skippedGradeNotes")
    ).toEqual({ field: "skippedGradeNotes", index: null, property: null });
  });

  it("reads the field, with no index or property, from a pointer to a whole training time list", () => {
    expect(
      cctProgrammeDetailsErrorTarget(
        "#/programmeDetails/additionalTrainingTime"
      )
    ).toEqual({
      field: "additionalTrainingTime",
      index: null,
      property: null
    });
  });

  it("is null for a pointer to anything but the programme details", () => {
    expect(cctProgrammeDetailsErrorTarget("#/changes/0/startDate")).toBeNull();
    expect(cctProgrammeDetailsErrorTarget("#/programmeDetails")).toBeNull();
    expect(
      cctProgrammeDetailsErrorTarget("#/programmeDetailsExtra/skippedGrade")
    ).toBeNull();
  });

  it("is null for a pointer deeper than an entry's property", () => {
    expect(
      cctProgrammeDetailsErrorTarget(
        "#/programmeDetails/additionalTrainingTime/0/grade/extra"
      )
    ).toBeNull();
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
    },
    gradeProgression: []
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
    entryGrade: "ST1",
    eighteenMonthFinalYear: false
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
    entryGrade: "ST1",
    eighteenMonthFinalYear: false
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

describe("findCctProgressionGrades", () => {
  const gradeYear = (
    yearNumber: number,
    grade: CctGradeYear["grade"]
  ): CctGradeYear => ({
    yearNumber,
    grade,
    endDate: "2030-01-01",
    skippedGradeBeforeThisRow: null,
    extendedToEighteenMonths: false,
    exceedsKnownTrainingGrade: grade === null,
    additionalMonths: 0,
    acceleratedMonths: 0
  });
  const resultWith = (gradeProgression: CctGradeYear[]) =>
    ({ gradeProgression } as CctResult);

  it("offers each grade in the result's progression once, in grade order", () => {
    const result = resultWith([
      gradeYear(1, "ST1"),
      gradeYear(2, "ST3"),
      gradeYear(3, "ST4"),
      gradeYear(4, "ST4"),
      gradeYear(5, null)
    ]);

    expect(findCctProgressionGrades("ST1", result)).toEqual([
      "ST1",
      "ST3",
      "ST4"
    ]);
  });

  it("falls back to the start grade and the later grades of its kind without a progression", () => {
    expect(findCctProgressionGrades("CT2", null)).toEqual([
      "CT2",
      "CT3",
      "CT4"
    ]);
    expect(findCctProgressionGrades("CT2", resultWith([]))).toEqual([
      "CT2",
      "CT3",
      "CT4"
    ]);
  });
});

describe("findCctEighteenMonthFinalGrade", () => {
  it("gives the last full year's grade of a length with a half year", () => {
    expect(findCctEighteenMonthFinalGrade("ST1", 90, null)).toBe("ST7");
    expect(findCctEighteenMonthFinalGrade("ST3", 66, null)).toBe("ST7");
  });

  it("moves on a grade when the skipped grade is before the last full year", () => {
    expect(findCctEighteenMonthFinalGrade("ST1", 90, "ST3")).toBe("ST8");
    expect(findCctEighteenMonthFinalGrade("ST1", 90, "ST8")).toBe("ST7");
  });

  it("gives no grade without a half year or a full year", () => {
    expect(findCctEighteenMonthFinalGrade("ST1", 84, null)).toBeNull();
    expect(findCctEighteenMonthFinalGrade("ST1", 63, null)).toBeNull();
    expect(findCctEighteenMonthFinalGrade("ST1", 6, null)).toBeNull();
  });

  it("gives no grade past the highest known grade", () => {
    expect(findCctEighteenMonthFinalGrade("ST4", 90, null)).toBeNull();
  });

  it("gives an unnumbered grade only when it has one full year", () => {
    expect(findCctEighteenMonthFinalGrade("DFT", 18, null)).toBe("DFT");
    expect(findCctEighteenMonthFinalGrade("DFT", 30, null)).toBeNull();
  });
});

describe("toCctGradeOptions", () => {
  it("adds any current grade missing from the grades, in grade order", () => {
    expect(toCctGradeOptions(["ST2", "ST3"], "ST8", null, undefined)).toEqual([
      { value: "ST2", label: "ST2" },
      { value: "ST3", label: "ST3" },
      { value: "ST8", label: "ST8" }
    ]);
  });

  it("does not repeat a current grade that is already offered", () => {
    expect(toCctGradeOptions(["ST2", "ST3"], "ST2")).toEqual([
      { value: "ST2", label: "ST2" },
      { value: "ST3", label: "ST3" }
    ]);
  });
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
    {
      name: "Paediatrics",
      lengthMonths: 84,
      entryGrade: "ST1",
      eighteenMonthFinalYear: false
    }
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
