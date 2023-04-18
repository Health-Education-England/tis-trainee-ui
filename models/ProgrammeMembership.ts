import { Signature } from "./Dsp";
import { Status } from "./Status";

export interface ProgrammeMembership {
  tisId?: string;
  programmeTisId?: string;
  programmeName: string;
  programmeNumber: string;
  startDate: Date | string;
  endDate: Date | string;
  managingDeanery: string;
  programmeMembershipType?: string;
  status?: Status;
  programmeCompletionDate?: Date;
  curricula: Curriculum[];
  conditionsOfJoining: ConditionsOfJoining;
  signature?: Signature;
}

export interface ConditionsOfJoining {
  signedAt: Date | null;
  version: string;
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
  curricula: [],
  conditionsOfJoining: {
    signedAt: null,
    version: ""
  }
};
