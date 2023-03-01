import { Signature } from "./Dsp";
import { Status } from "./Status";

export interface ProgrammeMembership {
  tisId?: string;
  programmeName: string;
  programmeNumber: string;
  startDate: Date | string;
  endDate: Date | string;
  managingDeanery: string;
  programmeMembershipType?: string;
  status?: Status;
  programmeCompletionDate?: Date;
  curricula: Curriculum[];
  signature?: Signature;
}

export interface Curriculum {
  curriculumTisId: string;
  curriculumName: string;
  curriculumSubType: string;
  curriculumStartDate: Date;
  curriculumEndDate: Date;
}

export const programmePanelTemplate: ProgrammeMembership = {
  tisId: "",
  programmeName: "",
  programmeNumber: "",
  startDate: "",
  endDate: "",
  managingDeanery: "",
  curricula: []
};
