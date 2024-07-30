import store from "../redux/store/store";
import {
  loadSavedFormA,
  updatedFormA,
  updatedCanEdit
} from "../redux/slices/formASlice";
import {
  loadSavedFormB,
  updatedCanEditB,
  updatedFormB
} from "../redux/slices/formBSlice";
import { ProfileToFormRPartAInitialValues } from "../models/ProfileToFormRPartAInitialValues";
import { TraineeProfile } from "../models/TraineeProfile";
import { ProfileToFormRPartBInitialValues } from "../models/ProfileToFormRPartBInitialValues";
import { DateType, DateUtilities, isWithinRange } from "./DateUtilities";
import { Label } from "nhsuk-react-components";
import dayjs from "dayjs";
import { LinkedFormRDataType } from "../components/forms/form-linker/FormLinkerForm";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
export class FormRUtilities {
  public static async handleRowClick(
    id: string,
    path: string,
    history: string[]
  ): Promise<void> {
    if (path === "/formr-a") {
      store.dispatch(updatedCanEdit(false));
      await store.dispatch(loadSavedFormA({ id }));
    } else if (path === "/formr-b") {
      store.dispatch(updatedCanEditB(false));
      await store.dispatch(loadSavedFormB({ id }));
    }
    FormRUtilities.historyPush(history, path, id);
  }

  public static historyPush(history: any, path: string, id?: string): void {
    id ? history.push(`${path}/${id}`) : history.push(path);
  }

  public static windowPrint(): void {
    window.print();
  }

  public static showMsgIfEmpty(
    value: string,
    message: string = "None recorded"
  ) {
    return value.length > 0 ? value : message;
  }

  public static displaySubmissionDate(date: DateType, cyTag: string) {
    return (
      <Label data-cy={cyTag}>
        Form submitted on: {DateUtilities.ConvertToLondonTime(date)}
      </Label>
    );
  }

  public static loadNewForm(
    pathName: string,
    history: any,
    traineeProfileData: TraineeProfile,
    linkedFormRData: LinkedFormRDataType
  ) {
    if (pathName === "/formr-a") {
      const formAInitialValues = ProfileToFormRPartAInitialValues(
        traineeProfileData,
        linkedFormRData
      );
      store.dispatch(updatedFormA(formAInitialValues));
    } else if (pathName === "/formr-b") {
      const formBInitialValues = ProfileToFormRPartBInitialValues(
        traineeProfileData,
        linkedFormRData
      );
      store.dispatch(updatedFormB(formBInitialValues));
    }
    history.push(`${pathName}/create`);
  }
}

// form r linker utils

export type FormStatusType = "new" | "preSub";

export function makeWarningText(
  formStatus: FormStatusType,
  latestSubDate?: DateType
) {
  if (formStatus === "preSub") {
    return "Please check if this form is correctly linked before submission, and please think carefully before submitting as the current process for deleting or re-submitting a form isn't straightforward.";
  }
  if (formStatus === "new" && isWithinRange(latestSubDate, 31, "d")) {
    return `You recently submitted a form on ${dayjs(latestSubDate).format(
      "DD/MM/YYYY"
    )}. Are you sure you want to submit another?`;
  }
  return null;
}

export function filterProgrammesForLinker(
  programmes: ProgrammeMembership[],
  isArcp: boolean
) {
  const now = dayjs().startOf("day");
  const nextYear = dayjs(now).add(1, "year").startOf("day");
  const lastYear = dayjs(now).subtract(1, "year").startOf("day");

  return programmes.filter(programme => {
    const startDate = dayjs(programme.startDate).startOf("day");
    const endDate = dayjs(programme.endDate).startOf("day");
    const currentProgramme = startDate <= now && endDate >= now;
    const programmeStartsInNextYear = startDate <= nextYear && startDate >= now;
    const programmeEndsInLastYear = endDate >= lastYear && endDate <= now;
    return (
      currentProgramme ||
      (isArcp ? programmeEndsInLastYear : programmeStartsInNextYear)
    );
  });
}

const selectLinkedProgrammeOptionsSorter = (
  a: ProgrammeMembership,
  b: ProgrammeMembership
) => {
  if (a.programmeName < b.programmeName) return -1;
  if (a.programmeName > b.programmeName) return 1;
  const aDate = new Date(a.startDate).getTime();
  const bDate = new Date(b.startDate).getTime();
  return bDate - aDate;
};

export const sortProgrammesForLinker = (programmes: ProgrammeMembership[]) => {
  return programmes.sort(selectLinkedProgrammeOptionsSorter);
};

export const filterManagingDeanery = (PmId: null | string) =>
  store
    .getState()
    .traineeProfile.traineeProfileData.programmeMemberships.filter(
      prog => prog.tisId === PmId
    )[0]?.managingDeanery;
