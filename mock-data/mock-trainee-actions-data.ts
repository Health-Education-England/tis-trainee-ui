import dayjs from "dayjs";
import { TraineeAction } from "../models/TraineeAction";

export const emptyActionsData = {
  groupedOutstandingActions: []
};

export const unknownActionTypeData = {
  groupedOutstandingActions: [
    {
      "Programme ID": "1",
      "Programme Membership name": "Test Programme",
      "Outstanding actions": [
        {
          id: "123",
          type: "UNKNOWN_TYPE",
          availableFrom: "2025-01-01",
          tisReferenceInfo: { id: "456", type: "UNKNOWN" }
        }
      ]
    }
  ]
};

export const multiplePmActionTypeData = {
  groupedOutstandingActions: [
    {
      "Programme ID": "1",
      "Programme Membership name": "First Programme",
      "Outstanding actions": [
        {
          id: "123",
          type: "SIGN_FORM_R_PART_A",
          availableFrom: dayjs().subtract(3, "month"),
          dueBy: dayjs().add(1, "month"),
          tisReferenceInfo: { id: "456", type: "FORM_R" }
        },
        {
          id: "124",
          type: "SIGN_COJ",
          availableFrom: dayjs().subtract(2, "month"),
          dueBy: dayjs().add(2, "month"),
          tisReferenceInfo: { id: "456", type: "COJ" }
        },
        {
          id: "125",
          type: "SIGN_FORM_R_PART_B",
          availableFrom: dayjs().subtract(3, "month"),
          dueBy: dayjs().add(2, "week"),
          tisReferenceInfo: { id: "456", type: "FORM_R" }
        },
        {
          id: "126",
          type: "REVIEW_DATA",
          availableFrom: dayjs().subtract(1, "month"),
          dueBy: dayjs().add(3, "month"),
          tisReferenceInfo: { id: "456", type: "PROGRAMME_MEMBERSHIP" }
        },
        {
          id: "127",
          type: "REVIEW_DATA",
          availableFrom: dayjs().subtract(2, "week"),
          dueBy: dayjs().add(1, "week"),
          tisReferenceInfo: { id: "456", type: "PLACEMENT" }
        }
      ]
    },
    {
      "Programme ID": "2",
      "Programme Membership name": "Second Programme",
      "Outstanding actions": [
        {
          id: "789",
          type: "SIGN_FORM_R_PART_B",
          availableFrom: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
          dueBy: dayjs().add(3, "month").format("YYYY-MM-DD"),
          tisReferenceInfo: { id: "012", type: "FORM_R" }
        },
        {
          id: "790",
          type: "REVIEW_DATA",
          availableFrom: dayjs().subtract(2, "month").format("YYYY-MM-DD"),
          dueBy: dayjs().add(2, "week").format("YYYY-MM-DD"),
          tisReferenceInfo: { id: "456", type: "PROGRAMME_MEMBERSHIP" }
        }
      ]
    }
  ]
};

export const mockActionsTestData: TraineeAction[] = [
  {
    id: "action-1",
    type: "REVIEW_DATA",
    traineeId: "123",
    tisReferenceInfo: {
      id: "2657088", // match placement id in mockProfileDataToTestPlacementActions
      type: "PLACEMENT"
    },
    availableFrom: "2025-05-06",
    dueBy: "2025-11-04",
    completed: null
  },
  // Action with non-matching placement ID
  {
    id: "action-2",
    type: "REVIEW_DATA",
    traineeId: "123",
    tisReferenceInfo: {
      id: "non-existent-id",
      type: "PLACEMENT"
    },
    availableFrom: "2025-05-06",
    dueBy: "2025-11-04",
    completed: null
  },
  // Action with wrong reference type
  {
    id: "action-3",
    type: "REVIEW_DATA",
    traineeId: "123",
    tisReferenceInfo: {
      id: "2657088",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-05-06",
    dueBy: "2025-11-04",
    completed: null
  }
];

export const mockActionsTestData2: TraineeAction[] = [
  {
    id: "67a0d0a6a4e9c627ff903537",
    type: "REVIEW_DATA",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "2657088",
      type: "PLACEMENT"
    },
    availableFrom: "2024-11-13",
    dueBy: "2025-02-05",
    completed: null
  },
  {
    id: "687574876925e42d15ee5a5c",
    type: "SIGN_FORM_R_PART_A",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "e9401242-a0dd-4a1c-9551-7164e5c776d9",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-07-14",
    dueBy: "2025-02-05",
    completed: null
  },
  {
    id: "687574876925e42d15ee5a5d",
    type: "SIGN_FORM_R_PART_B",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "e9401242-a0dd-4a1c-9551-7164e5c776d9",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-07-14",
    dueBy: "2025-02-05",
    completed: null
  },
  {
    id: "68407a67c5619027efb58e39",
    type: "REVIEW_DATA",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "e9401242-a0dd-4a1c-9551-7164e5c776d9",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-06-04",
    dueBy: "2025-02-05",
    completed: null
  },
  {
    id: "67d7e8ab047210168bef4606",
    type: "REVIEW_DATA",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "1", // Used in OnboardingTracker.cy.tsx to show outstanding action
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-03-17",
    dueBy: "2025-02-05",
    completed: null
  },
  {
    id: "6841da9bc5619027efb61940",
    type: "REVIEW_DATA",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "2673509",
      type: "PLACEMENT"
    },
    availableFrom: "2025-05-14",
    dueBy: "2025-08-06",
    completed: null
  }
];
