import {
  CctCalculatedChange,
  CctChange,
  CctProgrammeDetails,
  CctSpecialty
} from "../../models/CctTypes";
import {
  cctChangeIndexFromPointer,
  fromCctChangeDtos,
  isCctStartGradeOverridden,
  mapProgrammeDetailsToFormData,
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

describe("mapProgrammeDetailsToFormData", () => {
  const specialties: CctSpecialty[] = [
    { name: "Paediatrics", lengthMonths: 84, entryGrade: "ST1" }
  ];
  const programmeDetails: CctProgrammeDetails = {
    specialty: "Paediatrics",
    startDate: "2023-08-02",
    lengthMonths: 84,
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

  it("does not mark an override when the specialty is no longer in the list", () => {
    expect(
      mapProgrammeDetailsToFormData(
        { ...programmeDetails, startGrade: "ST2" },
        []
      ).startGradeOverridden
    ).toBe(false);
  });
});
