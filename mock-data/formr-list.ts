import { LifeCycleState } from "../models/LifeCycleState";
import {
  todayDate,
  dateWithinYear,
  dateExactlyYearAgo,
  dateMoreThanYearAgo
} from "../utilities/DateUtilities";

export const mockForms = [
  {
    id: "3",
    lifecycleState: LifeCycleState.Unsubmitted,
    lastModifiedDate: "2023-05-22T12:50:51.588Z"
  },
  {
    id: "1",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: "2023-05-22",
    lastModifiedDate: "2023-05-22T12:50:51.588Z"
  },
  {
    id: "2",
    lifecycleState: LifeCycleState.Submitted,
    lastModifiedDate: "2023-05-23T12:50:51.588Z"
  },
  {
    id: "4",
    lifecycleState: LifeCycleState.Draft,
    lastModifiedDate: "2023-05-22T12:50:52.589Z"
  }
];

// FOR ACTION SUMMARY
export const mockFormList = [
  {
    id: "4",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: todayDate,
    lastModifiedDate: todayDate
  },
  {
    id: "3",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: dateWithinYear,
    lastModifiedDate: dateWithinYear
  },
  {
    id: "2",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: dateExactlyYearAgo,
    lastModifiedDate: dateExactlyYearAgo
  },
  {
    id: "1",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: dateMoreThanYearAgo,
    lastModifiedDate: dateMoreThanYearAgo
  }
];
