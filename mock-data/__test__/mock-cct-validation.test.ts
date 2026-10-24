import {
  CctChangeDto,
  CctProgrammeDetails,
  CctType
} from "../../models/CctTypes";
import {
  isCctWteShown,
  mapFormDataToChange,
  toCctChangeDtos
} from "../../utilities/CctUtilities";
import { validateCctCalculateRequest } from "../mock-cct-validation";

const programme: CctProgrammeDetails = {
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

const ltft: CctChangeDto = {
  type: "LTFT",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  wte: 0.5,
  countsTowardsCompletion: true
};

const parental: CctChangeDto = {
  type: "PARENTAL",
  startDate: "2025-01-01",
  endDate: "2025-06-30",
  wte: null,
  countsTowardsCompletion: false
};

const pointersFor = (
  changes: CctChangeDto[],
  details: Partial<CctProgrammeDetails> = {}
) =>
  validateCctCalculateRequest({ ...programme, ...details }, changes).map(
    error => error.pointer
  );

describe("mock CCT validation (the pretend backend's copy of the frontend rules)", () => {
  it("accepts a request with no changes", () => {
    expect(validateCctCalculateRequest(programme, [])).toEqual([]);
  });

  it("accepts a change that runs past the day training completes", () => {
    const overrun: CctChangeDto = {
      ...ltft,
      startDate: "2030-01-01",
      endDate: "2032-12-31"
    };

    expect(validateCctCalculateRequest(programme, [overrun])).toEqual([]);
  });

  it("accepts a change that starts before the programme, as the frontend tags it invalid itself", () => {
    const early: CctChangeDto = { ...ltft, startDate: "2023-08-01" };

    expect(validateCctCalculateRequest(programme, [early])).toEqual([]);
  });

  it("accepts the changes the frontend builds for every change type", () => {
    const types: CctType[] = [
      "LTFT",
      "OOPC",
      "OOPE",
      "OOPP",
      "OOPR",
      "OOPT",
      "PARENTAL",
      "PHASED",
      "SHIELDING",
      "SICKNESS",
      "ACCRUED_LEAVE"
    ];
    const built = types.flatMap(type =>
      [false, true].map(countsTowardsCompletion => ({
        type,
        startDate: "2024-01-01",
        endDate: "2024-06-30",
        wtePercent: isCctWteShown(type, countsTowardsCompletion) ? "7" : null,
        countsTowardsCompletion,
        notes: "  a note  "
      }))
    );

    built.forEach(formData => {
      const changes = toCctChangeDtos([mapFormDataToChange(formData, "id")]);
      expect({ formData, errors: pointersFor(changes) }).toEqual({
        formData,
        errors: []
      });
    });

    const openLtft = mapFormDataToChange(
      { type: "LTFT", startDate: "2025-01-01", endDate: "", wtePercent: "20" },
      "id"
    );
    expect(pointersFor(toCctChangeDtos([openLtft]))).toEqual([]);
  });

  it.each<[string, CctChangeDto[], Partial<CctProgrammeDetails>, string[]]>([
    [
      "a missing specialty",
      [],
      { specialty: "" },
      ["#/programmeDetails/specialty"]
    ],
    [
      "an impossible programme start date",
      [],
      { startDate: "2023-02-30" },
      ["#/programmeDetails/startDate"]
    ],
    [
      "an unknown start grade",
      [],
      { startGrade: "ST99" as never, startGradeOverrideNotes: "why" },
      ["#/programmeDetails/startGrade"]
    ],
    [
      "a programme length over 120 months",
      [],
      { lengthMonths: 121 },
      ["#/programmeDetails/lengthMonths"]
    ],
    [
      "additional months over 24",
      [],
      { additionalMonths: 25, additionalMonthsNotes: "why" },
      ["#/programmeDetails/additionalMonths"]
    ],
    [
      "accelerated months over 12",
      [],
      { acceleratedMonths: 13, acceleratedMonthsNotes: "why" },
      ["#/programmeDetails/acceleratedMonths"]
    ],
    [
      "an adjusted length of zero",
      [],
      {
        lengthMonths: 12,
        acceleratedMonths: 12,
        acceleratedMonthsNotes: "why"
      },
      ["#/programmeDetails/acceleratedMonths"]
    ],
    [
      "additional months without a note",
      [],
      { additionalMonths: 3, additionalMonthsNotes: "  " },
      ["#/programmeDetails/additionalMonthsNotes"]
    ],
    [
      "accelerated months without a note",
      [],
      { acceleratedMonths: 3 },
      ["#/programmeDetails/acceleratedMonthsNotes"]
    ],
    [
      "an overridden start grade without a note",
      [],
      { startGrade: "ST2" },
      ["#/programmeDetails/startGradeOverrideNotes"]
    ],
    [
      "an 18-month final grade without a note",
      [],
      { eighteenMonthFinalGrade: "ST3" },
      ["#/programmeDetails/eighteenMonthFinalGradeNotes"]
    ],
    [
      "a skipped grade without a note",
      [],
      { skippedGrade: "ST2" },
      ["#/programmeDetails/skippedGradeNotes"]
    ],
    [
      "an unknown change type",
      [{ ...ltft, type: "HOLIDAY" as never }],
      {},
      ["#/changes[0]/type"]
    ],
    [
      "a change ending before it starts",
      [{ ...ltft, endDate: "2023-12-31" }],
      {},
      ["#/changes[0]/startDate"]
    ],
    [
      "no end date on a change that isn't LTFT",
      [{ ...parental, endDate: null }],
      {},
      ["#/changes[0]/endDate"]
    ],
    ["an LTFT WTE of 100%", [{ ...ltft, wte: 1 }], {}, ["#/changes[0]/wte"]],
    [
      "an LTFT WTE that isn't a whole percent",
      [{ ...ltft, wte: 0.505 }],
      {},
      ["#/changes[0]/wte"]
    ],
    [
      "an LTFT change that doesn't count",
      [{ ...ltft, countsTowardsCompletion: false }],
      {},
      ["#/changes[0]/countsTowardsCompletion"]
    ],
    [
      "a counted OOPR with no credit",
      [{ ...ltft, type: "OOPR", wte: null }],
      {},
      ["#/changes[0]/wte"]
    ],
    [
      "an uncounted OOPR with a credit",
      [{ ...ltft, type: "OOPR", countsTowardsCompletion: false }],
      {},
      ["#/changes[0]/wte"]
    ],
    [
      "an OOPT with a WTE",
      [{ ...ltft, type: "OOPT" }],
      {},
      ["#/changes[0]/wte"]
    ],
    [
      "a counted OOPT over 12 months",
      [
        {
          ...ltft,
          type: "OOPT",
          wte: null,
          startDate: "2024-01-01",
          endDate: "2025-01-01"
        }
      ],
      {},
      ["#/changes[0]/endDate"]
    ],
    [
      "a parental leave that counts",
      [{ ...parental, countsTowardsCompletion: true }],
      {},
      ["#/changes[0]/countsTowardsCompletion"]
    ],
    [
      "notes over 1000 characters",
      [{ ...parental, notes: "x".repeat(1001) }],
      {},
      ["#/changes[0]/notes"]
    ],
    [
      "overlapping changes",
      [ltft, { ...parental, startDate: "2024-12-31" }],
      {},
      ["#/changes[1]/startDate"]
    ],
    [
      "two open LTFT changes",
      [
        { ...ltft, startDate: "2030-01-01", endDate: null },
        { ...ltft, startDate: "2031-01-01", endDate: null }
      ],
      {},
      ["#/changes[1]/endDate"]
    ],
    [
      "an open LTFT change that starts before a dated change ends",
      [{ ...ltft, startDate: "2024-12-31", endDate: null }, ltft],
      {},
      ["#/changes[0]/startDate"]
    ]
  ])("rejects %s", (_name, changes, details, pointers) => {
    expect(pointersFor(changes, details)).toEqual(pointers);
  });

  it("rejects a missing body the way bean validation does", () => {
    expect(validateCctCalculateRequest(null, null)).toEqual([
      { pointer: "#/changes", detail: "must not be null" },
      { pointer: "#/programmeDetails", detail: "must not be null" }
    ]);
  });

  it("sorts the errors by pointer, then detail, like the Java handler", () => {
    const errors = validateCctCalculateRequest(
      { ...programme, specialty: "", lengthMonths: 0 },
      [{ ...ltft, wte: 1, endDate: "2023-12-31" }]
    );

    expect(errors.map(error => error.pointer)).toEqual([
      "#/changes[0]/startDate",
      "#/changes[0]/wte",
      "#/programmeDetails/lengthMonths",
      "#/programmeDetails/specialty"
    ]);
  });
});
