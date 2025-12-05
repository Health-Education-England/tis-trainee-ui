import { Status } from "./Status";
import { CojVersionType } from "../redux/slices/userSlice";
import { ProfilePanelDefaults, Signature } from "./TraineeProfile";

export const mockResponsibleOfficer = {
  emailAddress: null,
  firstName: null,
  lastName: null,
  gmcId: null,
  phoneNumber: null
};
export type ProgrammeMembership = ProfilePanelDefaults & {
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
  trainingPathway?: string;
  signature?: Signature;
};

export interface ConditionsOfJoining {
  signedAt: Date | null;
  version: CojVersionType;
}

export interface Curriculum {
  curriculumTisId: string;
  curriculumMembershipId: string;
  curriculumName: string;
  curriculumSpecialty: string;
  curriculumSpecialtyCode: string;
  curriculumSubType: string;
  curriculumStartDate: Date;
  curriculumEndDate: Date;
}

export interface ResponsibleOfficer {
  emailAddress: string | null;
  firstName: string | null;
  lastName: string | null;
  gmcId: string | null;
  phoneNumber: string | null;
}

export const programmePanelTemplate: ProgrammeMembership = {
  tisId: "",
  programmeName: "",
  programmeNumber: "",
  trainingNumber: null,
  startDate: "",
  endDate: "",
  managingDeanery: "",
  responsibleOfficer: mockResponsibleOfficer,
  curricula: [],
  conditionsOfJoining: {
    signedAt: null,
    version: "GG10"
  }
};
