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
}

export interface Curriculum {
  curriculumTisId: string;
  curriculumName: string;
  curriculumSubType: string;
  curriculumStartDate: Date;
  curriculumEndDate: Date;
}

export const programmePanelTemplate: ProgrammeMembership = {
  programmeName: "",
  programmeNumber: "",
  startDate: "",
  endDate: "",
  managingDeanery: "",
  curricula: []
};
