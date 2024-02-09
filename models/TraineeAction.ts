export type TisReferenceType = "PLACEMENT" | "PROGRAMME-MEMBERSHIP";

export interface TisReferenceInfo {
  id: string;
  type: TisReferenceType;
}

export interface TraineeAction {
  id: string;
  type: string;  
  traineeTisId: string;
  tisReferenceInfo: TisReferenceInfo;
  due: Date;
  completed: Date | null; 
}
