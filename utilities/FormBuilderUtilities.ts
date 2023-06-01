import { CombinedReferenceData } from "../models/CombinedReferenceData";
import { FormRPartA } from "../models/FormRPartA";
import { KeyValue } from "../models/KeyValue";
import {
  loadSavedFormA,
  resetToInitFormA,
  saveFormA,
  updateFormA,
  updatedCanEdit,
  updatedEditPageNumber,
  updatedFormA
} from "../redux/slices/formASlice";
import store from "../redux/store/store";
import { FormData } from "../components/forms/form-builder/FormBuilder";
import {
  loadSavedFormB,
  resetToInitFormB,
  saveFormB,
  updateFormB,
  updatedCanEditB,
  updatedEditPageNumberB,
  updatedFormB
} from "../redux/slices/formBSlice";
import { FormRPartB } from "../models/FormRPartB";
import { LifeCycleState } from "../models/LifeCycleState";
import { CurriculumKeyValue } from "../models/CurriculumKeyValue";
import { IFormR } from "../models/IFormR";

export function mapItemToNewFormat(item: KeyValue): {
  value: string;
  label: string;
} {
  return {
    value: item.label,
    label: item.label
  };
}

// ----------------------------------------------------------
// TODO Lots of these functions below repeat the same logic for formA and formB - look to combine the form slices into one slice?

export async function loadTheSavedForm(
  pathName: string,
  id: string,
  history: any
) {
  if (pathName === "/formr-a") {
    await store.dispatch(loadSavedFormA(id));
  } else {
    await store.dispatch(loadSavedFormB(id));
  }
  history.push(`${pathName}/create`);
}

// This is used in FormBuilder to set the initial page value (needed because when reviewing/editing mutli-page form needs to take user to the correct page)
export function getEditPageNumber(formName: string) {
  if (formName === "formA") {
    return store.getState().formA.editPageNumber;
  } else {
    return store.getState().formB.editPageNumber;
  }
}

// This will be used when reviewing a multi-page form to send the user to the correct page to edit
export function setEditPageNumber(formName: string, pageNumber: number) {
  if (formName === "formA") {
    store.dispatch(updatedEditPageNumber(pageNumber));
  } else {
    store.dispatch(updatedEditPageNumberB(pageNumber));
  }
}

export function resetForm(formName: string, history: any) {
  const redirectPath = formName === "formA" ? "/formr-a" : "/formr-b";
  if (formName === "formA") {
    const formAStatus = store.getState().formA.status;
    if (formAStatus === "succeeded") {
      store.dispatch(resetToInitFormA());
      localStorage.removeItem(formName);
      history.push(redirectPath);
    }
  } else {
    const formBStatus = store.getState().formB.status;
    if (formBStatus === "succeeded") {
      store.dispatch(resetToInitFormB());
      localStorage.removeItem(formName);
      history.push(redirectPath);
    }
  }
}

export function resetLocalStorageFormData(formName: string) {
  localStorage.removeItem(formName);
}

export async function submitForm(
  formName: string,
  formData: FormData,
  history: any
) {
  const updatedFormData = {
    ...formData,
    submissionDate: new Date(),
    lifecycleState: LifeCycleState.Submitted,
    lastModifiedDate: new Date()
  };
  if (formName === "formA") {
    formData.id
      ? await store.dispatch(updateFormA(updatedFormData as FormRPartA))
      : await store.dispatch(saveFormA(updatedFormData as FormRPartA));
  } else {
    formData.id
      ? await store.dispatch(updateFormB(updatedFormData as FormRPartB))
      : await store.dispatch(saveFormB(updatedFormData as FormRPartB));
  }
  resetForm(formName, history);
}

export async function saveDraftForm(
  formName: string,
  formData: FormData,
  history: string[]
) {
  const redirectPath = formName === "formA" ? "/formr-a" : "/formr-b";
  let updatedFormData: FormData;
  if (formData.lifecycleState !== LifeCycleState.Unsubmitted) {
    updatedFormData = {
      ...formData,
      submissionDate: null,
      lifecycleState: LifeCycleState.Draft,
      lastModifiedDate: new Date()
    };
  } else {
    updatedFormData = {
      ...formData,
      lastModifiedDate: new Date()
    };
  }
  if (formName === "formA") {
    formData.id
      ? await store.dispatch(updateFormA(updatedFormData as FormRPartA))
      : await store.dispatch(saveFormA(updatedFormData as FormRPartA));
  } else {
    formData.id
      ? await store.dispatch(updateFormB(updatedFormData as FormRPartB))
      : await store.dispatch(saveFormB(updatedFormData as FormRPartB));
  }
  history.push(redirectPath);
}

export function continueToConfirm(
  formName: string,
  formData: FormData,
  history: string[]
) {
  const redirectPath =
    formName === "formA" ? "/formr-a/confirm" : "/formr-b/confirm";
  if (formName === "formA") {
    store.dispatch(updatedFormA(formData as FormRPartA));
    store.dispatch(updatedCanEdit(true));
  } else {
    store.dispatch(updatedFormB(formData as FormRPartB));
    store.dispatch(updatedCanEditB(true));
  }
  history.push(redirectPath);
}

export function handleEditSection(
  pageNum: number,
  formName: string,
  history: any
) {
  const redirectPath =
    formName === "formA" ? "/formr-a/create" : "/formr-b/create";
  if (formName === "formA") {
    store.dispatch(updatedEditPageNumber(pageNum));
  } else {
    store.dispatch(updatedEditPageNumberB(pageNum));
  }
  history.push(redirectPath);
}

export function addLocalFormToStore(formName: string) {
  const localStorageForm = localStorage.getItem(formName);
  if (localStorageForm) {
    const parsedForm = JSON.parse(localStorageForm);
    formName === "formA"
      ? store.dispatch(updatedFormA(parsedForm as FormRPartA))
      : store.dispatch(updatedFormB(parsedForm as FormRPartB));
  }
}
// ----------------------------------------------------------

export function filterCurriculumOptions(
  curriculumOptions: CurriculumKeyValue[] | null,
  curriculumSubType: string | null | undefined
) {
  return curriculumOptions
    ?.filter(c => c?.curriculumSubType === curriculumSubType)
    .map(option => mapItemToNewFormat(option));
}

export function transformReferenceData(
  data: CombinedReferenceData
): CombinedReferenceData {
  const transformedData = {} as CombinedReferenceData;

  Object.keys(data).forEach(key => {
    transformedData[key] = data[key].map(mapItemToNewFormat);
  });

  return transformedData;
}

export function showFieldMatchWarning(
  inputValue: string,
  matcher: RegExp,
  warningMsg: string,
  fieldName: string
) {
  return !matcher.test(inputValue) ? { fieldName, warningMsg } : null;
}

export function toISOIgnoreTimezone(inputDate: Date) {
  if (inputDate?.getFullYear().toString().length === 4) {
    const newDate = new Date(
      `${inputDate.getFullYear()}-${("0" + (inputDate.getMonth() + 1)).slice(
        -2
      )}-${("0" + inputDate.getDate()).slice(-2)}T00:00:00.000Z`
    );
    return newDate;
  }
  return inputDate;
}

export function setTextFieldWidth(width: number) {
  return width < 20 ? 20 : Math.floor(width / 10) * 10;
}

export function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
}

export interface DraftFormProps {
  id?: string;
  lifecycleState: LifeCycleState;
}

// TODO - Revert when trainee forms DTO has lastModifiedDate
export function getDraftFormProps(forms: IFormR[]): DraftFormProps | null {
  if (
    forms.length === 0 ||
    forms.every(form => form.lifecycleState === LifeCycleState.Submitted)
  )
    return null;

  const unsubmittedForm = forms.find(
    form => form.lifecycleState === LifeCycleState.Unsubmitted
  );
  if (unsubmittedForm) {
    return {
      id: unsubmittedForm.id,
      lifecycleState: LifeCycleState.Unsubmitted
    };
  }

  const draftForm = forms.find(
    form => form.lifecycleState === LifeCycleState.Draft
  );

  if (draftForm) {
    return {
      id: draftForm.id,
      lifecycleState: LifeCycleState.Draft
    };
  }
  return null;
}

// react-select styles
export const colourStyles = {
  option: (baseStyles: any, { isFocused }: any) => ({
    ...baseStyles,
    background: isFocused ? "#2884FF" : "none",
    color: isFocused ? "white" : undefined,
    zIndex: 1,
    fontSize: "1rem",
    "@media (min-width: 40.0625em)": {
      ...baseStyles["@media (min-width: 40.0625em)"],
      fontSize: "1.1875rem"
    },
    paddingTop: "1px",
    paddingBottom: "1px"
  }),
  control: (baseStyles: any, { isFocused }: any) => ({
    ...baseStyles,
    border: "0.0625rem solid #4C6272",
    borderColor: "#4C6272",
    "&:hover": {
      borderColor: "#4C6272"
    },
    boxShadow: isFocused ? "inset 0 0 0 2px" : "none",
    outline: isFocused ? "4px solid #ffeb3b" : "1px solid #4c6272"
  }),
  singleValue: (baseStyles: any) => ({
    ...baseStyles,
    fontSize: "1rem",
    "@media (min-width: 40.0625em)": {
      ...baseStyles["@media (min-width: 40.0625em)"],
      fontSize: "1.1875rem"
    }
  }),
  dropdownIndicator: (baseStyles: any) => ({
    ...baseStyles,
    padding: "0 2px 0 2px",
    width: "1.125rem",
    color: "#212b32"
  }),
  clearIndicator: (baseStyles: any) => ({
    ...baseStyles,
    padding: "0 2px 0 0",
    width: "1.125rem",
    color: "#212b32"
  }),
  container: (baseStyles: any) => ({
    ...baseStyles,
    maxWidth: "100%",
    "@media (min-width: 40.0625em)": {
      ...baseStyles["@media (min-width: 40.0625em)"],
      maxWidth: "52%"
    }
  })
};
