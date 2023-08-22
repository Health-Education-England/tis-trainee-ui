import { LifeCycleState } from "../models/LifeCycleState";
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
