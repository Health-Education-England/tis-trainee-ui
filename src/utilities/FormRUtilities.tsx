import Section1 from "../components/forms/formr-part-b/sections/Section1";
import Section2 from "../components/forms/formr-part-b/sections/Section2";
import Section3 from "../components/forms/formr-part-b/sections/Section3";
import Section4 from "../components/forms/formr-part-b/sections/Section4";
import Section5 from "../components/forms/formr-part-b/sections/Section5";
import Section6 from "../components/forms/formr-part-b/sections/Section6";
import CovidDeclaration from "../components/forms/formr-part-b/sections/CovidDeclaration";
import { IProgSection } from "../models/IProgressSection";
import { FormRPartA, ProfileSType } from "../models/FormRPartA";
import { LifeCycleState } from "../models/LifeCycleState";
import store from "../redux/store/store";
import {
  loadSavedFormA,
  resetToInitFormA,
  saveFormA,
  updatedFormA,
  updateFormA
} from "../redux/slices/formASlice";
import { loadSavedFormB, updatedFormB } from "../redux/slices/formBSlice";
import FieldWarningMsg from "../components/forms/FieldWarningMsg";
import { ProfileToFormRPartAInitialValues } from "../models/ProfileToFormRPartAInitialValues";
import { TraineeProfile } from "../models/TraineeProfile";
import { ProfileToFormRPartBInitialValues } from "../models/ProfileToFormRPartBInitialValues";
import { DateType, DateUtilities } from "./DateUtilities";
import { formData } from "../components/forms/formr-part-b/viewSections/ViewSectionTestHelper";

export class FormRUtilities {
  public static makeFormRBSections(covidFlag: boolean) {
    if (!covidFlag) return defaultSections;
    else
      return [
        ...defaultSections.slice(0, 6),
        covidSection,
        ...defaultSections.slice(6)
      ];
  }

  public static async saveDraftA(
    draftFormRA: FormRPartA,
    history: any
  ): Promise<void> {
    if (draftFormRA.lifecycleState !== LifeCycleState.Unsubmitted) {
      store.dispatch(
        updatedFormA({
          ...draftFormRA,
          submissionDate: null,
          lifecycleState: LifeCycleState.Draft,
          lastModifiedDate: new Date()
        })
      );
    } else
      store.dispatch(
        updatedFormA({ ...draftFormRA, lastModifiedDate: new Date() })
      );
    const updatedFormAData = store.getState().formA.formAData;
    if (draftFormRA.id) {
      await store.dispatch(updateFormA(updatedFormAData));
    } else await store.dispatch(saveFormA(updatedFormAData));
    const formRAStatus = store.getState().formA.status;
    if (formRAStatus === "succeeded") {
      FormRUtilities.historyPush(history, "/formr-a");
    }
  }

  public static async handleSubmitA(formData: FormRPartA, history: any) {
    store.dispatch(
      updatedFormA({
        ...formData,
        submissionDate: new Date(),
        lifecycleState: LifeCycleState.Submitted,
        lastModifiedDate: new Date()
      })
    );
    const updatedFormAData = store.getState().formA.formAData;
    await store.dispatch(updateFormA(updatedFormAData));
    const formAStatus = store.getState().formA.status;
    if (formAStatus === "succeeded") {
      store.dispatch(resetToInitFormA());
      FormRUtilities.historyPush(history, "/formr-a");
    }
  }

  public static async handleRowClick(
    formId: string,
    path: string,
    history: string[]
  ): Promise<void> {
    if (path === "/formr-a") {
      await store.dispatch(loadSavedFormA(formId));
    } else if (path === "/formr-b") {
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

  public static showFieldMatchWarning(
    field: ProfileSType,
    matcher: RegExp,
    warningMsg: string
  ): JSX.Element | null {
    if (field && field.length > 0 && !matcher.test(field)) {
      return <FieldWarningMsg warningMsg={warningMsg} />;
    }
    return null;
  }

  public static showMsgIfEmpty(
    value: string,
    message: string = "None recorded"
  ) {
    return value ? value : message;
  }

  public static dispaySubmissionDate(date: DateType) {
    const message = (
      <h3>
        {"Form Submitted on: " +
          DateUtilities.ToLocalDate(formData.submissionDate)}
      </h3>
    );

    return message;
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
