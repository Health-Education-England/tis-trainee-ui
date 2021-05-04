import { IFormR } from "./IFormR";

export interface FormRPartA extends IFormR {
  traineeTisId?: string;
  forename: string;
  surname: string;
  gmcNumber: string;
  localOfficeName: string;
  dateOfBirth: any;
  gender: string;
  immigrationStatus: string;
  qualification: string;
  dateAttained: any;
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
  completionDate: any;
  trainingGrade: string;
  startDate: any;
  programmeMembershipType: string;
  wholeTimeEquivalent: number | undefined;
  declarationType: string;
  otherImmigrationStatus: string;
}
