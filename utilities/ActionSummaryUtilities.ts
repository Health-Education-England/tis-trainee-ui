import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { LifeCycleState } from "../models/LifeCycleState";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { DateType } from "./DateUtilities";
import { IFormR } from "../models/IFormR";
dayjs.extend(isBetween);

export type OutstandingSummaryActions = {
  unsignedCojCount: number;
};

// OUTSTANDING (and Global Alert)
export function getAllOutstandingSummaryActions(
  unsignedCojs: ProgrammeMembership[]
): OutstandingSummaryActions {
  const unsignedCojCount = unsignedCojs.length;
  return {
    unsignedCojCount
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
  const { noSubFormRA, noSubFormRB } = noSubFormR(formListA, formListB);

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
      isForInfoMoreThanYearSubForm: false,
      latestSubDateForm: null
    };
  }

  const latestSubDateForm = getLatestSubDate(formList);

  const isForInfoWithinYearSubForm =
    latestSubDateForm &&
    isLatestSubmissionDateWithinLastYear(latestSubDateForm);

  const isForInfoMoreThanYearSubForm =
    latestSubDateForm && isLatestSubmissionDateMoreThanYear(latestSubDateForm);

  return {
    isForInfoWithinYearSubForm,
    isForInfoMoreThanYearSubForm,
    latestSubDateForm
  };
}

export function filterSubmittedFormList(formList: IFormR[]) {
  return formList.filter(
    form => form.lifecycleState === LifeCycleState.Submitted
  );
}

function isAnyFormInProgress(formList: IFormR[]): boolean {
  return (
    formList.filter(form => form.lifecycleState !== LifeCycleState.Submitted)
      .length > 0
  );
}

function noSubFormR(formListA: IFormR[], formListB: IFormR[]) {
  const filteredSumittedFormListA = filterSubmittedFormList(formListA);
  const filteredSumittedFormListB = filterSubmittedFormList(formListB);
  const noSubFormRA = filteredSumittedFormListA.length < 1;
  const noSubFormRB = filteredSumittedFormListB.length < 1;
  return { noSubFormRA, noSubFormRB };
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
  return (
    lastSubDate.isAfter(oneYearAgo) &&
    (lastSubDate.isBefore(today) || lastSubDate.isSame(today))
  );
}

export function isLatestSubmissionDateMoreThanYear(subDate: DateType) {
  const lastSubDate = dayjs(subDate);
  const today = dayjs();
  const oneYearAgo = today.subtract(1, "year");
  return lastSubDate.isBefore(oneYearAgo);
}
