export type CctType =
  | "LTFT"
  | "OOPC"
  | "OOPE"
  | "OOPP"
  | "OOPR"
  | "OOPT"
  | "PARENTAL"
  | "PHASED"
  | "SHIELDING"
  | "SICKNESS"
  | "ACCRUED_LEAVE";

export type CctChange = {
  id: string; // client-only, never sent or persisted
  type: CctType;
  startDate: string;
  endDate: string;
  wte: number | null; // LTFT 0.01-0.99; OOPR credit 0.01-1; null for the rest
  countsTowardsCompletion: boolean; // true for LTFT, optional for OOPT/OOPR; false for the rest
  notes?: string;
};

export type CctChangeDto = Omit<CctChange, "id" | "endDate"> & {
  endDate: string | null;
};

export type CctCalculatedChange = CctChangeDto & {
  calendarMonths: number | null;
  wteMonths: number | null;
};

export type CctProjection = {
  startDate: string;
  wte: number; // 0.01-1; 1 for a full-time projection
  calendarMonths: number;
  wteMonths: number;
};

export type CctTrainingGrade =
  | "F1"
  | "F2"
  | "CT1"
  | "CT2"
  | "CT3"
  | "CT4"
  | "ST1"
  | "ST2"
  | "ST3"
  | "ST4"
  | "ST5"
  | "ST6"
  | "ST7"
  | "ST8"
  | "ST9"
  | "DFT"
  | "DCT1"
  | "DCT2"
  | "DCT3";

export type CctSpecialty = {
  name: string;
  lengthMonths: number;
  entryGrade: CctTrainingGrade;
  eighteenMonthFinalYear: boolean;
};

export type CctTrainingTime = {
  grade: CctTrainingGrade;
  months: number; // whole months (for now), 1-24
  notes: string;
};

export type CctProgrammeDetails = {
  specialty: string; // from the specialties list (NW Excel doc)
  startDate: string;
  lengthMonths: number; // 1-120, defaulted from the specialty list (NW Excel doc); can be overridden
  lengthOverrideNotes: string; // required when lengthMonths is overridden
  startGrade: CctTrainingGrade; // defaulted from the specialties list; can be overrided
  startGradeOverrideNotes: string; // required when startGrade is overridden
  additionalTrainingTime: CctTrainingTime[]; // up to 24 months in total
  acceleratedTrainingTime: CctTrainingTime[]; // up to 12 months in total
  eighteenMonthFinalGrade: CctTrainingGrade | null; // final year of 18 months rather than 12
  eighteenMonthFinalGradeNotes: string; // required when set
  skippedGrade: CctTrainingGrade | null; // grade year skipped in the progression
  skippedGradeNotes: string; // required when set
};

export type CctGradeYear = {
  yearNumber: number;
  grade: CctTrainingGrade | null; // null past the highest known grade
  endDate: string;
  skippedGradeBeforeThisRow: CctTrainingGrade | null;
  extendedToEighteenMonths: boolean;
  exceedsKnownTrainingGrade: boolean;
  additionalMonths: number;
  acceleratedMonths: number;
};

export type CctAssumedFullTimePeriod = {
  startDate: string;
  endDate: string;
  months: number;
};

export type CctResult = {
  cctDate: string; // computed indicative end date
  originalProgrammeEndDate: string;
  adjustedProgrammeEndDate: string;
  totalCalendarMonthsCompleted: number;
  totalWteMonthsCompleted: number;
  monthsRemaining: number; // could be negative if training is already complete
  assumedFullTimePeriods: CctAssumedFullTimePeriod[];
  projection: CctProjection;
  gradeProgression: CctGradeYear[];
};

export type CctBodyValidationError = {
  pointer: string;
  detail: string;
};

export type CctCalculateResponse = {
  changes: CctCalculatedChange[];
  result: CctResult;
  errors: CctBodyValidationError[];
};

export type CctCalculation = {
  id: string;
  name: string;
  programmeDetails: CctProgrammeDetails;
  changes: CctCalculatedChange[];
  result: CctResult;
  created: string;
  lastModified: string;
};
