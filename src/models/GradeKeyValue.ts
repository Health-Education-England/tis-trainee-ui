import { KeyValue } from "./KeyValue";

export interface GradeKeyValue extends KeyValue {
  placementGrade?: boolean;
  status?: string | null;
  trainingGrade?: false;
}
