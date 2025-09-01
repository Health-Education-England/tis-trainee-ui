import { TraineeAction } from "../models/TraineeAction";
import {
  oneWeekAgo,
  today,
  twelveWeeksAhead,
  yesterday
} from "../utilities/DateUtilities";

export const mockIncompleteTraineeActions = [
  {
    id: "6863f1ae17598b0d50fd7aff",
    type: "REVIEW_DATA",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "0460eb0d-2797-4078-ab6f-060b2ae6a18e",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-07-01",
    dueBy: "2025-07-02",
    completed: null
  },
  {
    id: "6863f1ae17598b0d50fd7b01",
    type: "SIGN_FORM_R_PART_A",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "0460eb0d-2797-4078-ab6f-060b2ae6a18e",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-07-01",
    dueBy: "2025-07-02",
    completed: null
  },
  {
    id: "6863f1ae17598b0d50fd7b02",
    type: "SIGN_FORM_R_PART_B",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "0460eb0d-2797-4078-ab6f-060b2ae6a18e",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-07-01",
    dueBy: "2025-07-02",
    completed: null
  },
  {
    id: "6863f1ae17598b0d50fd7b03",
    type: "SIGN_FORM_R_PART_A",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "a6de88b8-de41-48dd-9492-a518f5001176",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-07-01",
    dueBy: "2025-07-02",
    completed: null
  },
  {
    id: "6863f1ae17598b0d50fd7b04",
    type: "SIGN_FORM_R_PART_B",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "a6de88b8-de41-48dd-9492-a518f5001176",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-07-01",
    dueBy: "2025-07-02",
    completed: null
  },
  {
    id: "6863f1ae17598b0d50fd7b05",
    type: "SIGN_COJ",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "a6de88b8-de41-48dd-9492-a518f5001176",
      type: "PROGRAMME_MEMBERSHIP"
    },
    availableFrom: "2025-07-01",
    dueBy: "2025-07-02",
    completed: null
  },
  {
    id: "6863f1ae17598b0d50fd7b06",
    type: "REVIEW_DATA",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "150", // This should match a current placement ID in your profile data
      type: "PLACEMENT"
    },
    availableFrom: "2025-06-01",
    dueBy: "2025-11-15",
    completed: null
  },
  {
    id: "6863f1ae17598b0d50fd7b07",
    type: "REVIEW_DATA",
    traineeId: "47165",
    tisReferenceInfo: {
      id: "2673507", // Another placement ID
      type: "PLACEMENT"
    },
    availableFrom: "2025-06-15",
    dueBy: "2025-07-10",
    completed: null
  }
];

export const mockIncompleteActions2: TraineeAction[] = [
  // Future action (not to show)
  {
    id: "0",
    type: "REVIEW_DATA",
    traineeId: "12345",
    tisReferenceInfo: {
      id: "1",
      type: "PROGRAMME_MEMBERSHIP"
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
  },
  // Action with wrong action type
  {
    id: "action-4",
    type: "DIFFERENT_TYPE",
    traineeId: "123",
    tisReferenceInfo: {
      id: "2657088",
      type: "PLACEMENT"
    },
    availableFrom: "2025-05-06",
    dueBy: "2025-11-04",
    completed: null
  }
];
