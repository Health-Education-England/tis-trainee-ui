import { CctCalculation, CctProgrammeDetails } from "../models/CctTypes";

const paediatricsProgrammeDetails: CctProgrammeDetails = {
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
    totalCalendarMonthsCompleted: 18.04931506849315,
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
    },
    gradeProgression: [
      {
        yearNumber: 1,
        grade: "ST1",
        endDate: "2024-07-31",
        skippedGradeBeforeThisRow: null,
        extendedToEighteenMonths: false,
        exceedsKnownTrainingGrade: false,
        additionalMonths: 0,
        acceleratedMonths: 0
      },
      {
        yearNumber: 2,
        grade: "ST2",
        endDate: "2025-11-29",
        skippedGradeBeforeThisRow: null,
        extendedToEighteenMonths: false,
        exceedsKnownTrainingGrade: false,
        additionalMonths: 0,
        acceleratedMonths: 0
      },
      {
        yearNumber: 3,
        grade: "ST3",
        endDate: "2027-07-30",
        skippedGradeBeforeThisRow: null,
        extendedToEighteenMonths: false,
        exceedsKnownTrainingGrade: false,
        additionalMonths: 0,
        acceleratedMonths: 0
      },
      {
        yearNumber: 4,
        grade: "ST4",
        endDate: "2029-03-29",
        skippedGradeBeforeThisRow: null,
        extendedToEighteenMonths: false,
        exceedsKnownTrainingGrade: false,
        additionalMonths: 0,
        acceleratedMonths: 0
      },
      {
        yearNumber: 5,
        grade: "ST5",
        endDate: "2030-11-27",
        skippedGradeBeforeThisRow: null,
        extendedToEighteenMonths: false,
        exceedsKnownTrainingGrade: false,
        additionalMonths: 0,
        acceleratedMonths: 0
      },
      {
        yearNumber: 6,
        grade: "ST6",
        endDate: "2032-07-27",
        skippedGradeBeforeThisRow: null,
        extendedToEighteenMonths: false,
        exceedsKnownTrainingGrade: false,
        additionalMonths: 0,
        acceleratedMonths: 0
      },
      {
        yearNumber: 7,
        grade: "ST7",
        endDate: "2034-03-27",
        skippedGradeBeforeThisRow: null,
        extendedToEighteenMonths: false,
        exceedsKnownTrainingGrade: false,
        additionalMonths: 0,
        acceleratedMonths: 0
      }
    ]
  },
  created: "2026-10-20T09:00:00Z",
  lastModified: "2026-10-28T12:00:00Z",
  ...overrides
});
