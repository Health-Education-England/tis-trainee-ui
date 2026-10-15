export type CctType = "LTFT";

export type CctChangeType = {
  id?: string;
  type: CctType | null;
  startDate: Date | string;
  endDate?: Date | string;
  wte: number | null;
};

export type PmType = {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  wte: number | null;
  designatedBodyCode: string | null;
  managingDeanery: string | null;
};

export type CctCalculation = {
  id?: string;
  traineeTisId?: string;
  name?: string;
  cctDate?: Date | string;
  programmeMembership: PmType;
  changes: CctChangeType[];
  created?: Date | string;
  lastModified?: Date | string;
};

// PROPOSED

export type CctTypeNew =
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
  id: string; // client-generated
  type: CctTypeNew;
  startDate: string;
  endDate: string;
  wte: number | null; // LTFT 0.01-0.99; OOPR credit 0.01-1; null for the rest
  countsTowardsCompletion: boolean; // true for LTFT, optional for OOPT/OOPR; false for the rest
  notes?: string;
};

export type CctProjection = {
  startDate: string;
  wte: number; // 0.01-1; 1 for a full-time projection
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
  | "DFT";

export type CctProgrammeDetails = {
  specialty: string; // from the specialties list (NW Excel doc)
  startDate: string;
  lengthMonths: number; // 1-120, defaulted from the specialty list (NW Excel doc)
  startGrade: CctTrainingGrade; // defaulted from the specialties list; can be overrided
  startGradeOverrideNotes: string; // required when startGrade is overridden
  additionalMonths: number; // 0-24, e.g. extra time after an ARCP outcome
  additionalMonthsNotes: string; // required when > 0
  acceleratedMonths: number; // 0-12, recognised prior learning
  acceleratedMonthsNotes: string; // required when > 0
  eighteenMonthFinalGrade: CctTrainingGrade | null; // final year of 18 months rather than 12
  eighteenMonthFinalGradeNotes: string; // required when set
  skippedGrade: CctTrainingGrade | null; // grade year skipped in the progression
  skippedGradeNotes: string; // required when set
};

export type CctGradeYear = {
  yearNumber: number;
  grade: string; // generated arithmetically, so can fall outside CctTrainingGrade
  endDate: string | null;
  skippedGradeBeforeThisRow: CctTrainingGrade | null;
  extendedToEighteenMonths: boolean;
  extendedToTwentyFourMonths: boolean;
  exceedsKnownTrainingGrade: boolean;
};

export type CctResult = {
  cctDate: string; // computed indicative end date
  totalWteMonthsCompleted?: number;
  monthsRemaining?: number; // could be negative if training is already complete
  gradeProgression?: CctGradeYear[];
};

export type CctCalculationNew = {
  id?: string; // server-assigned
  traineeTisId?: string; // server-assigned
  name: string;
  programmeMembership: PmType; // unchanged for now
  programmeDetails: CctProgrammeDetails;
  changes: CctChange[];
  projection: CctProjection;
  result: CctResult;
  created?: Date | string; // server-assigned
  lastModified?: Date | string; // server-assigned
};
