import { OnboardingActionStatus } from "../../models/Tracker";
import {
  GroupedTraineeActionsForProgramme,
  TisReferenceType,
  TraineeAction
} from "../../models/TraineeAction";
import { ProgOnboardingTagType } from "../Constants";
import {
  calcTrainingNumStatus,
  getActionStatus
} from "../OnboardingTrackerUtilities";

const createMockTraineeAction = (
  type: string,
  referenceType?: TisReferenceType
): TraineeAction => ({
  id: "test-id",
  type,
  traineeId: "trainee-1",
  tisReferenceInfo: {
    id: "ref-1",
    type: referenceType ?? "PROGRAMME_MEMBERSHIP"
  },
  availableFrom: "2023-01-01",
  dueBy: "2023-02-01",
  completed: null
});

const createMockGroupedActions = (
  actions: TraineeAction[]
): GroupedTraineeActionsForProgramme => ({
  "Programme ID": "prog-1",
  "Programme Membership name": "Test Programme",
  "Outstanding actions": actions
});

describe("getActionStatus", () => {
  it("should return 'not tracked' for an action that is not tracked", () => {
    const actionTag = "CONNECT_RO" as ProgOnboardingTagType;
    const mockGroupedActions = createMockGroupedActions([]);

    const result = getActionStatus(actionTag, mockGroupedActions);

    expect(result).toBe("not tracked");
  });

  it("should call calcTrainingNumStatus when actionTag is TRAINING_NUMBER", () => {
    const mockGroupedActions = createMockGroupedActions([]);
    const mockStatus: OnboardingActionStatus = "completed";

    const result = getActionStatus("TRAINING_NUMBER", mockGroupedActions);

    expect(result).toBe(mockStatus);
  });

  it("should return outstanding for TRAINING_NUMBER when any dependent action is outstanding", () => {
    const mockActions = [createMockTraineeAction("SIGN_COJ")];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = getActionStatus("TRAINING_NUMBER", mockGroupedActions);

    expect(result).toBe("outstanding");
  });

  it("should return outstanding for REVIEW_PLACEMENT when there's an outstanding placement review", () => {
    const mockActions = [createMockTraineeAction("REVIEW_DATA", "PLACEMENT")];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = getActionStatus("REVIEW_PLACEMENT", mockGroupedActions);

    expect(result).toBe("outstanding");
  });

  it("should not return outstanding for REVIEW_PLACEMENT when there's no outstanding placement review", () => {
    const mockActions = [
      createMockTraineeAction("REVIEW_DATA", "PROGRAMME_MEMBERSHIP")
    ];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = getActionStatus("REVIEW_PLACEMENT", mockGroupedActions);

    expect(result).toBe("completed");
  });

  it("should return outstanding for REVIEW_PROGRAMME when there's an outstanding programme review", () => {
    const mockActions = [
      createMockTraineeAction("REVIEW_DATA", "PROGRAMME_MEMBERSHIP")
    ];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = getActionStatus("REVIEW_PROGRAMME", mockGroupedActions);

    expect(result).toBe("outstanding");
  });

  it("should not return outstanding for REVIEW_PROGRAMME when there's no outstanding programme review", () => {
    const mockActions = [createMockTraineeAction("REVIEW_DATA", "PLACEMENT")];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = getActionStatus("REVIEW_PROGRAMME", mockGroupedActions);

    expect(result).toBe("completed");
  });

  it("should return outstanding when a regular action (e.g. CoJ) is outstanding", () => {
    const actionTag = "SIGN_COJ" as ProgOnboardingTagType;
    const mockActions = [createMockTraineeAction("SIGN_COJ")];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = getActionStatus(actionTag, mockGroupedActions);

    expect(result).toBe("outstanding");
  });

  it("should return outstanding for REVIEW_PLACEMENT with multiple actions including the relevant one", () => {
    const mockActions = [
      createMockTraineeAction("OTHER_ACTION"),
      createMockTraineeAction("REVIEW_DATA", "PLACEMENT"),
      createMockTraineeAction("ANOTHER_ACTION")
    ];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = getActionStatus("REVIEW_PLACEMENT", mockGroupedActions);

    expect(result).toBe("outstanding");
  });

  it("should return outstanding for REVIEW_PROGRAMME with multiple actions including the relevant one", () => {
    const mockActions = [
      createMockTraineeAction("OTHER_ACTION"),
      createMockTraineeAction("REVIEW_DATA", "PROGRAMME_MEMBERSHIP"),
      createMockTraineeAction("ANOTHER_ACTION")
    ];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = getActionStatus("REVIEW_PROGRAMME", mockGroupedActions);

    expect(result).toBe("outstanding");
  });
});

describe("calcTrainingNumStatus", () => {
  it("should return completed overallStatus when no dependent actions are outstanding", () => {
    const mockGroupedActions = createMockGroupedActions([]);

    const result = calcTrainingNumStatus(mockGroupedActions);

    expect(result.overallStatus).toBe("completed");
    expect(result.details).toEqual({
      SIGN_COJ: "completed",
      SIGN_FORM_R_PART_A: "completed",
      SIGN_FORM_R_PART_B: "completed"
    });
  });

  it("should return outstanding overallStatus when any dependent action is outstanding", () => {
    const mockActions = [createMockTraineeAction("SIGN_COJ")];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = calcTrainingNumStatus(mockGroupedActions);

    expect(result.overallStatus).toBe("outstanding");
    expect(result.details).toEqual({
      SIGN_COJ: "outstanding",
      SIGN_FORM_R_PART_A: "completed",
      SIGN_FORM_R_PART_B: "completed"
    });
  });

  it("should return outstanding for all dependent actions when all are outstanding", () => {
    const mockActions = [
      createMockTraineeAction("SIGN_COJ"),
      createMockTraineeAction("SIGN_FORM_R_PART_A"),
      createMockTraineeAction("SIGN_FORM_R_PART_B")
    ];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = calcTrainingNumStatus(mockGroupedActions);

    expect(result.overallStatus).toBe("outstanding");
    expect(result.details).toEqual({
      SIGN_COJ: "outstanding",
      SIGN_FORM_R_PART_A: "outstanding",
      SIGN_FORM_R_PART_B: "outstanding"
    });
  });

  it("should handle partial outstanding actions correctly", () => {
    const mockActions = [
      createMockTraineeAction("SIGN_COJ"),
      createMockTraineeAction("SIGN_FORM_R_PART_A")
    ];
    const mockGroupedActions = createMockGroupedActions(mockActions);

    const result = calcTrainingNumStatus(mockGroupedActions);

    expect(result.overallStatus).toBe("outstanding");
    expect(result.details).toEqual({
      SIGN_COJ: "outstanding",
      SIGN_FORM_R_PART_A: "outstanding",
      SIGN_FORM_R_PART_B: "completed"
    });
  });
});
