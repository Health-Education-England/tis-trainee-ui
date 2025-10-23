import dayjs from "dayjs";
import { PersonalDetails } from "../models/PersonalDetails";
import { TraineeProfile } from "../models/TraineeProfile";
import { Status } from "../models/Status";
import {
  mockResponsibleOfficer,
  ProgrammeMembership
} from "../models/ProgrammeMembership";
import { Placement } from "../models/Placement";
import {
  oneWeekAgo,
  todayDate,
  twelveWeeksAhead,
  twelveWeeksAheadPlusOneDay,
  yesterday,
  today
} from "../utilities/DateUtilities";
import { CojVersionType } from "../redux/slices/userSlice";
import { UserFeaturesType } from "../models/FeatureFlags";
import { TraineeAction } from "../models/TraineeAction";

export const mockPersonalDetails: PersonalDetails = {
  surname: "Gilliam",
  forenames: "Anthony Mara",
  knownAs: "Ivy",
  maidenName: "N/A",
  title: "Mr",
  role: ["DR in Training"],
  personOwner: "Thames Valley",
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
  gmcNumber: "1111111",
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
  signature: null
};

export const mockProgrammeMemberships: ProgrammeMembership[] = [
  {
    startDate: new Date("2020-01-01"),
    endDate: dayjs().add(3, "year").toDate(),
    programmeCompletionDate: new Date("2019-12-31"),
    tisId: "1",
    programmeName: "Cardiology",
    programmeNumber: "EOE8945",
    trainingNumber: "EOE/ABC-123/1111111/C",
    managingDeanery: "East of England",
    responsibleOfficer: mockResponsibleOfficer,
    programmeMembershipType: "SUBSTANTIVE",
    status: Status.Current,
    curricula: [
      {
        curriculumTisId: "1",
        curriculumMembershipId: "455002",
        curriculumName: "ST1",
        curriculumSpecialty: "Cardiology",
        curriculumSpecialtyCode: "030",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2020-01-01"),
        curriculumEndDate: new Date("2023-01-01")
      },
      {
        curriculumTisId: "2",
        curriculumMembershipId: "455003",
        curriculumName: "ST2",
        curriculumSpecialty: "Cardiology",
        curriculumSpecialtyCode: "030",
        curriculumSubType: "ACF_OTHER_FUNDING",
        curriculumStartDate: new Date("2020-06-01"),
        curriculumEndDate: new Date("2024-06-01")
      },
      {
        curriculumTisId: "3",
        curriculumMembershipId: "455004",
        curriculumName: "ST3",
        curriculumSpecialty: "Cardiology",
        curriculumSpecialtyCode: "030",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2020-08-01"),
        curriculumEndDate: new Date("2025-08-01")
      }
    ],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG9" as CojVersionType
    }
  },
  {
    startDate: new Date("2022-01-01"),
    endDate: dayjs().add(4, "year").toDate(),
    programmeCompletionDate: new Date("2021-12-31"),
    tisId: "2",
    programmeName: "General Practice",
    programmeNumber: "EOE8950",
    trainingNumber: "EOE/XYZ-789/1111111/C",
    managingDeanery: "East of England",
    responsibleOfficer: mockResponsibleOfficer,
    programmeMembershipType: "LAT",
    status: Status.Current,
    curricula: [
      {
        curriculumTisId: "4",
        curriculumMembershipId: "455002",
        curriculumName: "ST4",
        curriculumSpecialty: "Cardiology",
        curriculumSpecialtyCode: "030",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2022-01-01"),
        curriculumEndDate: new Date("2023-01-01")
      },
      {
        curriculumTisId: "5",
        curriculumMembershipId: "455003",
        curriculumName: "ST5",
        curriculumSpecialty: "Cardiology",
        curriculumSpecialtyCode: "030",
        curriculumSubType: "ACF_OTHER_FUNDING",
        curriculumStartDate: new Date("2022-06-01"),
        curriculumEndDate: new Date("2024-06-01")
      },
      {
        curriculumTisId: "6",
        curriculumMembershipId: "455004",
        curriculumName: "ST6",
        curriculumSpecialty: "Cardiology",
        curriculumSpecialtyCode: "030",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2022-08-01"),
        curriculumEndDate: new Date("2025-08-01")
      }
    ],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG9" as CojVersionType
    }
  }
];

export const mockProgrammeMembershipsForGrouping: ProgrammeMembership[] = [
  // Past
  {
    startDate: new Date("2020-01-01"),
    endDate: new Date("2022-01-01"),
    tisId: "1",
    programmeName: "Past",
    programmeNumber: "EOE8945",
    trainingNumber: "EOE/ABC-123/1111111/C",
    managingDeanery: "East of England",
    curricula: [
      {
        curriculumTisId: "1",
        curriculumMembershipId: "455002",
        curriculumName: "ST1",
        curriculumSpecialty: "Cardiology",
        curriculumSpecialtyCode: "030",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2020-01-01"),
        curriculumEndDate: new Date("2023-01-01")
      }
    ],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG9" as CojVersionType
    }
  },
  // Current
  {
    startDate: new Date("2020-01-01"),
    endDate: dayjs().add(1, "year").toDate(),
    tisId: "2",
    programmeName: "Current",
    programmeNumber: "EOE8945",
    trainingNumber: "EOE/ABC-123/1111111/C",
    managingDeanery: "East of England",
    curricula: [
      {
        curriculumTisId: "1",
        curriculumMembershipId: "455002",
        curriculumName: "ST1",
        curriculumSpecialty: "Cardiology",
        curriculumSpecialtyCode: "030",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2020-01-01"),
        curriculumEndDate: new Date("2023-01-01")
      }
    ],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG9" as CojVersionType
    }
  },
  // Upcoming
  {
    startDate: dayjs().add(10, "week").toDate(),
    endDate: dayjs().add(2, "year").toDate(),
    tisId: "3",
    programmeName: "Upcoming",
    programmeNumber: "EOE8945",
    trainingNumber: "EOE/ABC-123/1111111/C",
    managingDeanery: "East of England",
    curricula: [
      {
        curriculumTisId: "1",
        curriculumMembershipId: "455002",
        curriculumName: "ST1",
        curriculumSpecialty: "Cardiology",
        curriculumSpecialtyCode: "030",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2020-01-01"),
        curriculumEndDate: new Date("2023-01-01")
      }
    ],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG9" as CojVersionType
    }
  },
  // Future
  {
    startDate: dayjs().add(1, "year").toDate(),
    endDate: dayjs().add(2, "year").toDate(),
    tisId: "4",
    programmeName: "Future",
    programmeNumber: "EOE8945",
    trainingNumber: "EOE/ABC-123/1111111/C",
    managingDeanery: "East of England",
    curricula: [
      {
        curriculumTisId: "1",
        curriculumMembershipId: "455002",
        curriculumName: "ST1",
        curriculumSpecialty: "Cardiology",
        curriculumSpecialtyCode: "030",
        curriculumSubType: "MEDICAL_CURRICULUM",
        curriculumStartDate: new Date("2020-01-01"),
        curriculumEndDate: new Date("2023-01-01")
      }
    ],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG9" as CojVersionType
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
  trainingNumber: null,
  managingDeanery: "East of England",
  programmeMembershipType: "SUBSTANTIVE",
  status: Status.Current,
  curricula: [],
  conditionsOfJoining: {
    signedAt: null,
    version: "GG9" as CojVersionType
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
  trainingNumber: null,
  managingDeanery: "East of England",
  programmeMembershipType: "SUBSTANTIVE",
  status: Status.Current,
  curricula: [],
  conditionsOfJoining: {
    signedAt: null,
    version: "GG9" as CojVersionType
  }
};

export const mockProgrammeMembershipNoMedicalCurricula = {
  startDate: new Date("2020-01-01"),
  endDate: new Date("2022-01-01"),
  programmeCompletionDate: new Date("2019-12-31"),
  tisId: "1",
  programmeName: "Cardiology",
  programmeNumber: "EOE8945",
  trainingNumber: null,
  managingDeanery: "East of England",
  programmeMembershipType: "SUBSTANTIVE",
  status: Status.Current,
  curricula: [
    {
      curriculumTisId: "4",
      curriculumName: "ST4",
      curriculumSubType: "DENTAL_CURRICULUM",
      curriculumStartDate: new Date("2022-01-01"),
      curriculumEndDate: new Date("2025-01-01"),
      curriculumMembershipId: "455002",
      curriculumSpecialty: "Cardiology",
      curriculumSpecialtyCode: "030"
    },
    {
      curriculumTisId: "5",
      curriculumName: "ST5",
      curriculumSubType: "ACF_OTHER_FUNDING",
      curriculumStartDate: new Date("2022-06-01"),
      curriculumEndDate: new Date("2025-06-01"),
      curriculumMembershipId: "455003",
      curriculumSpecialty: "Cardiology",
      curriculumSpecialtyCode: "030"
    },
    {
      curriculumTisId: "6",
      curriculumName: "ST6",
      curriculumSubType: "DENTAL_CURRICULUM",
      curriculumStartDate: new Date("2022-08-01"),
      curriculumEndDate: new Date("2025-08-01"),
      curriculumMembershipId: "455004",
      curriculumSpecialty: "Cardiology",
      curriculumSpecialtyCode: "030"
    }
  ],
  conditionsOfJoining: {
    signedAt: null,
    version: "GG9" as CojVersionType
  }
};

export const mockProgrammeMembershipDuplicateCurriculaStart = {
  startDate: new Date("2020-01-01"),
  endDate: new Date("2022-01-01"),
  programmeCompletionDate: new Date("2019-12-31"),
  tisId: "1",
  programmeName: "Cardiology",
  programmeNumber: "EOE8945",
  trainingNumber: null,
  managingDeanery: "East of England",
  programmeMembershipType: "SUBSTANTIVE",
  status: Status.Current,
  curricula: [
    {
      curriculumTisId: "4",
      curriculumName: "C",
      curriculumSubType: "MEDICAL_CURRICULUM",
      curriculumStartDate: new Date("2022-01-01"),
      curriculumEndDate: new Date("2025-02-01"),
      curriculumMembershipId: "455002",
      curriculumSpecialty: "Cardiology",
      curriculumSpecialtyCode: "030"
    },
    {
      curriculumTisId: "5",
      curriculumName: "A",
      curriculumSubType: "MEDICAL_CURRICULUM",
      curriculumStartDate: new Date("2022-01-01"),
      curriculumEndDate: new Date("2025-01-01"),
      curriculumMembershipId: "455003",
      curriculumSpecialty: "Cardiology",
      curriculumSpecialtyCode: "030"
    },
    {
      curriculumTisId: "6",
      curriculumName: "B",
      curriculumSubType: "MEDICAL_CURRICULUM",
      curriculumStartDate: new Date("2022-01-01"),
      curriculumEndDate: new Date("2025-03-01"),
      curriculumMembershipId: "455004",
      curriculumSpecialty: "Cardiology",
      curriculumSpecialtyCode: "030"
    }
  ],
  conditionsOfJoining: {
    signedAt: null,
    version: "GG9" as CojVersionType
  }
};

export const mockProgrammeMembershipCojSigned: ProgrammeMembership = {
  tisId: "1",
  programmeName: "",
  programmeNumber: "",
  trainingNumber: null,
  startDate: dayjs().subtract(1, "year").toDate(),
  endDate: dayjs().add(4, "year").toDate(),
  managingDeanery: "",
  responsibleOfficer: mockResponsibleOfficer,
  curricula: [],
  conditionsOfJoining: {
    signedAt: dayjs().subtract(6, "month").toDate(),
    version: "GG9" as CojVersionType
  }
};

export const mockProgrammeMembershipCojNotSigned: ProgrammeMembership[] = [
  {
    tisId: "1",
    programmeName: "",
    programmeNumber: "",
    trainingNumber: null,
    startDate: dayjs().subtract(6, "year").toDate(),
    endDate: dayjs().add(1, "year").toDate(),
    managingDeanery: "",
    responsibleOfficer: mockResponsibleOfficer,
    curricula: [],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG9" as CojVersionType
    }
  },
  {
    tisId: "2",
    programmeName: "",
    programmeNumber: "",
    trainingNumber: null,
    startDate: new Date("2010-10-14"),
    endDate: new Date("2011-10-14"),
    managingDeanery: "",
    responsibleOfficer: mockResponsibleOfficer,
    curricula: [],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG9" as CojVersionType
    }
  }
];

export const mockProgrammeMembershipNoTrainingNumber: ProgrammeMembership[] = [
  {
    tisId: "1",
    programmeName: "",
    programmeNumber: "",
    trainingNumber: null,
    startDate: new Date("2010-10-14"),
    endDate: new Date("2011-10-14"),
    managingDeanery: "",
    responsibleOfficer: {
      emailAddress: null,
      firstName: null,
      lastName: null,
      gmcId: null,
      phoneNumber: null
    },
    curricula: [],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG9" as CojVersionType
    }
  },
  {
    tisId: "2",
    programmeName: "",
    programmeNumber: "",
    trainingNumber: null,
    startDate: new Date("2010-10-14"),
    endDate: new Date("2011-10-14"),
    managingDeanery: "",
    responsibleOfficer: mockResponsibleOfficer,
    curricula: [],
    conditionsOfJoining: {
      signedAt: null,
      version: "GG9" as CojVersionType
    }
  }
];

export const mockProgrammeMembershipNoResponsibleOfficer: ProgrammeMembership[] =
  [
    {
      tisId: "1",
      programmeName: "",
      programmeNumber: "",
      trainingNumber: null,
      startDate: new Date("2010-10-14"),
      endDate: new Date("2011-10-14"),
      managingDeanery: "",
      curricula: [],
      conditionsOfJoining: {
        signedAt: null,
        version: "GG9" as CojVersionType
      }
    },
    {
      tisId: "2",
      programmeName: "",
      programmeNumber: "",
      trainingNumber: null,
      startDate: new Date("2010-10-14"),
      endDate: new Date("2011-10-14"),
      managingDeanery: "",
      curricula: [],
      conditionsOfJoining: {
        signedAt: null,
        version: "GG9" as CojVersionType
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
    endDate: dayjs().add(3, "year").toDate(),
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
    startDate: dayjs().subtract(1, "year").toDate(),
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
  qualifications: [],
  programmeMemberships: mockProgrammeMemberships,
  placements: mockPlacements
};

export const mockTraineeProfileNoMatch: TraineeProfile = {
  traineeTisId: "456",
  personalDetails: { ...mockPersonalDetails, personOwner: "TIS on Mars" },
  qualifications: [],
  programmeMemberships: mockProgrammeMemberships,
  placements: mockPlacements
};

export const mockTraineeProfileNoGMC: TraineeProfile = {
  traineeTisId: "789",
  personalDetails: { ...mockPersonalDetails, gmcNumber: "" },
  qualifications: [],
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
    traineeId: "12345",
    tisReferenceInfo: {
      id: "1",
      type: "PLACEMENT"
    },
    availableFrom: new Date(twelveWeeksAhead),
    dueBy: new Date(twelveWeeksAhead),
    completed: null
  },
  // Non-due Outstanding action
  {
    id: "1",
    type: "REVIEW_DATA",
    traineeId: "12345",
    tisReferenceInfo: {
      id: "1",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: new Date(oneWeekAgo),
    dueBy: new Date(today),
    completed: null
  },
  // Overdue action
  {
    id: "2",
    type: "REVIEW_DATA",
    traineeId: "12345",
    tisReferenceInfo: {
      id: "1",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: new Date(oneWeekAgo),
    dueBy: new Date(yesterday),
    completed: null
  },
  // Future action (not to show)
  {
    id: "3",
    type: "REVIEW_DATA",
    traineeId: "12345",
    tisReferenceInfo: {
      id: "1",
      type: "PLACEMENT"
    },
    availableFrom: new Date(twelveWeeksAhead),
    dueBy: new Date(twelveWeeksAhead),
    completed: null
  },
  // Non-due Outstanding action
  {
    id: "4",
    type: "REVIEW_DATA",
    traineeId: "12345",
    tisReferenceInfo: {
      id: "315",
      type: "PLACEMENT"
    },
    availableFrom: new Date(oneWeekAgo),
    dueBy: new Date(today),
    completed: null
  },
  // Overdue action
  {
    id: "5",
    type: "REVIEW_DATA",
    traineeId: "12345",
    tisReferenceInfo: {
      id: "315",
      type: "PLACEMENT"
    },
    availableFrom: new Date(oneWeekAgo),
    dueBy: new Date(yesterday),
    completed: null
  },
  //non REVIEW_DATA type action
  {
    id: "6",
    type: "another type",
    traineeId: "12345",
    tisReferenceInfo: {
      id: "315",
      type: "PLACEMENT"
    },
    availableFrom: new Date(oneWeekAgo),
    dueBy: new Date(yesterday),
    completed: null
  }
];

export const mockTraineeProfileCovid: TraineeProfile = {
  traineeTisId: "321",
  personalDetails: {
    ...mockPersonalDetails,
    dateOfBirth: "2020-01-01",
    currRevalDate: "2028-01-01"
  },
  qualifications: [],
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

export const mockProgrammesForLinkerTest: ProgrammeMembership[] = [
  {
    ...mockProgrammeMemberships[0],
    programmeName: "Acute medicine",
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    tisId: "1"
  },
  {
    ...mockProgrammeMemberships[0],
    programmeName: "Adult psychiatry",
    startDate: `${dayjs().subtract(1, "year").year()}-12-31`,
    endDate: `${dayjs().year()}-12-31`,
    tisId: "2"
  },
  {
    ...mockProgrammeMemberships[0],
    programmeName: "Acute medicine",
    startDate: dayjs().subtract(1, "year").format("YYYY-MM-DD"),
    endDate: dayjs().subtract(1, "year").format("YYYY-MM-DD"),
    tisId: "3"
  },
  {
    ...mockProgrammeMemberships[0],
    programmeName: "Acute medicine",
    startDate: dayjs().subtract(2, "year").format("YYYY-MM-DD"),
    endDate: dayjs()
      .subtract(1, "year")
      .subtract(1, "day")
      .format("YYYY-MM-DD"),
    tisId: "4"
  },
  {
    ...mockProgrammeMemberships[0],
    programmeName: "Adult psychiatry",
    startDate: dayjs().add(1, "year").format("YYYY-MM-DD"),
    endDate: dayjs().add(3, "year").format("YYYY-MM-DD"),
    tisId: "5"
  },
  {
    ...mockProgrammeMemberships[0],
    programmeName: "Acute medicine",
    startDate: dayjs().add(1, "year").add(1, "day").format("YYYY-MM-DD"),
    endDate: dayjs().add(1, "year").add(1, "day").format("YYYY-MM-DD"),
    tisId: "6"
  }
];

export const mockProgrammesForLinkerTestOutsideArcp: ProgrammeMembership[] = [
  mockProgrammesForLinkerTest[3],
  mockProgrammesForLinkerTest[4]
];

export const mockProgrammesForLinkerTestOutsideNewStarter: ProgrammeMembership[] =
  [mockProgrammesForLinkerTest[2], mockProgrammesForLinkerTest[5]];

export const mockUserFeaturesNone: UserFeaturesType = {
  actions: {
    enabled: false
  },
  cct: {
    enabled: false
  },
  details: {
    enabled: false,
    placements: {
      enabled: false
    },
    profile: {
      enabled: false,
      gmcUpdate: {
        enabled: false
      }
    },
    programmes: {
      enabled: false,
      conditionsOfJoining: {
        enabled: false
      },
      confirmation: {
        enabled: false
      }
    }
  },
  forms: {
    enabled: false,
    formr: {
      enabled: false
    },
    ltft: {
      enabled: false,
      qualifyingProgrammes: []
    }
  },
  notifications: {
    enabled: false
  }
};

export const mockUserFeaturesNonSpecialty: UserFeaturesType = {
  actions: {
    enabled: false
  },
  cct: {
    enabled: false
  },
  details: {
    enabled: true,
    placements: {
      enabled: true
    },
    profile: {
      enabled: true,
      gmcUpdate: {
        enabled: false
      }
    },
    programmes: {
      enabled: true,
      conditionsOfJoining: {
        enabled: false
      },
      confirmation: {
        enabled: false
      }
    }
  },
  forms: {
    enabled: false,
    formr: {
      enabled: false
    },
    ltft: {
      enabled: false,
      qualifyingProgrammes: []
    }
  },
  notifications: {
    enabled: false
  }
};

export const mockUserFeaturesSpecialty: UserFeaturesType = {
  actions: {
    enabled: true
  },
  cct: {
    enabled: true
  },
  details: {
    enabled: true,
    placements: {
      enabled: true
    },
    profile: {
      enabled: true,
      gmcUpdate: {
        enabled: true
      }
    },
    programmes: {
      enabled: true,
      conditionsOfJoining: {
        enabled: true
      },
      confirmation: {
        enabled: true
      }
    }
  },
  forms: {
    enabled: true,
    formr: {
      enabled: true
    },
    ltft: {
      enabled: false, // Pilot-only.
      qualifyingProgrammes: []
    }
  },
  notifications: {
    enabled: true
  }
};

export const mockUserFeaturesLtftPilot: UserFeaturesType = {
  ...mockUserFeaturesSpecialty,
  forms: {
    ...mockUserFeaturesSpecialty.forms,
    ltft: {
      enabled: true,
      qualifyingProgrammes: [
        "93dae29a-fd44-4b59-8779-3e7d3d90b237",
        "d84cb879-8651-4a25-bc08-7b3c2dee06b7",
        "7ab1aae3-83c2-4bb6-b1f3-99146e79b362",
        "b505d0c6-a6ea-44b7-b321-3f463d2d2035"
      ]
    }
  }
};

export const mockUserFeaturesLtftPilotNoProgrammes: UserFeaturesType = {
  ...mockUserFeaturesSpecialty,
  forms: {
    ...mockUserFeaturesSpecialty.forms,
    ltft: {
      enabled: true,
      qualifyingProgrammes: []
    }
  }
};

export const mockProfileDataToTestPlacementActions: TraineeProfile = {
  traineeTisId: "111111",
  personalDetails: {
    surname: "Burke",
    forenames: "Jimmy",
    knownAs: null,
    maidenName: null,
    title: "Dr",
    role: ["DR in Training"],
    personOwner: "North Central and East London",
    dateOfBirth: "1980-04-03",
    gender: "Male",
    qualification: "Bachelor of Medicine, Bachelor of Surgery (BMBS)",
    dateAttained: "2010-05-09",
    medicalSchool: "University of Grimbsy",
    telephoneNumber: "111111111111",
    mobileNumber: "111111111111",
    email: "j_burke@hot.com",
    address1: "Flat 90410",
    address2: "Burke Way",
    address3: "Burketon",
    address4: "Burkeside",
    postCode: "IAM1 2ME",
    gmcNumber: "1111111",
    gmcStatus: null,
    gdcNumber: null,
    gdcStatus: null,
    publicHealthNumber: null,
    eeaResident: null,
    permitToWork: null,
    settled: null,
    visaIssued: null,
    detailsNumber: null,
    prevRevalBody: null,
    prevRevalBodyOther: null,
    currRevalDate: null,
    prevRevalDate: null,
    signature: {
      signedAt: "2025-08-31T15:05:48.231159158Z",
      validUntil: "2025-09-01T15:05:48.231159158Z",
      hmac: "6443c178e2dfed0013eaa6ce193b88f3772c898e8b6dd3eebe04c118a511bc3b"
    }
  },
  qualifications: [
    {
      tisId: "335188",
      qualification: "Bachelor of Medicine, Bachelor of Surgery (BMBS)",
      dateAttained: "2010-05-09",
      medicalSchool: "University of Grimbsy"
    }
  ],
  programmeMemberships: [
    {
      tisId: "e9401242-a0dd-4a1c-9551-7164e5c776d9",
      trainingNumber: "LDN/001.852/7991976/C",
      programmeTisId: "18725",
      programmeName: "General (Internal) Medicine",
      programmeNumber: "LON241",
      managingDeanery: "North Central and East London",
      designatedBody: "NHSE Education North Central and East London",
      designatedBodyCode: "1-1RUZV4H",
      programmeMembershipType: "SUBSTANTIVE",
      startDate: "2025-02-05",
      endDate: "2028-02-01",
      programmeCompletionDate: new Date("2028-02-01"),
      status: Status.Current,
      curricula: [
        {
          curriculumTisId: "168",
          curriculumName: "Stroke Medicine",
          curriculumSubType: "SUB_SPECIALTY",
          curriculumSpecialty: "Stroke Medicine",
          curriculumSpecialtyCode: "852",
          curriculumStartDate: new Date("2025-02-05"),
          curriculumEndDate: new Date("2028-02-01"),
          curriculumMembershipId: "468543"
        },
        {
          curriculumTisId: "75",
          curriculumName: "General (internal) Medicine",
          curriculumSubType: "MEDICAL_CURRICULUM",
          curriculumSpecialty: "General (internal) Medicine",
          curriculumSpecialtyCode: "001",
          curriculumStartDate: new Date("2025-02-05"),
          curriculumEndDate: new Date("2028-02-01"),
          curriculumMembershipId: "455002"
        }
      ],
      trainingPathway: "CCT",
      conditionsOfJoining: {
        signedAt: new Date("2025-05-14T09:10:14.912Z"),
        version: "GG10"
      },
      responsibleOfficer: {
        emailAddress: "billy.sheen@hee.nhs.uk",
        firstName: "Billy",
        lastName: "Sheen",
        gmcId: "111111111",
        phoneNumber: null
      },
      signature: {
        signedAt: "2025-08-31T15:05:48.231671127Z",
        validUntil: "2025-09-01T15:05:48.231671127Z",
        hmac: "be4abce371f3f8964e3bb97050e91a5133d9343df4c1bb373a3c2b67d5937aec"
      }
    }
  ],
  placements: [
    {
      tisId: "2657088",
      startDate: "2025-08-05",
      endDate: "2026-08-05",
      site: "Queen's Hospital",
      siteKnownAs: "Billy's Hospital (4Q)",
      siteLocation: "Burke Way or the High Way",
      otherSites: [],
      grade: "ST4",
      specialty: "General (internal) Medicine",
      subSpecialty: "",
      postAllowsSubspecialty: true,
      otherSpecialties: [],
      placementType: "In Post",
      employingBody: "Billy NHS Trust",
      trainingBody: "Billy NHS Trust",
      wholeTimeEquivalent: "1",
      status: Status.Current,
      signature: {
        signedAt: "2025-08-31T15:05:48.231308620Z",
        validUntil: "2025-09-01T15:05:48.231308620Z",
        hmac: "b09b48a4a8863f59af8e4bc8a43e3d0e961550352fdf18d43c0240f22dabfdf4"
      }
    }
  ]
};
