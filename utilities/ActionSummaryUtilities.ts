import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { LifeCycleState } from "../models/LifeCycleState";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { DateType } from "./DateUtilities";
import { IFormR } from "../models/IFormR";
import { TraineeAction } from "../models/TraineeAction";
dayjs.extend(isBetween);

export type OutstandingSummaryActions = {
  unsignedCojCount: number;
  incompleteActionCount: number;
};

// OUTSTANDING (and Global Alert)
export function getAllOutstandingSummaryActions(
  unsignedCojs: ProgrammeMembership[],
  traineeActionsData: TraineeAction[]
): OutstandingSummaryActions {
  const unsignedCojCount = unsignedCojs.length;
  const incompleteActionCount = traineeActionsData.length;
  return {
    unsignedCojCount,
    incompleteActionCount
  };
}

// IN PROGRESS
export function getAllInProgressSummaryActions(
  formAList: IFormR[],
  formBList: IFormR[]
) {
  const isInProgressFormA = isAnyFormInProgress(formAList);
  const isInProgressFormB = isAnyFormInProgress(formBList);
  return {
    isInProgressFormA,
    isInProgressFormB
  };
}

// info section
export function getAllInfoFormRSubmissionSummaryActions(
  formListA: IFormR[],
  formListB: IFormR[]
) {
  const noSubFormRA = noSubmittedForms(formListA);
  const noSubFormRB = noSubmittedForms(formListB);
  const infoA = getInfoActions(formListA, noSubFormRA);
  const infoB = getInfoActions(formListB, noSubFormRB);
  return {
    noSubFormRA,
    noSubFormRB,
    infoActionsA: infoA,
    infoActionsB: infoB
  };
}

function getInfoActions(formList: IFormR[], noSubFormR: boolean) {
  if (noSubFormR) {
    return {
      isForInfoWithinYearSubForm: false,
      isForInfoYearPlusSubForm: false,
      latestSubDateForm: null
    };
  }

  const latestSubDateForm = getLatestSubDate(formList);

  const isForInfoWithinYearSubForm =
    latestSubDateForm &&
    isLatestSubmissionDateWithinLastYear(latestSubDateForm);

  const isForInfoYearPlusSubForm =
    latestSubDateForm && isLatestSubmissionDateYearPlus(latestSubDateForm);

  return {
    isForInfoWithinYearSubForm,
    isForInfoYearPlusSubForm,
    latestSubDateForm
  };
}

function filterSubmittedFormList(formList: IFormR[]) {
  return formList.filter(
    form => form.lifecycleState === LifeCycleState.Submitted
  );
}

export function noSubmittedForms(formList: IFormR[]) {
  if (!formList || formList.length < 1) {
    return true;
  }
  const filteredSubList = filterSubmittedFormList(formList);
  return filteredSubList.length < 1;
}

function isAnyFormInProgress(formList: IFormR[]): boolean {
  return (
    formList.filter(
      form =>
        form.lifecycleState === LifeCycleState.Draft ||
        form.lifecycleState === LifeCycleState.Unsubmitted
    ).length > 0
  );
}

export function getLatestSubDate(formList: IFormR[]) {
  const subFormList = filterSubmittedFormList(formList);
  const latestSubDateForm = subFormList[0]?.submissionDate;
  return latestSubDateForm;
}

export function isLatestSubmissionDateWithinLastYear(
  lastSubStartDate: DateType
): boolean {
  const lastSubDate = dayjs(lastSubStartDate);
  const today = dayjs();
  const oneYearAgo = today.subtract(1, "year");
  return lastSubDate.isAfter(oneYearAgo);
}

export function isLatestSubmissionDateYearPlus(subDate: DateType) {
  const lastSubDate = dayjs(subDate);
  const today = dayjs();
  const oneYearAgo = today.subtract(1, "year");
  return lastSubDate.isSameOrBefore(oneYearAgo, "day");
}
