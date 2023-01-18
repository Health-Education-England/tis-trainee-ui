import { IFormR } from "./IFormR";
import { DateType } from "../utilities/DateUtilities";
import { ProfileSType } from "../utilities/ProfileUtilities";
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

export const initialFormRABeforeProfileData: FormRPartA = {
  forename: "",
  surname: "",
  gmcNumber: "",
  localOfficeName: "",
  dateOfBirth: null,
  gender: "",
  immigrationStatus: "",
  qualification: "",
  dateAttained: null,
  medicalSchool: "",
  address1: "",
  address2: "",
  address3: "",
  address4: "",
  postCode: "",
  telephoneNumber: "",
  mobileNumber: "",
  email: "",
  isLeadingToCct: false,
  programmeSpecialty: "",
  cctSpecialty1: "",
  cctSpecialty2: "",
  college: "",
  completionDate: null,
  trainingGrade: "",
  startDate: null,
  programmeMembershipType: "",
  wholeTimeEquivalent: undefined,
  declarationType: "",
  otherImmigrationStatus: "",
  lifecycleState: null,
  submissionDate: null,
  lastModifiedDate: null
};
