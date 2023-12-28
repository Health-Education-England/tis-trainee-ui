import Section1 from "../components/forms/formr-part-b/sections/Section1";
import Section2 from "../components/forms/formr-part-b/sections/Section2";
import Section3 from "../components/forms/formr-part-b/sections/Section3";
import Section4 from "../components/forms/formr-part-b/sections/Section4";
import Section5 from "../components/forms/formr-part-b/sections/Section5";
import Section6 from "../components/forms/formr-part-b/sections/Section6";
import CovidDeclaration from "../components/forms/formr-part-b/sections/CovidDeclaration";
import { IProgSection } from "../models/IProgressSection";
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
  public static makeFormRBSections(
    covidFlag: boolean,
    haveCovidDeclarations: boolean | null | string
  ) {
    if (covidFlag || haveCovidDeclarations !== null)
      return [
        ...defaultSections.slice(0, 6),
        covidSection,
        ...defaultSections.slice(6)
      ];
    else return defaultSections;
  }

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

const defaultSections: IProgSection[] = [
  {
    component: Section1,
    title: "Section 1:\nDoctor's details"
  },

  {
    component: Section2,
    title: "Section 2:\nWhole Scope of Practice"
  },

  {
    component: Section3,
    title: "Section 3:\nDeclarations relating to\nGood Medical Practice"
  },
  {
    component: Section4,
    title: "Section 4:\nUpdate to your last\n Form R"
  },
  {
    component: Section5,
    title: "Section 5:\nNew Declarations\nsince your last Form R"
  },
  {
    component: Section6,
    title: "Section 6:\nCompliments"
  }
];

const covidSection: IProgSection = {
  component: CovidDeclaration,
  title: "Covid declaration"
};
