import { IFormR } from "./IFormR";

type DateType = Date | string | null;

export interface FormRPartA extends IFormR {
  traineeTisId?: string;
  forename: string;
  surname: string;
  gmcNumber: string;
  localOfficeName: string;
  dateOfBirth: DateType;
  gender: string;
  immigrationStatus: string;
  qualification: string;
  dateAttained: DateType;
  medicalSchool: string;
  address1: string;
  address2: string;
  address3: string;
  address4?: string;
  postCode: string;
  telephoneNumber: string;
  mobileNumber: string;
  email: string;
  isLeadingToCct: boolean;
  programmeSpecialty: string;
  cctSpecialty1: string;
  cctSpecialty2: string;
  college: string;
  completionDate: DateType;
  trainingGrade: string;
  startDate: DateType;
  programmeMembershipType: string;
  wholeTimeEquivalent: number | undefined;
  declarationType: string;
  otherImmigrationStatus: string;
}
