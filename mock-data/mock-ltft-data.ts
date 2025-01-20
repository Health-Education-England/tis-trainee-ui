export const mockLtftsList1 = [
  {
    id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
    name: "GP hours reduction",
    programmeMembershipId: "a6de88b8-de41-48dd-9492-a518f5001176",
    status: "DRAFT",
    created: "2025-01-15T14:50:36.941Z",
    lastModified: "2025-01-15T15:50:36.941Z"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "My last Programme hours reduction",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b407",
    status: "SUBMITTED",
    created: "2024-12-15T14:50:36.941Z",
    lastModified: "2024-12-15T15:50:36.941Z"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "My first Programme hours reduction",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "REJECTED",
    created: "2024-10-15T14:50:36.941Z",
    lastModified: "2024-10-15T15:50:36.941Z"
  }
];

export const mockLtftDraft0 = {
  id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
  name: "My Programme - Hours Reduction",
  change: {
    calculationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    cctDate: "2028-11-23",
    id: "b2f8df7b-82f6-413f-8265-35a008d6b53b",
    type: "LTFT",
    startDate: "2025-12-01",
    wte: 1
  },
  declarations: {
    discussedWithTpd: true
  },
  discussions: [],
  personalDetails: {
    id: "4",
    title: "Mr",
    forenames: "Anthony",
    surname: "Gilliam",
    telephoneNumber: "0161 4960000",
    mobileNumber: "07700 900000",
    email: "anthony.gilliam@example.com",
    gmcNumber: "6621443",
    gdcNumber: "D592359",
    skilledWorkerVisaHolder: true
  },
  programmeMembership: {
    id: "a6de88b8-de41-48dd-9492-a518f5001176",
    name: "General Practice",
    startDate: "2020-01-01",
    endDate: "2028-01-01",
    wte: 1
  },
  reasons: ["Caring Responsibilities", "Custom Reason"],
  status: {
    current: "DRAFT",
    history: [
      {
        status: "DRAFT",
        timestamp: "2025-01-15T15:06:06.560Z"
      }
    ]
  },
  created: "2025-01-15T15:06:06.560Z",
  lastModified: "2025-01-15T15:06:06.560Z"
};
