import { ProfileSType } from "../utilities/ProfileUtilities";
import { Signature } from "./TraineeProfile";
export interface PersonalDetails {
  surname: ProfileSType;
  forenames: ProfileSType;
  knownAs: ProfileSType;
  maidenName: ProfileSType;
  title: ProfileSType;
  role: string[];
  personOwner: ProfileSType;
  dateOfBirth: Date | string | null;
  gender: ProfileSType;
  qualification: ProfileSType;
  dateAttained: Date | string | null;
  medicalSchool: ProfileSType;
  telephoneNumber: ProfileSType;
  mobileNumber: ProfileSType;
  email: ProfileSType;
  address1: ProfileSType;
  address2: ProfileSType;
  address3: ProfileSType;
  address4: ProfileSType;
  postCode: ProfileSType;
  gmcNumber: ProfileSType;
  gmcStatus: ProfileSType;
  gdcNumber: ProfileSType;
  gdcStatus: ProfileSType;
  publicHealthNumber: ProfileSType;
  eeaResident: ProfileSType;
  permitToWork: ProfileSType;
  settled: ProfileSType;
  visaIssued: ProfileSType;
  detailsNumber: ProfileSType;
  prevRevalBody: ProfileSType;
  prevRevalBodyOther: ProfileSType;
  currRevalDate: Date | string | null;
  prevRevalDate: Date | string | null;
  signature: Signature | null;
}

export const initialPersonalDetails: PersonalDetails = {
  address1: null,
  address2: null,
  address3: null,
  address4: null,
  currRevalDate: null,
  dateAttained: null,
  dateOfBirth: null,
  detailsNumber: null,
  eeaResident: null,
  email: null,
  forenames: null,
  gdcNumber: null,
  gdcStatus: null,
  gender: null,
  gmcNumber: null,
  gmcStatus: null,
  knownAs: null,
  maidenName: null,
  medicalSchool: null,
  mobileNumber: null,
  permitToWork: null,
  personOwner: null,
  postCode: null,
  prevRevalBody: null,
  prevRevalBodyOther: null,
  prevRevalDate: null,
  publicHealthNumber: null,
  qualification: null,
  role: [],
  settled: null,
  surname: null,
  telephoneNumber: null,
  title: null,
  visaIssued: null,
  signature: null
};
