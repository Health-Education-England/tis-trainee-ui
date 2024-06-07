import dayjs from "dayjs";
import { PersonalDetails } from "../models/PersonalDetails";
import { TraineeProfile } from "../models/TraineeProfile";
import { Status } from "../models/Status";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { Placement } from "../models/Placement";
import {
  oneWeekAgo,
  today,
  todayDate,
  twelveWeeksAhead,
  twelveWeeksAheadPlusOneDay,
  yesterday
} from "../utilities/DateUtilities";
import { TisReferenceType, TraineeAction } from "../models/TraineeAction";

export const mockPersonalDetails: PersonalDetails = {
  surname: "Gilliam",
  forenames: "Anthony Mara",
  knownAs: "Ivy",
  maidenName: "N/A",
  title: "Mr",
  personOwner: "Health Education England Thames Valley",
  dateOfBirth: "1911-11-30",
  gender: "Male",
  qualification: "AKC - Association of King's College",
  dateAttained: "2018-05-30",
  medicalSchool: "University of Science and Technology",
  telephoneNumber: "01632960363",
  mobileNumber: "07465879348",
  email: "email@email.com",
  address1: "585-6360 Interdum Street",
  address2: "Goulburn",
  address3: "London",
  address4: "",
  postCode: "WC1B 5DN",
  gmcNumber: "11111111",
  gmcStatus: "",
  gdcNumber: "",
  gdcStatus: "",
  publicHealthNumber: "",
  eeaResident: "",
  permitToWork: "",
  settled: "",
  visaIssued: "",
  detailsNumber: "",
  prevRevalBody: "",
  prevRevalBodyOther: "",
  prevRevalDate: "2021-12-31",
  currRevalDate: "2021-12-31",
  signature: {
    signedAt: new Date(-8640000000000000),
    validUntil: new Date(8640000000000000),
    hmac: ""
  }
};

export const mockProgrammeMemberships: ProgrammeMembership[] = [
  {
    startDate: new Date("2020-01-01"),
    endDate: new Date("2022-01-01"),
    programmeCompletionDate: new Date("2019-12-31"),
    tisId: "1",
    programmeName: "Cardiology",
    programmeNumber: "EOE8945",
    managingDeanery: "Health Education England East of England",
    programmeMembershipType: "SUBSTANTIVE",
    status: Status.Current,
    curricula: [
      {
        curriculumTisId: "1",
        curriculumName: "ST1",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2020-01-01"),
        curriculumEndDate: new Date("2023-01-01")
      },
      {
        curriculumTisId: "2",
        curriculumName: "ST2",
        curriculumSubType: "ACF_OTHER_FUNDING",
        curriculumStartDate: new Date("2020-06-01"),
        curriculumEndDate: new Date("2024-06-01")
      },
      {
        curriculumTisId: "3",
        curriculumName: "ST3",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2020-08-01"),
        curriculumEndDate: new Date("2025-08-01")
      }
    ],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG8"
    }
  },
  {
    startDate: new Date("2022-01-01"),
    endDate: dayjs().add(1, "year").toDate(),
    programmeCompletionDate: new Date("2021-12-31"),
    tisId: "2",
    programmeName: "General Practice",
    programmeNumber: "EOE8950",
    managingDeanery: "Health Education England East of England",
    programmeMembershipType: "LAT",
    status: Status.Current,
    curricula: [
      {
        curriculumTisId: "4",
        curriculumName: "ST4",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2022-01-01"),
        curriculumEndDate: new Date("2023-01-01")
      },
      {
        curriculumTisId: "5",
        curriculumName: "ST5",
        curriculumSubType: "ACF_OTHER_FUNDING",
        curriculumStartDate: new Date("2022-06-01"),
        curriculumEndDate: new Date("2024-06-01")
      },
      {
        curriculumTisId: "6",
        curriculumName: "ST6",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2022-08-01"),
        curriculumEndDate: new Date("2025-08-01")
      }
    ],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG8"
    }
  }
];

export const mockProgrammeMembershipNonTemplatedField = {
  startDate: new Date("2020-01-01"),
  endDate: new Date("2022-01-01"),
  programmeCompletionDate: new Date("2019-12-31"),
  tisId: "1",
  programmeName: "Cardiology",
  programmeNumber: "EOE8945",
  managingDeanery: "Health Education England East of England",
  programmeMembershipType: "SUBSTANTIVE",
  status: Status.Current,
  curricula: [],
  conditionsOfJoining: {
    signedAt: null,
    version: "GG8"
  },
  nonTemplatedField: "nonTemplatedField"
};

export const mockProgrammeMembershipNoCurricula = {
  startDate: new Date("2020-01-01"),
  endDate: new Date("2022-01-01"),
  programmeCompletionDate: new Date("2019-12-31"),
  tisId: "1",
  programmeName: "Cardiology",
  programmeNumber: "EOE8945",
  managingDeanery: "Health Education England East of England",
  programmeMembershipType: "SUBSTANTIVE",
  status: Status.Current,
  curricula: [],
  conditionsOfJoining: {
    signedAt: null,
    version: "GG8"
  }
};

export const mockProgrammeMembershipNoMedicalCurricula = {
  startDate: new Date("2020-01-01"),
  endDate: new Date("2022-01-01"),
  programmeCompletionDate: new Date("2019-12-31"),
  tisId: "1",
  programmeName: "Cardiology",
  programmeNumber: "EOE8945",
  managingDeanery: "Health Education England East of England",
  programmeMembershipType: "SUBSTANTIVE",
  status: Status.Current,
  curricula: [
    {
      curriculumTisId: "4",
      curriculumName: "ST4",
      curriculumSubType: "DENTAL_CURRICULUM",
      curriculumStartDate: new Date("2022-01-01"),
      curriculumEndDate: new Date("2025-01-01")
    },
    {
      curriculumTisId: "5",
      curriculumName: "ST5",
      curriculumSubType: "ACF_OTHER_FUNDING",
      curriculumStartDate: new Date("2022-06-01"),
      curriculumEndDate: new Date("2025-06-01")
    },
    {
      curriculumTisId: "6",
      curriculumName: "ST6",
      curriculumSubType: "DENTAL_CURRICULUM",
      curriculumStartDate: new Date("2022-08-01"),
      curriculumEndDate: new Date("2025-08-01")
    }
  ],
  conditionsOfJoining: {
    signedAt: null,
    version: "GG8"
  }
};

export const mockProgrammeMembershipDuplicateCurriculaStart = {
  startDate: new Date("2020-01-01"),
  endDate: new Date("2022-01-01"),
  programmeCompletionDate: new Date("2019-12-31"),
  tisId: "1",
  programmeName: "Cardiology",
  programmeNumber: "EOE8945",
  managingDeanery: "Health Education England East of England",
  programmeMembershipType: "SUBSTANTIVE",
  status: Status.Current,
  curricula: [
    {
      curriculumTisId: "4",
      curriculumName: "C",
      curriculumSubType: "MEDICAL_CURRICULUM",
      curriculumStartDate: new Date("2022-01-01"),
      curriculumEndDate: new Date("2025-02-01")
    },
    {
      curriculumTisId: "5",
      curriculumName: "A",
      curriculumSubType: "MEDICAL_CURRICULUM",
      curriculumStartDate: new Date("2022-01-01"),
      curriculumEndDate: new Date("2025-01-01")
    },
    {
      curriculumTisId: "6",
      curriculumName: "B",
      curriculumSubType: "MEDICAL_CURRICULUM",
      curriculumStartDate: new Date("2022-01-01"),
      curriculumEndDate: new Date("2025-03-01")
    }
  ],
  conditionsOfJoining: {
    signedAt: null,
    version: "GG8"
  }
};

export const mockProgrammeMembershipCojSigned: ProgrammeMembership = {
  tisId: "1",
  programmeName: "",
  programmeNumber: "",
  startDate: new Date("2010-10-14"),
  endDate: new Date("2011-10-14"),
  managingDeanery: "",
  curricula: [],
  conditionsOfJoining: {
    signedAt: new Date("2010-10-14"),
    version: "GG8"
  }
};

export const mockProgrammeMembershipCojNotSigned: ProgrammeMembership[] = [
  {
    tisId: "1",
    programmeName: "",
    programmeNumber: "",
    startDate: new Date("2010-10-14"),
    endDate: new Date("2011-10-14"),
    managingDeanery: "",
    curricula: [],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG8"
    }
  },
  {
    tisId: "2",
    programmeName: "",
    programmeNumber: "",
    startDate: new Date("2010-10-14"),
    endDate: new Date("2011-10-14"),
    managingDeanery: "",
    curricula: [],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG8"
    }
  }
];

export const mockPlacements: Placement[] = [
  {
    endDate: new Date("2020-12-31"),
    grade: "ST1",
    tisId: "315",
    placementType: "In Post",
    site: "Addenbrookes Hospital",
    siteLocation: "Site location",
    siteKnownAs: "Addenbrookes Hospital (siteNo)",
    otherSites: [],
    specialty: "Dermatology",
    subSpecialty: "Sub Specialty",
    otherSpecialties: null,
    postAllowsSubspecialty: true,
    startDate: new Date("2019-01-01"),
    status: Status.Current,
    employingBody: "Employing body",
    trainingBody: "Training body",
    wholeTimeEquivalent: "0.5"
  },
  {
    endDate: new Date("2029-12-31"),
    grade: "ST2",
    tisId: "316",
    placementType: "Long-term sick",
    site: "Addenbrookes Hospital",
    siteLocation: "Site location",
    siteKnownAs: "Addenbrookes Hospital (siteNo)",
    otherSites: [
      {
        site: "Huddersfield Royal Infirmary",
        siteKnownAs: "Huddersfield Royal Infirmary (RWY01)",
        siteLocation: "Acre Street Lindley Huddersfield"
      },
      {
        site: "Great North Children's Hospital",
        siteKnownAs: "Great North Children's Hospital (RTD10)",
        siteLocation: "Queen Victoria Road Newcastle upon Tyne"
      }
    ],
    specialty: "Dermatology",
    subSpecialty: "Sub specialty",
    otherSpecialties: [
      {
        specialtyId: "211",
        name: "Ophthalmology"
      },
      {
        specialtyId: "176",
        name: "Allergy"
      }
    ],
    postAllowsSubspecialty: true,
    startDate: new Date("2020-01-01"),
    status: Status.Current,
    employingBody: "",
    trainingBody: "Carmarthenshire NHS Trust",
    wholeTimeEquivalent: "0.75"
  }
];

export const mockPlacementPartialOtherSites = {
  endDate: new Date("2020-12-31"),
  grade: "ST1",
  tisId: "315",
  placementType: "In Post",
  site: "Addenbrookes Hospital",
  siteLocation: "Site location",
  siteKnownAs: "Addenbrookes Hospital (siteNo)",
  otherSites: [
    {
      site: "site with missing location",
      siteKnownAs: "site known as"
    },
    {
      site: "site with missing known as",
      siteLocation: "site location"
    },
    {
      site: "site with only name"
    }
  ],
  specialty: "Dermatology",
  subSpecialty: "sub specialty",
  otherSpecialties: null,
  postAllowsSubspecialty: true,
  startDate: new Date("2019-01-01"),
  status: Status.Current,
  employingBody: "Employing body",
  trainingBody: "Training body",
  wholeTimeEquivalent: "0.5"
};

export const mockPlacementNoOtherSites = {
  endDate: new Date("2020-12-31"),
  grade: "ST1",
  tisId: "315",
  placementType: "In Post",
  site: "Addenbrookes Hospital",
  siteLocation: "Site location",
  siteKnownAs: "Addenbrookes Hospital (siteNo)",
  otherSites: [],
  specialty: "Dermatology",
  subSpecialty: "sub specialty",
  otherSpecialties: null,
  postAllowsSubspecialty: true,
  startDate: new Date("2019-01-01"),
  status: Status.Current,
  employingBody: "Employing body",
  trainingBody: "Training body",
  wholeTimeEquivalent: "0.5"
};

export const mockPlacementSubSpecialtyPostAllows: Placement = {
  endDate: new Date("2020-12-31"),
  grade: "ST1",
  tisId: "315",
  placementType: "In Post",
  site: "Addenbrookes Hospital",
  siteLocation: "Site location",
  siteKnownAs: "Addenbrookes Hospital (siteNo)",
  otherSites: [],
  specialty: "Dermatology",
  subSpecialty: "sub specialty",
  otherSpecialties: null,
  postAllowsSubspecialty: true,
  startDate: new Date("2019-01-01"),
  status: Status.Current,
  employingBody: "Employing body",
  trainingBody: "Training body",
  wholeTimeEquivalent: "0.5"
};

export const mockPlacementNoSubSpecialtyPostNotAllows: Placement = {
  endDate: new Date("2020-12-31"),
  grade: "ST1",
  tisId: "315",
  placementType: "In Post",
  site: "Addenbrookes Hospital",
  siteLocation: "Site location",
  siteKnownAs: "Addenbrookes Hospital (siteNo)",
  otherSites: [],
  specialty: "Dermatology",
  subSpecialty: "",
  otherSpecialties: null,
  postAllowsSubspecialty: false,
  startDate: new Date("2019-01-01"),
  status: Status.Current,
  employingBody: "Employing body",
  trainingBody: "Training body",
  wholeTimeEquivalent: "0.5"
};

export const mockPlacementNoSubSpecialtyPostAllows: Placement = {
  endDate: new Date("2020-12-31"),
  grade: "ST1",
  tisId: "315",
  placementType: "In Post",
  site: "Addenbrookes Hospital",
  siteLocation: "Site location",
  siteKnownAs: "Addenbrookes Hospital (siteNo)",
  otherSites: [],
  specialty: "Dermatology",
  subSpecialty: "",
  otherSpecialties: null,
  postAllowsSubspecialty: true,
  startDate: new Date("2019-01-01"),
  status: Status.Current,
  employingBody: "Employing body",
  trainingBody: "Training body",
  wholeTimeEquivalent: "0.5"
};

export const mockPlacemenSubSpecialtyPostNotAllows: Placement = {
  endDate: new Date("2020-12-31"),
  grade: "ST1",
  tisId: "315",
  placementType: "In Post",
  site: "Addenbrookes Hospital",
  siteLocation: "Site location",
  siteKnownAs: "Addenbrookes Hospital (siteNo)",
  otherSites: [],
  specialty: "Dermatology",
  subSpecialty: "sub specialty",
  otherSpecialties: null,
  postAllowsSubspecialty: false,
  startDate: new Date("2019-01-01"),
  status: Status.Current,
  employingBody: "Employing body",
  trainingBody: "Training body",
  wholeTimeEquivalent: "0.5"
};

export const mockPlacementNonTemplatedField = {
  endDate: new Date("2020-12-31"),
  grade: "ST1",
  tisId: "315",
  placementType: "In Post",
  site: "Addenbrookes Hospital",
  siteLocation: "Site location",
  siteKnownAs: "Addenbrookes Hospital (siteNo)",
  otherSites: [],
  specialty: "Dermatology",
  subSpecialty: "sub specialty",
  otherSpecialties: null,
  postAllowsSubspecialty: true,
  startDate: new Date("2019-01-01"),
  status: Status.Current,
  employingBody: "Employing body",
  trainingBody: "Training body",
  wholeTimeEquivalent: "0.5",
  nonTemplatedField: "nonTemplatedField"
};

export const mockTraineeProfile: TraineeProfile = {
  traineeTisId: "123",
  personalDetails: mockPersonalDetails,
  programmeMemberships: mockProgrammeMemberships,
  placements: mockPlacements
};

export const mockTraineeProfileNoMatch: TraineeProfile = {
  traineeTisId: "456",
  personalDetails: { ...mockPersonalDetails, personOwner: "TIS on Mars" },
  programmeMemberships: mockProgrammeMemberships,
  placements: mockPlacements
};

export const mockTraineeProfileNoGMC: TraineeProfile = {
  traineeTisId: "789",
  personalDetails: { ...mockPersonalDetails, gmcNumber: "" },
  programmeMemberships: mockProgrammeMemberships,
  placements: mockPlacements
};

export const mockPlacementsForGrouping: Placement[] = [
  // Past
  {
    tisId: "1",
    site: "site1",
    siteLocation: "siteLocation1",
    siteKnownAs: "siteKnownAs1",
    otherSites: [],
    startDate: oneWeekAgo,
    endDate: yesterday,
    wholeTimeEquivalent: "wholeTimeEquivalent1",
    specialty: "specialty1",
    subSpecialty: "subSpecialty1",
    otherSpecialties: null,
    postAllowsSubspecialty: true,
    grade: "grade1",
    placementType: "placementType1",
    employingBody: "employingBody1",
    trainingBody: "trainingBody1"
  },
  // Current
  {
    tisId: "2",
    site: "site2",
    siteLocation: "siteLocation2",
    siteKnownAs: "siteKnownAs2",
    otherSites: [],
    startDate: todayDate,
    endDate: todayDate,
    wholeTimeEquivalent: "wholeTimeEquivalent2",
    specialty: "specialty2",
    subSpecialty: "subSpecialty2",
    otherSpecialties: null,
    postAllowsSubspecialty: true,
    grade: "grade2",
    placementType: "placementType2",
    employingBody: "employingBody2",
    trainingBody: "trainingBody2"
  },
  // Upcoming
  {
    tisId: "3",
    site: "site3",
    siteLocation: "siteLocation3",
    siteKnownAs: "siteKnownAs3",
    otherSites: [],
    startDate: twelveWeeksAhead,
    endDate: twelveWeeksAheadPlusOneDay,
    wholeTimeEquivalent: "wholeTimeEquivalent3",
    specialty: "specialty3",
    subSpecialty: "subSpecialty3",
    otherSpecialties: null,
    postAllowsSubspecialty: true,
    grade: "grade3",
    placementType: "placementType3",
    employingBody: "employingBody3",
    trainingBody: "trainingBody3"
  },
  // Future
  {
    tisId: "4",
    site: "site4",
    siteLocation: "siteLocation4",
    siteKnownAs: "siteKnownAs4",
    otherSites: [],
    startDate: twelveWeeksAheadPlusOneDay,
    endDate: twelveWeeksAheadPlusOneDay,
    wholeTimeEquivalent: "wholeTimeEquivalent4",
    specialty: "specialty4",
    subSpecialty: "",
    otherSpecialties: null,
    postAllowsSubspecialty: true,
    grade: "grade4",
    placementType: "placementType4",
    employingBody: "employingBody4",
    trainingBody: "trainingBody4"
  }
];

export const mockOutstandingActions: TraineeAction[] = [
  // Future action (not to show)
  {
    id: "0",
    type: "REVIEW_DATA",
    traineeTisId: "12345",
    tisReferenceInfo: {
      id: "1",
      type: TisReferenceType.programmeMembership
    },
    availableFrom: new Date(twelveWeeksAhead),
    dueBy: new Date(twelveWeeksAhead)
  },
  // Non-due Outstanding action
  {
    id: "1",
    type: "REVIEW_DATA",
    traineeTisId: "12345",
    tisReferenceInfo: {
      id: "1",
      type: TisReferenceType.programmeMembership
    },
    availableFrom: new Date(oneWeekAgo),
    dueBy: new Date(today)
  },
  // Overdue action
  {
    id: "2",
    type: "REVIEW_DATA",
    traineeTisId: "12345",
    tisReferenceInfo: {
      id: "1",
      type: TisReferenceType.programmeMembership
    },
    availableFrom: new Date(oneWeekAgo),
    dueBy: new Date(yesterday)
  },
  // Future action (not to show)
  {
    id: "3",
    type: "REVIEW_DATA",
    traineeTisId: "12345",
    tisReferenceInfo: {
      id: "1",
      type: TisReferenceType.placement
    },
    availableFrom: new Date(twelveWeeksAhead),
    dueBy: new Date(twelveWeeksAhead)
  },
  // Non-due Outstanding action
  {
    id: "4",
    type: "REVIEW_DATA",
    traineeTisId: "12345",
    tisReferenceInfo: {
      id: "315",
      type: TisReferenceType.placement
    },
    availableFrom: new Date(oneWeekAgo),
    dueBy: new Date(today)
  },
  // Overdue action
  {
    id: "5",
    type: "REVIEW_DATA",
    traineeTisId: "12345",
    tisReferenceInfo: {
      id: "315",
      type: TisReferenceType.placement
    },
    availableFrom: new Date(oneWeekAgo),
    dueBy: new Date(yesterday)
  }
];

export const mockTraineeProfileCovid: TraineeProfile = {
  traineeTisId: "321",
  personalDetails: {
    ...mockPersonalDetails,
    dateOfBirth: "2020-01-01",
    currRevalDate: "2028-01-01"
  },
  programmeMemberships: mockProgrammeMemberships,
  placements: mockPlacements
};

export const mockTraineeProfileFormB: TraineeProfile = {
  ...mockTraineeProfile,
  placements: mockPlacementsForGrouping
};

export const mockTraineeProfileFormBCovid: TraineeProfile = {
  ...mockTraineeProfileCovid,
  placements: mockPlacementsForGrouping
};
