import { Status } from "./Status";
import { IDateBoxed } from "./IDateBoxed";
import { CojVersionType } from "../redux/slices/userSlice";

export interface ProgrammeMembership extends IDateBoxed {
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
  designatedBody?: string;
  designatedBodyCode?: string;
}

export interface ConditionsOfJoining {
  signedAt: Date | null;
  version: CojVersionType;
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
    version: "GG10"
  }
};
