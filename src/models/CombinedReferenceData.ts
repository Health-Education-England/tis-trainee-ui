import { KeyValue } from "./KeyValue";
import { CurriculumKeyValue } from "./CurriculumKeyValue";

export interface Dbc extends KeyValue {
  internal: boolean;
  type: string;
}

export interface Grade extends KeyValue {
  placementGrade: boolean;
  status: any;
  trainingGrade: boolean;
}

export interface CombinedReferenceData {
  gender: KeyValue[];
  college: KeyValue[];
  dbc: Dbc[];
  localOffice: KeyValue[];
  grade: Grade[];
  immigrationStatus: KeyValue[];
  curriculum: CurriculumKeyValue[];
  declarationType: KeyValue[];
  covidChangeCircs: KeyValue[];
}
