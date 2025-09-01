export interface TraineeAction {
  id: string;
  type: string;
  traineeId: string;
  tisReferenceInfo: TisReferenceInfo;
  availableFrom: Date | string;
  dueBy: Date | string;
  completed: Date | null;
}

export interface TisReferenceInfo {
  id: string;
  type: TisReferenceType;
}

export type TisReferenceType = "PROGRAMME_MEMBERSHIP" | "PLACEMENT";
