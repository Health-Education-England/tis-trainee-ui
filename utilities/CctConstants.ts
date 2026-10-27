import { CctTrainingGrade, CctType } from "../models/CctTypes";

export const CCT_TRAINING_GRADES: CctTrainingGrade[] = [
  "F1",
  "F2",
  "CT1",
  "CT2",
  "CT3",
  "CT4",
  "ST1",
  "ST2",
  "ST3",
  "ST4",
  "ST5",
  "ST6",
  "ST7",
  "ST8",
  "ST9",
  "DFT"
];

export const CCT_CHANGE_TYPE_LABELS: Record<CctType, string> = {
  LTFT: "Less than full time (LTFT)",
  OOPC: "Out of programme - career break (OOPC)",
  OOPE: "Out of programme - experience (OOPE)",
  OOPP: "Out of programme - pause (OOPP)",
  OOPR: "Out of programme - research (OOPR)",
  OOPT: "Out of programme - training (OOPT)",
  PARENTAL: "Parental leave",
  PHASED: "Phased return to work",
  SHIELDING: "Shielding",
  SICKNESS: "Sickness absence",
  ACCRUED_LEAVE: "Accrued leave"
};

// Note: the changes table has nine columns, so it uses the abbreviation the trainee picked from the full label above.
export const CCT_CHANGE_TYPE_SHORT_LABELS: Record<CctType, string> = {
  LTFT: "LTFT",
  OOPC: "OOPC",
  OOPE: "OOPE",
  OOPP: "OOPP",
  OOPR: "OOPR",
  OOPT: "OOPT",
  PARENTAL: "Parental leave",
  PHASED: "Phased return",
  SHIELDING: "Shielding",
  SICKNESS: "Sickness",
  ACCRUED_LEAVE: "Accrued leave"
};

// Note: the types whose period can count towards completion, so the trainee is offered the choice.
export const CCT_OPTIONAL_CREDIT_TYPES: CctType[] = ["OOPT", "OOPR"];

// Note: the types that carry a WTE (LTFT work pattern) or an approved CCT credit (OOPR).
export const CCT_WTE_TYPES: CctType[] = ["LTFT", "OOPR"];

// Note: stands in for every value the calculate endpoint will supply.
export const CCT_NOT_CALCULATED = "Not yet calculated";
export const CCT_NO_VALUE = "—";
// Note: the POC shows a dash rather than a figure where a month total is not applicable, as opposed to not yet known.
export const CCT_NOT_APPLICABLE = "-";

export const CCT_NOTES_MAX_LENGTH = 1000;
export const CCT_NOTES_PREVIEW_LENGTH = 80;
export const CCT_NOTES_TOO_LONG_ERROR = `Notes must be ${CCT_NOTES_MAX_LENGTH} characters or less`;
