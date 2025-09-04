import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { LifeCycleState } from "../models/LifeCycleState";
import { DateType } from "./DateUtilities";
import { IFormR } from "../models/IFormR";
dayjs.extend(isBetween);

// keep using this logic for TrainingNumber temporarily until https://hee-tis.atlassian.net/browse/TIS21-7721
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
