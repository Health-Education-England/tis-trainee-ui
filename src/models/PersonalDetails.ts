export interface PersonalDetails {
  surname: string | null;
  forenames: string | null;
  knownAs: string | null;
  maidenName: string | null;
  title: string | null;
  personOwner: string | null | undefined;
  dateOfBirth: Date | string | null;
  gender: string | null;
  qualification: string | null;
  dateAttained: Date | string | null;
  medicalSchool: string | null;
  telephoneNumber: string | null;
  mobileNumber: string | null;
  email: string | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  address4?: string | null;
  postCode: string | null;
  gmcNumber: string | null;
  gmcStatus: string | null;
  gdcNumber: string | null;
  gdcStatus: string | null;
  publicHealthNumber: string | null;
  eeaResident: string | null;
  permitToWork: string | null;
  settled: string | null;
  visaIssued: string | null;
  detailsNumber: string | null;
  prevRevalBody: string | null;
  prevRevalBodyOther: string | null;
  currRevalDate: Date | string | null;
  prevRevalDate: Date | string | null;
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
  settled: null,
  surname: null,
  telephoneNumber: null,
  title: null,
  visaIssued: null
};
