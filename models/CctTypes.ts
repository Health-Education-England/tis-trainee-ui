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
  endDate: string | null; // null only on the projecting LTFT change
  wte: number | null; // LTFT 0.01-0.99; OOPR credit 0.01-1; null for the rest
  countedAsTraining: boolean; // true for LTFT, optional for OOPT/OOPR; false for the rest
  projectsRemainingTraining?: boolean; // can only be on one change and it must be the latest change
  notes?: string;
};

export type CctProgrammeDetails = {
  specialty: string; // from the specialties list (NW Excel doc)
  startDate: string;
  lengthMonths: number; // 1-120, defaulted from the specialty list (NW Excel doc)
  startGrade: string; // defaulted from the specialties list; can be overrided
  startGradeOverrideNotes: string; // required when startGrade is overridden
  additionalMonths: number; // 0-24, e.g. extra time after an ARCP outcome
  additionalMonthsNotes: string; // required when > 0
  acceleratedMonths: number; // 0-12, recognised prior learning
  acceleratedMonthsNotes: string; // required when > 0
  eighteenMonthFinalGrade: string; // final year of 18 months rather than 12
  eighteenMonthFinalGradeNotes: string; // required when set
  skippedGrade: string; // grade year skipped in the progression
  skippedGradeNotes: string; // required when set
};

export type CctResult = {
  cctDate: string; // computed indicative end date
  projectionStartDate?: string;
  projectionWte?: number; // fraction; 1 for a full-time projection
  totalWteMonthsCompleted?: number;
  monthsRemaining?: number; // could be negative if training is already complete
};

export type CctCalculationNew = {
  id?: string; // server-assigned
  traineeTisId?: string; // server-assigned
  name: string;
  programmeMembership: PmType; // unchanged for now
  programmeDetails: CctProgrammeDetails;
  changes: CctChange[];
  result: CctResult;
  created?: Date | string; // server-assigned
  lastModified?: Date | string; // server-assigned
};
