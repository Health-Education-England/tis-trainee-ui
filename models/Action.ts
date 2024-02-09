export interface Action {
  id: string;
  type: string;
  traineeTisId: string;
  tisReferenceInfo: TisReferenceInfo;
  availableFrom: Date;
  dueBy: Date;
  completed?: Date;
}

export interface TisReferenceInfo {
  id: string;
  type: TisReferenceType;
}

export enum TisReferenceType {
  programmeMembership = "PROGRAMME_MEMBERSHIP",
  placement = "PLACEMENT"
}
