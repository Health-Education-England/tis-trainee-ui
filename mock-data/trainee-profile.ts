import { PersonalDetails } from "../models/PersonalDetails";
import { TraineeProfile } from "../models/TraineeProfile";
import { Status } from "../models/Status";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { Placement } from "../models/Placement";

export const mockPersonalDetails: PersonalDetails = {
  surname: "Gilliam",
  forenames: "Anthony Mara",
  knownAs: "Ivy",
  maidenName: "N/A",
  title: "Mr",
  personOwner: "Health Education England Thames Valley",
  dateOfBirth: new Date("1911-11-30"),
  gender: "Male",
  qualification: "AKC - Association of King's College",
  dateAttained: new Date("2018-05-30"),
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
  prevRevalDate: new Date("2021-12-31"),
  currRevalDate: new Date("2021-12-31"),
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
    endDate: new Date("2024-01-01"),
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
  },
  {
    startDate: new Date("2023-06-01"),
    endDate: new Date("2024-01-01"),
    programmeCompletionDate: new Date("2021-12-31"),
    tisId: "3",
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
      signedAt: new Date("2023-05-01"),
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
  curricula: []
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
  ]
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
  ]
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

export const mockProgrammeMembershipCojNotSigned: ProgrammeMembership = {
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
};

export const mockPlacements: Placement[] = [
  {
    endDate: new Date("2020-12-31"),
    grade: "ST1",
    tisId: "315",
    placementType: "In Post",
    site: "Addenbrookes Hospital",
    siteLocation: "Site location",
    specialty: "Dermatology",
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
    specialty: "Dermatology",
    startDate: new Date("2020-01-01"),
    status: Status.Current,
    employingBody: "",
    trainingBody: "Carmarthenshire NHS Trust",
    wholeTimeEquivalent: "0.75"
  }
];

export const mockPlacementNonTemplatedField = {
  endDate: new Date("2020-12-31"),
  grade: "ST1",
  tisId: "315",
  placementType: "In Post",
  site: "Addenbrookes Hospital",
  siteLocation: "Site location",
  specialty: "Dermatology",
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
