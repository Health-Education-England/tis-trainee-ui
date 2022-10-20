import { DateType } from "../utilities/DateUtilities";
import { Status } from "./Status";

export interface ProgrammeMembership {
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
  hasSignedCoj?: boolean;
  signedCojDate?: DateType;
  signedCojVersion?: string | null;
}

export interface Curriculum {
  curriculumTisId: string;
  curriculumName: string;
  curriculumSubType: string;
  curriculumStartDate: Date;
  curriculumEndDate: Date;
}
