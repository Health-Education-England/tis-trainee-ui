import { KeyValue } from "./KeyValue";
import { CurriculumKeyValue } from "./CurriculumKeyValue";
import { DesignatedBodyKeyValue } from "./DesignatedBodyKeyValue";
import { GradeKeyValue } from "./GradeKeyValue";

export interface CombinedReferenceData {
  gender: KeyValue[];
  college: KeyValue[];
  dbc: DesignatedBodyKeyValue[];
  localOffice: KeyValue[];
  grade: GradeKeyValue[];
  immigrationStatus: KeyValue[];
  curriculum: CurriculumKeyValue[];
  declarationType: KeyValue[];
  covidChangeCircs: KeyValue[];
}
