import dayjs from "dayjs";

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

export const mockActionsTestData = [
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
