import { IFormR } from "./IFormR";

type DateType = Date | string | null;
type ProfileSType = string | null | undefined;
export interface FormRPartA extends IFormR {
  traineeTisId?: string;
  forename: ProfileSType;
  surname: ProfileSType;
  gmcNumber: string | null | undefined;
  localOfficeName: string | null | undefined;
  dateOfBirth: DateType;
  gender: ProfileSType;
  immigrationStatus: string;
  qualification: ProfileSType;
  dateAttained: DateType;
  medicalSchool: ProfileSType;
  address1: ProfileSType;
  address2: ProfileSType;
  address3: ProfileSType;
  address4?: ProfileSType;
  postCode: ProfileSType;
  telephoneNumber: ProfileSType;
  mobileNumber: ProfileSType;
  email: string;
  isLeadingToCct: boolean;
  programmeSpecialty: ProfileSType;
  cctSpecialty1: ProfileSType;
  cctSpecialty2: string;
  college: string;
  completionDate: DateType;
  trainingGrade: string;
  startDate: DateType;
  programmeMembershipType: ProfileSType;
  wholeTimeEquivalent: number | undefined;
  declarationType: string;
  otherImmigrationStatus: string;
}
