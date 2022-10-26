import { Status } from "./Status";

export interface ProgrammeMembership {
  tisId: string;
  programmeTisId: string;
  programmeName: string;
  programmeNumber: string;
  managingDeanery: string;
  programmeMembershipType: string;
  status: Status;
  startDate: Date;
  endDate: Date;
  programmeCompletionDate: Date;
  curricula: Curriculum[];
}

export interface Curriculum {
  curriculumTisId: string;
  curriculumName: string;
  curriculumSubType: string;
  curriculumStartDate: Date;
  curriculumEndDate: Date;
}
