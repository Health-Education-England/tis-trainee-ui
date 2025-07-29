import { LtftObj } from "../redux/slices/ltftSlice";

export const mockLtftDraftList = [
  {
    id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
    name: "",
    programmeMembershipId: "a6de88b8-de41-48dd-9492-a518f5001176",
    status: "DRAFT",
    created: "2025-01-01T14:50:36.941Z",
    lastModified: "2025-01-15T15:50:36.941Z",
    formRef: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b407",
    status: "DRAFT",
    created: "2024-12-15T14:50:36.941Z",
    lastModified: "2024-12-15T15:50:36.941Z",
    formRef: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 2",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "UNSUBMITTED",
    statusReason: "changePercentage",
    statusMessage: "",
    modifiedByRole: "ADMIN",
    created: "2024-10-15T14:50:36.941Z",
    lastModified: "2024-10-15T15:50:36.941Z",
    formRef: "ltft_-1_003"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174002",
    name: "Programme hours reduction 5",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "UNSUBMITTED",
    statusReason: "other",
    statusMessage: "Mock status message with long long long paragraph",
    modifiedByRole: "TRAINEE",
    created: "2024-08-15T14:50:36.941Z",
    lastModified: "2024-08-15T15:50:36.941Z",
    formRef: "ltft_-1_004"
  }
];
export const mockLtftsList1 = [
  {
    id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
    name: "",
    programmeMembershipId: "a6de88b8-de41-48dd-9492-a518f5001176",
    status: "DRAFT",
    created: "2025-01-01T14:50:36.941Z",
    lastModified: "2025-01-15T15:50:36.941Z",
    formRef: "",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Programme hours reduction 1",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b407",
    status: "APPROVED",
    created: "2024-12-15T14:50:36.941Z",
    lastModified: "2024-12-15T15:50:36.941Z",
    formRef: "ltft_-1_002",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 2",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "SUBMITTED",
    created: "2024-10-15T14:50:36.941Z",
    lastModified: "2024-10-15T15:50:36.941Z",
    formRef: "ltft_-1_003",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 3",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "SUBMITTED",
    created: "2024-09-15T14:50:36.941Z",
    lastModified: "2024-09-15T15:50:36.941Z",
    formRef: "ltft_-1_004",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 4",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "WITHDRAWN",
    created: "2024-08-15T14:50:36.941Z",
    lastModified: "2024-08-15T15:50:36.941Z",
    formRef: "ltft_-1_005",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 5",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "REJECTED",
    created: "2024-08-15T14:50:36.941Z",
    lastModified: "2024-08-15T15:50:36.941Z",
    formRef: "ltft_-1_006",
    statusReason: "Rejected Reason",
    statusMessage: "Rejected Message",
    modifiedByRole: ""
  }
];

export const mockLtftDraft0: LtftObj = {
  traineeTisId: "4",
  change: {
    calculationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    cctDate: "2028-04-02",
    type: "LTFT",
    startDate: "2027-01-01",
    wte: 0.8,
    changeId: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb"
  },
  declarations: {
    discussedWithTpd: true,
    informationIsCorrect: null,
    notGuaranteed: null
  },
  tpdName: "",
  tpdEmail: "",
  otherDiscussions: null,
  personalDetails: {
    title: "Mr",
    surname: "Gilliam",
    forenames: "Anthony Mara",
    telephoneNumber: "01632960363",
    mobileNumber: "07465879348",
    email: "email@email.com",
    gmcNumber: "1111111",
    gdcNumber: "",
    publicHealthNumber: "",
    skilledWorkerVisaHolder: null
  },
  programmeMembership: {
    id: "a6de88b8-de41-48dd-9492-a518f5001176",
    name: "Cardiology",
    startDate: "2020-01-01",
    endDate: "2028-01-01",
    wte: 1,
    designatedBodyCode: "WTF3",
    managingDeanery: "North North West"
  },
  reasonsSelected: null,
  reasonsOtherDetail: null,
  supportingInformation: null,
  status: {
    current: {
      state: "DRAFT",
      detail: {
        reason: "",
        message: ""
      },
      modifiedBy: {
        name: "",
        email: "",
        role: ""
      },
      timestamp: "",
      revision: 0
    },
    history: []
  }
};

export const mockLtftDraft1: LtftObj = {
  ...mockLtftDraft0,
  id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
  formRef: "ltft_-1_001",
  name: "My Programme - Hours Reduction",
  declarations: {
    discussedWithTpd: true,
    informationIsCorrect: true,
    notGuaranteed: true
  },
  personalDetails: {
    ...mockLtftDraft0.personalDetails,
    skilledWorkerVisaHolder: false
  }
};

export const mockLtftUnsubmitted0: LtftObj = {
  traineeTisId: "4",
  name: "my Unsubmitted LTFT",
  formRef: "ltft_4_001",
  change: {
    calculationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    cctDate: "2028-04-02",
    type: "LTFT",
    startDate: "2027-01-01",
    wte: 0.8,
    changeId: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb"
  },
  declarations: {
    discussedWithTpd: true,
    informationIsCorrect: null,
    notGuaranteed: null
  },
  tpdName: "",
  tpdEmail: "",
  otherDiscussions: null,
  personalDetails: {
    title: "Mr",
    surname: "Gilliam",
    forenames: "Anthony Mara",
    telephoneNumber: "01632960363",
    mobileNumber: "07465879348",
    email: "email@email.com",
    gmcNumber: "1111111",
    gdcNumber: "",
    publicHealthNumber: "",
    skilledWorkerVisaHolder: null
  },
  programmeMembership: {
    id: "a6de88b8-de41-48dd-9492-a518f5001176",
    name: "Cardiology",
    startDate: "2020-01-01",
    endDate: "2028-01-01",
    wte: 1,
    designatedBodyCode: "WTF3",
    managingDeanery: "North North West"
  },
  reasonsSelected: null,
  reasonsOtherDetail: null,
  supportingInformation: null,
  status: {
    current: {
      state: "UNSUBMITTED",
      detail: {
        reason: "changePercentage",
        message: "status reason message"
      },
      modifiedBy: {
        name: "Admin Name",
        email: "admin@nhs.net",
        role: "ADMIN"
      },
      timestamp: "",
      revision: 0
    },
    history: []
  }
};

export const mockLtftRejected0: LtftObj = {
  traineeTisId: "4",
  name: "my Rejected LTFT",
  formRef: "ltft_5_001",
  change: {
    calculationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    cctDate: "2028-04-02",
    type: "LTFT",
    startDate: "2027-01-01",
    wte: 0.8,
    changeId: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb"
  },
  declarations: {
    discussedWithTpd: true,
    informationIsCorrect: null,
    notGuaranteed: null
  },
  tpdName: "",
  tpdEmail: "",
  otherDiscussions: null,
  personalDetails: {
    title: "Mr",
    surname: "Gilliam",
    forenames: "Anthony Mara",
    telephoneNumber: "01632960363",
    mobileNumber: "07465879348",
    email: "email@email.com",
    gmcNumber: "1111111",
    gdcNumber: "",
    publicHealthNumber: "",
    skilledWorkerVisaHolder: null
  },
  programmeMembership: {
    id: "a6de88b8-de41-48dd-9492-a518f5001176",
    name: "Cardiology",
    startDate: "2020-01-01",
    endDate: "2028-01-01",
    wte: 1,
    designatedBodyCode: "WTF3",
    managingDeanery: "North North West"
  },
  reasonsSelected: null,
  reasonsOtherDetail: null,
  supportingInformation: null,
  status: {
    current: {
      state: "REJECTED",
      detail: {
        reason: "Rejected reason",
        message: "Rejected message"
      },
      modifiedBy: {
        name: "Admin Name",
        email: "admin@nhs.net",
        role: "ADMIN"
      },
      timestamp: "",
      revision: 0
    },
    history: []
  }
};

export const mockLtftDto1 = {
  id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
  name: "My Programme - Hours Reduction",
  change: {
    calculationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    cctDate: "2028-04-02",
    type: "LTFT",
    startDate: "2027-01-01",
    wte: 0.8,
    changeId: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb"
  },
  declarations: mockLtftDraft1.declarations,
  discussions: {
    tpdName: "My tpd name",
    tpdEmail: "my@tpd.email",
    other: []
  },
  personalDetails: {
    ...mockLtftDraft1.personalDetails,
    skilledWorkerVisaHolder: false
  },
  programmeMembership: mockLtftDraft1.programmeMembership,
  reasons: {
    selected: ["Caring responsibilities", "other"],
    otherDetail: "my other reason",
    supportingInformation: "My supporting information"
  },
  status: {
    current: {
      state: mockLtftDraft1.status.current,
      detail: {
        reason: "",
        message: ""
      },
      modifiedBy: {
        name: "",
        email: "",
        role: ""
      },
      timestamp: "",
      revision: 0
    },
    history: []
  },
  created: "2025-01-1T14:50:36.941Z",
  lastModified: "2025-01-15T15:50:36.941Z"
};
