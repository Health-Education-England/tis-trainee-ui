import { FormRPartB } from "../models/FormRPartB";
import { LifeCycleState } from "../models/LifeCycleState";

export const draftFormRPartB: FormRPartB = {
  id: "5e972ec9b9b5781b94eb1270",
  traineeTisId: "123",
  forename: "Anthony Mara",
  surname: "Gilliam",
  gmcNumber: "11111111",
  email: "email@email.com",
  localOfficeName: "Health Education England Thames Valley",
  prevRevalBody: "Health Education England Midlands",
  prevRevalBodyOther: "",
  prevRevalDate: "2020-04-22",
  currRevalDate: "2020-04-22",
  programmeSpecialty: "ST3",
  dualSpecialty: "DS",
  work: [
    {
      typeOfWork: "In Post ST1",
      startDate: "2019-01-12",
      endDate: "2019-12-13",
      trainingPost: "Yes",
      site: "Addenbrookes Hospital",
      siteLocation: "Hills Road Cambridge Cambridgeshire"
    },
    {
      typeOfWork: "In Post ST2",
      startDate: "2020-01-13",
      endDate: "2020-12-21",
      trainingPost: "Yes",
      site: "Addenbrookes Hospital",
      siteLocation: "Hills Road Cambridge Cambridgeshire"
    },
    {
      typeOfWork: "In Post ST3",
      startDate: "2020-01-22",
      endDate: "2020-12-24",
      trainingPost: "Yes",
      site: "Addenbrookes Hospital",
      siteLocation: "Hills Road Cambridge Cambridgeshire"
    }
  ],
  sicknessAbsence: 1,
  parentalLeave: 2,
  careerBreaks: 3,
  paidLeave: 4,
  unauthorisedLeave: 5,
  otherLeave: 6,
  totalLeave: 21,
  isHonest: true,
  isHealthy: true,
  isWarned: true,
  isComplying: true,
  healthStatement: "I feel great etc.",
  havePreviousUnresolvedDeclarations: false,
  havePreviousDeclarations: true,
  previousDeclarations: [
    {
      declarationType: "Significant Event",
      dateOfEntry: "2020-03-07",
      title: "Previous declaration title",
      locationOfEntry: "Previous declaration location of entry"
    }
  ],
  previousDeclarationSummary: "",
  haveCurrentUnresolvedDeclarations: false,
  haveCurrentDeclarations: true,
  currentDeclarations: [
    {
      declarationType: "Complaint",
      dateOfEntry: "2020-06-12",
      title: "Current declaration title",
      locationOfEntry: "Current declaration location of entry"
    }
  ],
  currentDeclarationSummary: "",
  compliments: "",
  haveCovidDeclarations: null,
  covidDeclarationDto: null,
  lifecycleState: LifeCycleState.Submitted,
  submissionDate: "2020-04-22",
  lastModifiedDate: "2020-05-15"
};

export const draftFormRPartBWithNullCareerBreak: FormRPartB = {
  id: "6e644647434834getee",
  traineeTisId: "456",
  forename: "Billy",
  surname: "Ocean",
  gmcNumber: "11111111",
  email: "email2@email.com",
  localOfficeName: "Health Education England Thames Valley",
  prevRevalBody: "Health Education England Midlands",
  prevRevalBodyOther: "",
  prevRevalDate: "2020-04-22",
  currRevalDate: "2020-04-22",
  programmeSpecialty: "ST3",
  dualSpecialty: "DS",
  work: [
    {
      typeOfWork: "In Post ST1 Dermatology",
      startDate: "2019-01-12",
      endDate: "2019-12-21",
      trainingPost: "Yes",
      site: "Addenbrookes Hospital",
      siteLocation: "Hills Road Cambridge Cambridgeshire"
    },
    {
      typeOfWork: "In Post ST1 Dermatology",
      startDate: "2020-01-01",
      endDate: "2020-12-31",
      trainingPost: "Yes",
      site: "Addenbrookes Hospital",
      siteLocation: "Hills Road Cambridge Cambridgeshire"
    }
  ],
  sicknessAbsence: 0,
  parentalLeave: 0,
  careerBreaks: null,
  paidLeave: 0,
  unauthorisedLeave: 10,
  otherLeave: 0,
  totalLeave: 10,
  isHonest: true,
  isHealthy: true,
  isWarned: true,
  isComplying: true,
  healthStatement: "I feel great etc.",
  havePreviousUnresolvedDeclarations: false,
  havePreviousDeclarations: true,
  previousDeclarations: [
    {
      declarationType: "Significant Event",
      dateOfEntry: "2020-03-07",
      title: "Previous declaration title",
      locationOfEntry: "Previous declaration location of entry"
    }
  ],
  previousDeclarationSummary: "",
  haveCurrentUnresolvedDeclarations: false,
  haveCurrentDeclarations: true,
  currentDeclarations: [
    {
      declarationType: "Complaint",
      dateOfEntry: "2020-06-12",
      title: "Current declaration title",
      locationOfEntry: "Current declaration location of entry"
    }
  ],
  currentDeclarationSummary: "",
  compliments: "",
  haveCovidDeclarations: null,
  covidDeclarationDto: null,
  lifecycleState: LifeCycleState.Draft,
  submissionDate: "2020-04-22",
  lastModifiedDate: "2020-04-15"
};

export const draftFormRPartBWithNoLeaveTotal = {
  id: "5e972ec9b9b5781b94eb1270",
  traineeTisId: "123",
  forename: "Anthony Mara",
  surname: "Gilliam",
  gmcNumber: "11111111",
  email: "email@email.com",
  localOfficeName: "Health Education England Thames Valley",
  prevRevalBody: "Health Education England Midlands",
  prevRevalBodyOther: "",
  prevRevalDate: "2020-04-22",
  currRevalDate: "2020-04-22",
  programmeSpecialty: "ST3",
  dualSpecialty: "DS",
  work: [
    {
      typeOfWork: "In Post ST1 Dermatology",
      startDate: "2019-01-12",
      endDate: "2019-12-21",
      trainingPost: "Yes",
      site: "Addenbrookes Hospital",
      siteLocation: "Hills Road Cambridge Cambridgeshire"
    },
    {
      typeOfWork: "In Post ST1 Dermatology",
      startDate: "2020-01-01",
      endDate: "2020-12-31",
      trainingPost: "Yes",
      site: "Addenbrookes Hospital",
      siteLocation: "Hills Road Cambridge Cambridgeshire"
    }
  ],
  sicknessAbsence: 1,
  parentalLeave: 1,
  careerBreaks: 1,
  paidLeave: 1,
  unauthorisedLeave: 1,
  otherLeave: 1,
  totalLeave: null,
  isHonest: true,
  isHealthy: true,
  isWarned: true,
  isComplying: true,
  healthStatement: "I feel great etc.",
  havePreviousUnresolvedDeclarations: false,
  havePreviousDeclarations: true,
  previousDeclarations: [
    {
      declarationType: "Significant Event",
      dateOfEntry: "2020-03-07",
      title: "Previous declaration title",
      locationOfEntry: "Previous declaration location of entry"
    }
  ],
  previousDeclarationSummary: "",
  haveCurrentUnresolvedDeclarations: false,
  haveCurrentDeclarations: true,
  currentDeclarations: [
    {
      declarationType: "Complaint",
      dateOfEntry: "2020-06-12",
      title: "Current declaration title",
      locationOfEntry: "Current declaration location of entry"
    }
  ],
  currentDeclarationSummary: "",
  compliments: "",
  haveCovidDeclarations: null,
  covidDeclarationDto: null,
  lifecycleState: LifeCycleState.Unsubmitted,
  submissionDate: "2020-04-01",
  lastModifiedDate: "2020-04-16"
};
