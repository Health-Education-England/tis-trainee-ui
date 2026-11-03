import { CctCalculation, CctProgrammeDetails } from "../models/CctTypes";

const paediatricsProgrammeDetails: CctProgrammeDetails = {
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

export const mockCctCalculation = (
  overrides: Partial<CctCalculation> = {}
): CctCalculation => ({
  id: "cct-calculation-1",
  name: "Dropping to 60%",
  programmeDetails: paediatricsProgrammeDetails,
  changes: [
    {
      type: "LTFT",
      startDate: "2025-02-01",
      endDate: null,
      wte: 0.6,
      countsTowardsCompletion: true,
      notes: "Agreed with my TPD",
      calendarMonths: null,
      wteMonths: null
    }
  ],
  result: {
    cctDate: "2034-03-27",
    originalProgrammeEndDate: "2030-07-29",
    adjustedProgrammeEndDate: "2030-07-29",
    totalWteMonthsCompleted: 18.04931506849315,
    monthsRemaining: 65.95,
    assumedFullTimePeriods: [
      {
        startDate: "2023-08-02",
        endDate: "2025-01-31",
        months: 18.04931506849315
      }
    ],
    projection: {
      startDate: "2025-02-01",
      wte: 0.6,
      calendarMonths: 109.91666666666667,
      wteMonths: 65.95
    }
  },
  created: "2026-10-20T09:00:00Z",
  lastModified: "2026-10-28T12:00:00Z",
  ...overrides
});
