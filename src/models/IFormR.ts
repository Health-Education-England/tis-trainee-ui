import { LifeCycleState } from "./LifeCycleState";

type DateType = Date | string | null;

export interface IFormR {
  id?: string;
  submissionDate: DateType;
  lastModifiedDate: DateType;
  lifecycleState: LifeCycleState;
}
