import { ProgrammeMembership } from "./ProgrammeMembership";
import { Placement } from "./Placement";
import { PersonalDetails } from "./PersonalDetails";

export interface TraineeProfile {
  traineeTisId: string;
  personalDetails: PersonalDetails | null;
  programmeMemberships: ProgrammeMembership[];
  placements: Placement[];
}
