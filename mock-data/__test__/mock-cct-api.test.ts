import { CctChangeDto, CctProgrammeDetails } from "../../models/CctTypes";
import { mockCctCalculate } from "../mock-cct-api";

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
  startDate: "2030-01-01",
  endDate: "2032-12-31",
  wte: 0.5,
  countsTowardsCompletion: true
};

describe("mock CCT /calculate", () => {
  it("answers 200 with a result for a valid request", () => {
    const response = mockCctCalculate(programme, []);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ cctDate: "2030-07-29" });
  });

  it("answers 200 with the day training completes for a change that runs past it", () => {
    const response = mockCctCalculate(programme, [ltft]);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ cctDate: "2031-02-26" });
  });

  it("answers 400 with a problem detail listing each violation", () => {
    const response = mockCctCalculate({ ...programme, lengthMonths: 0 }, [
      { ...ltft, wte: 1 }
    ]);

    expect(response).toEqual({
      status: 400,
      body: {
        type: "about:blank",
        title: "Validation failure",
        status: 400,
        instance: "/api/cct/calculate",
        errors: [
          {
            pointer: "#/changes[0]/wte",
            detail: "LTFT WTE must be a whole number between 1 and 99."
          },
          {
            pointer: "#/programmeDetails/lengthMonths",
            detail: "Programme length must be between 1 and 120 months."
          }
        ]
      }
    });
  });
});
