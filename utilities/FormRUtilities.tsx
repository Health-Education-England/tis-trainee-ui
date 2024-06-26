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
import { DateType, DateUtilities } from "./DateUtilities";
import { Label } from "nhsuk-react-components";

export class FormRUtilities {
  public static async handleRowClick(
    formId: string,
    path: string,
    history: string[]
  ): Promise<void> {
    if (path === "/formr-a") {
      store.dispatch(updatedCanEdit(false));
      await store.dispatch(loadSavedFormA(formId));
    } else if (path === "/formr-b") {
      store.dispatch(updatedCanEditB(false));
      await store.dispatch(loadSavedFormB(formId));
    }
    FormRUtilities.historyPush(history, path, formId);
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
    traineeProfileData: TraineeProfile
  ) {
    if (pathName === "/formr-a") {
      const formAInitialValues =
        ProfileToFormRPartAInitialValues(traineeProfileData);
      store.dispatch(updatedFormA(formAInitialValues));
    } else if (pathName === "/formr-b") {
      const formBInitialValues =
        ProfileToFormRPartBInitialValues(traineeProfileData);
      store.dispatch(updatedFormB(formBInitialValues));
    }
    history.push(`${pathName}/create`);
  }
}
