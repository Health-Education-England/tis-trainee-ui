import { Signature } from "./Dsp";
import { Status } from "./Status";
import { IDateBoxed } from "./IDateBoxed";

export interface ProgrammeMembership extends IDateBoxed {
  tisId?: string;
  programmeTisId?: string;
  programmeName: string;
  programmeNumber: string;
  trainingNumber: string | null;
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
