import { Signature } from "./Dsp";
import { Status } from "./Status";

export interface ProgrammeMembership {
  tisId?: string;
  programmeTisId?: string;
  programmeName: string;
  programmeNumber: string;
  trainingNumber: string | null;
  startDate: Date | string;
  endDate: Date | string;
  managingDeanery: string;
  responsibleOfficer?: ResponsibleOfficer;
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

export interface ResponsibleOfficer {
  firstName: string;
  lastName: string;
}

export const programmePanelTemplate: ProgrammeMembership = {
  tisId: "",
  programmeName: "",
  programmeNumber: "",
  trainingNumber: null,
  startDate: "",
  endDate: "",
  managingDeanery: "",
  responsibleOfficer: {
    firstName: "",
    lastName: ""
  },
  curricula: [],
  conditionsOfJoining: {
    signedAt: null,
    version: ""
  }
};
