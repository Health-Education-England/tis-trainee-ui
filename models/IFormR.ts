import { LifeCycleState } from "./LifeCycleState";
import { DateType } from "../utilities/DateUtilities";
export interface IFormR {
  id?: string;
  submissionDate?: DateType;
  lastModifiedDate: DateType;
  lifecycleState: LifeCycleState;
  programmeMembershipId?: string | null;
  programmeName?: string | null;
}
