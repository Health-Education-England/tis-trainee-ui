import { CctTrainingGrade, CctTypeNew } from "../models/CctTypes";

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

export const CCT_CHANGE_TYPE_LABELS: Record<CctTypeNew, string> = {
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
export const CCT_CHANGE_TYPE_SHORT_LABELS: Record<CctTypeNew, string> = {
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
export const CCT_OPTIONAL_CREDIT_TYPES: CctTypeNew[] = ["OOPT", "OOPR"];

// Note: the types that carry a WTE (LTFT work pattern) or an approved CCT credit (OOPR).
export const CCT_WTE_TYPES: CctTypeNew[] = ["LTFT", "OOPR"];

export type CctSpecialty = {
  name: string;
  lengthMonths: number;
  entryGrade: CctTrainingGrade;
};

// Note: placeholder until the specialty reference data has a home
export const CCT_SPECIALTIES: CctSpecialty[] = [
  { name: "Anaesthetics", lengthMonths: 84, entryGrade: "CT1" },
  { name: "Clinical radiology", lengthMonths: 60, entryGrade: "ST1" },
  { name: "Core surgical training", lengthMonths: 24, entryGrade: "CT1" },
  { name: "Emergency medicine", lengthMonths: 72, entryGrade: "ST1" },
  { name: "General practice", lengthMonths: 36, entryGrade: "ST1" },
  { name: "Geriatric medicine", lengthMonths: 48, entryGrade: "ST4" },
  { name: "Obstetrics and gynaecology", lengthMonths: 84, entryGrade: "ST1" },
  { name: "Paediatrics", lengthMonths: 96, entryGrade: "ST1" },
  {
    name: "Psychiatry of learning disability",
    lengthMonths: 36,
    entryGrade: "ST4"
  },
  {
    name: "Trauma and orthopaedic surgery",
    lengthMonths: 72,
    entryGrade: "ST3"
  }
];

export const findCctSpecialty = (name: string | null | undefined) =>
  CCT_SPECIALTIES.find(specialty => specialty.name === name);

// Note: stands in for every value the calculate endpoint will supply.
export const CCT_NOT_CALCULATED = "Not yet calculated";
export const CCT_NO_VALUE = "—";
// Note: the POC shows a dash rather than a figure where a month total is not applicable, as opposed to not yet known.
export const CCT_NOT_APPLICABLE = "-";
