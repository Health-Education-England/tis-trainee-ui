import { KeyValue } from "./KeyValue";

export interface CurriculumKeyValue extends KeyValue {
  curriculumSubType?: string | null;
  status?: string | null;
}
