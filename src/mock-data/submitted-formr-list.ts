import { IFormR } from "../models/IFormR";
import { LifeCycleState } from "../models/LifeCycleState";

export const disorderedFormRPartBs: IFormR[] = [
  {
    id: "5e972ec9b9b5781b94eb1270",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: "2012-04-22",
    lastModifiedDate: "2020-05-15"
  },
  {
    id: "6e644647434834getee",
    lifecycleState: LifeCycleState.Draft,
    submissionDate: "2020-04-22",
    lastModifiedDate: "2020-04-15"
  },
  {
    id: "5e972ec9b9b5781b94eb1270",
    lifecycleState: LifeCycleState.Unsubmitted,
    submissionDate: "2015-04-01",
    lastModifiedDate: "2020-04-16"
  }
];

export const orderedFormRPartBs: IFormR[] = [
  {
    id: "6e644647434834getee",
    lifecycleState: LifeCycleState.Draft,
    submissionDate: "2020-04-22",
    lastModifiedDate: "2020-04-15"
  },
  {
    id: "5e972ec9b9b5781b94eb1270",
    lifecycleState: LifeCycleState.Unsubmitted,
    submissionDate: "2015-04-01",
    lastModifiedDate: "2020-04-16"
  },
  {
    id: "5e972ec9b9b5781b94eb1270",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: "2012-04-22",
    lastModifiedDate: "2020-05-15"
  }
];
