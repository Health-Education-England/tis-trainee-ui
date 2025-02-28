import * as Yup from "yup";
import { CombinedReferenceData } from "../models/CombinedReferenceData";
import { FormRPartA } from "../models/FormRPartA";
import { KeyValue } from "../models/KeyValue";
import {
  saveFormA,
  updateFormA,
  deleteFormA,
  loadSavedFormA,
  resetToInitFormA,
  updatedCanEdit,
  updatedEditPageNumber,
  updatedFormA
} from "../redux/slices/formASlice";
import store from "../redux/store/store";
import {
  Field,
  Form,
  FormData,
  MatcherName
} from "../components/forms/form-builder/FormBuilder";
import {
  saveFormB,
  updateFormB,
  deleteFormB,
  loadSavedFormB,
  resetToInitFormB,
  updatedCanEditB,
  updatedEditPageNumberB,
  updatedFormB
} from "../redux/slices/formBSlice";
import { FormRPartB } from "../models/FormRPartB";
import { LifeCycleState } from "../models/LifeCycleState";
import { CurriculumKeyValue } from "../models/CurriculumKeyValue";
import { IFormR } from "../models/IFormR";
import dayjs from "dayjs";
import { LinkedFormRDataType } from "../components/forms/form-linker/FormLinkerForm";
import history from "../components/navigation/history";

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
// Note - Lots of these functions below repeat the same logic for formA and formB - look to combine the form slices into one slice?

export async function loadTheSavedForm(
  pathName: string,
  id: string,
  history: any,
  linkedFormRData?: LinkedFormRDataType
) {
  if (pathName === "/formr-a") {
    await store.dispatch(loadSavedFormA({ id, linkedFormRData }));
  } else {
    await store.dispatch(loadSavedFormB({ id, linkedFormRData }));
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
      history.push(redirectPath);
    }
  } else {
    const formBStatus = store.getState().formB.status;
    if (formBStatus === "succeeded") {
      store.dispatch(resetToInitFormB());
      history.push(redirectPath);
    }
  }
}
const chooseRedirectPath = (formName: string, confirm?: boolean) => {
  if (formName === "formA") {
    return confirm ? "/formr-a/confirm" : "/formr-a";
  } else if (formName === "formB") {
    return confirm ? "/formr-b/confirm" : "/formr-b";
  } else {
    return confirm ? "/ltft/confirm" : "/ltft";
  }
};

export function continueToConfirm(formName: string, formData: FormData) {
  const redirectPath = chooseRedirectPath(formName, true);
  if (formName === "formA") {
    store.dispatch(updatedFormA(formData as FormRPartA));
    store.dispatch(updatedCanEdit(true));
  } else if (formName === "formB") {
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

export async function isFormDeleted(
  formName: string,
  formId: string | undefined,
  formIdFromDraftFormProps: string | undefined
) {
  if (formName === "formr-a") {
    await store.dispatch(
      deleteFormA((formId as string) ?? (formIdFromDraftFormProps as string))
    );
    return store.getState().formA.status === "succeeded";
  } else {
    await store.dispatch(
      deleteFormB((formId as string) ?? (formIdFromDraftFormProps as string))
    );

    return store.getState().formB.status === "succeeded";
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

export type ReturnedWarning = {
  fieldName: string;
  warningMsg: string;
};

export function showFieldMatchWarning(
  inputValue: string,
  matcher: MatcherName,
  warningMsg: string,
  fieldName: string
): ReturnedWarning | null {
  if (matcher === "prevDateTest") {
    const testDate = dayjs().subtract(1, "day");
    const inputDate = dayjs(inputValue);
    if (inputDate.isBefore(testDate)) {
      return { fieldName, warningMsg };
    } else return null;
  } else if (matcher === "postcodeTest")
    if (!/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i.test(inputValue))
      return { fieldName, warningMsg };
  return null;
}

export function setTextFieldWidth(width: number) {
  return width < 20 ? 20 : Math.floor(width / 10) * 10;
}

export function handleKeyDown(
  e: React.KeyboardEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
  >
) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
}

export function handleNumberInput(
  isNumberField: boolean | undefined,
  e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
) {
  if (isNumberField) {
    const input = e.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, "");
  }
}

export function sumFieldValues(formData: FormData, fields: Field[]) {
  return fields.reduce(
    (sum, field) => sum + Number(formData[field.name] || 0),
    0
  );
}

export interface DraftFormProps {
  id?: string;
  lifecycleState: LifeCycleState;
  programmeMembershipId?: string | null;
}

export function setDraftFormProps(forms: IFormR[]): DraftFormProps | null {
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
      lifecycleState: LifeCycleState.Unsubmitted,
      programmeMembershipId: unsubmittedForm.programmeMembershipId
    };
  }

  const draftForm = forms.find(
    form => form.lifecycleState === LifeCycleState.Draft
  );

  if (draftForm) {
    return {
      id: draftForm.id,
      lifecycleState: LifeCycleState.Draft,
      programmeMembershipId: draftForm.programmeMembershipId
    };
  }
  return null;
}
// NOTE: This function sets the hidden form fields to null whilst retaining the precious formData for submission
export function setFormDataForSubmit(
  jsonForm: Form,
  formData: FormRPartA | FormRPartB
): FormRPartA | FormRPartB {
  const preciousFormDataBoth = {
    lifecycleState: LifeCycleState.Submitted,
    lastModifiedDate: new Date(),
    submissionDate: new Date(),
    traineeTisId: formData.traineeTisId as string,
    isArcp: formData.isArcp as boolean,
    programmeMembershipId: formData.programmeMembershipId as string,
    localOfficeName: formData.localOfficeName as string
  };

  // NOTE: Have to account for the seemingly useless isLeadingToCct field in formA
  const myPreciousFormDataFields =
    jsonForm.name === "formB"
      ? preciousFormDataBoth
      : {
          ...preciousFormDataBoth,
          isLeadingToCct: (formData as FormRPartA).isLeadingToCct
        };

  const newFormData = jsonForm.pages.reduce((fd, page) => {
    page.sections.forEach(section => {
      section.fields.forEach(field => {
        if (
          field.visible ||
          (field.parent &&
            field?.visibleIf?.includes((fd as FormData)[field.parent]))
        ) {
          (fd as FormData)[field.name] = (formData as FormData)[field.name];
        } else {
          (fd as FormData)[field.name] = null;
        }
      });
    });
    return fd;
  }, {} as FormRPartA | FormRPartB);

  return { ...newFormData, ...myPreciousFormDataFields };
}

export function prepFormData(
  formData: FormRPartA | FormRPartB,
  isSubmit: boolean,
  jsonForm: Form
) {
  if (isSubmit) {
    return setFormDataForSubmit(jsonForm, formData);
  }
  if (formData.lifecycleState !== LifeCycleState.Unsubmitted) {
    return {
      ...formData,
      submissionDate: null,
      lifecycleState: LifeCycleState.Draft,
      lastModifiedDate: new Date()
    };
  }
  return {
    ...formData,
    lastModifiedDate: new Date()
  };
}

async function updateForm(
  formName: string,
  formData: FormData,
  isAutoSave: boolean,
  isSubmit: boolean
) {
  if (formName === "formA") {
    await store.dispatch(
      updateFormA({
        formData: formData as FormRPartA,
        isAutoSave,
        isSubmit
      })
    );
  } else {
    await store.dispatch(
      updateFormB({
        formData: formData as FormRPartB,
        isAutoSave,
        isSubmit
      })
    );
  }
}

async function saveForm(
  formName: string,
  formData: FormRPartA | FormRPartB,
  isAutoSave: boolean,
  isSubmit: boolean
) {
  if (formName === "formA") {
    await store.dispatch(
      saveFormA({
        formData: formData as FormRPartA,
        isAutoSave,
        isSubmit
      })
    );
  } else {
    await store.dispatch(
      saveFormB({ formData: formData as FormRPartB, isAutoSave, isSubmit })
    );
  }
}

export const getDraftFormId = (
  formData: FormRPartA | FormRPartB,
  formName: string
): string | undefined => {
  if (formName === "formA") {
    return formData?.id ?? store.getState().formA?.newFormId;
  } else {
    return formData?.id ?? store.getState().formB?.newFormId;
  }
};

const getSaveStatus = (formName: string) => {
  if (formName === "formA") {
    return store.getState().formA.saveStatus;
  } else {
    return store.getState().formB.saveStatus;
  }
};

export const handleSaveRedirect = (formName: string, isAutoSave: boolean) => {
  if (!isAutoSave) {
    const autosaveStatus = getSaveStatus(formName);
    if (autosaveStatus === "succeeded") {
      history.push(chooseRedirectPath(formName));
    }
  }
};

export async function saveFormR(
  jsonForm: Form,
  formData: FormRPartA | FormRPartB,
  isAutoSave: boolean,
  isSubmit: boolean
) {
  const formName = jsonForm.name;
  const draftFormId = getDraftFormId(formData, formName);
  const preppedFormData = prepFormData(formData, isSubmit, jsonForm);

  if (draftFormId) {
    await updateForm(
      formName,
      { ...preppedFormData, id: draftFormId },
      isAutoSave,
      isSubmit
    );
    handleSaveRedirect(formName, isAutoSave);
  } else {
    await saveForm(formName, preppedFormData, isAutoSave, isSubmit);
    handleSaveRedirect(formName, isAutoSave);
  }
}

export function createErrorObject(err: {
  inner: { path: string; message: string }[];
}) {
  const newErrors: unknown = {};
  const setNestedValue = (obj: any, path: string, value: string) => {
    const keys = path.split(".");
    const lastKey = keys.pop() as string;
    const lastObj = keys.reduce((obj, key, i) => {
      if (key.includes("[")) {
        const [arrayKey, arrayIndex] = key.split(/[[\]]/).filter(Boolean);
        obj[arrayKey] = obj[arrayKey] || [];
        obj[arrayKey][arrayIndex] = obj[arrayKey][arrayIndex] || {};
        return obj[arrayKey][arrayIndex];
      } else {
        obj[key] = obj[key] || (keys[i + 1]?.includes("[") ? [] : {});
        return obj[key];
      }
    }, obj);
    lastObj[lastKey] = value;
  };

  err.inner.forEach(({ path, message }) => {
    setNestedValue(newErrors, path, message);
  });
  return newErrors;
}

export function validateFields(
  fields: Field[],
  values: FormData,
  validationSchema: any
) {
  let finalValidationSchema = Yup.object().shape({});
  finalValidationSchema = fields.reduce((schema, field) => {
    const fieldSchema = validationSchema.fields[field.name];
    const isVisible = showFormField(field, values);
    if (isVisible) {
      if (field.type === "array" && values[field.name]?.length > 0) {
        const nestedFields = Object.keys(values[field.name][0]).reduce(
          (nestedSchema: { [key: string]: any }, nestedField: string) => {
            nestedSchema[nestedField] =
              fieldSchema.innerType.fields[nestedField];
            return nestedSchema;
          },
          {}
        );
        const nestedSchema = Yup.object().shape(nestedFields);
        schema = schema.shape({
          [field.name]: Yup.array().of(nestedSchema)
        });
      } else if (field.type === "dto") {
        const dtoFields = field.objectFields ?? [];
        const visibleDtoFields = dtoFields.filter(
          dtoField =>
            dtoField.visible ||
            dtoField.visibleIf?.includes(
              values[field.name][dtoField.parent as string]
            )
        );
        const dtoSchema = visibleDtoFields.reduce((dtoSchema, dtoField) => {
          const dtoFieldSchema = fieldSchema.fields[dtoField.name];
          return dtoSchema.shape({
            [dtoField.name]: dtoFieldSchema
          });
        }, Yup.object().shape({}));
        schema = schema.shape({
          [field.name]: dtoSchema
        });
      } else {
        schema = schema.shape({
          [field.name]: fieldSchema
        });
      }
    }
    return schema;
  }, finalValidationSchema);
  return finalValidationSchema.validate(values, { abortEarly: false });
}

export function filteredOptions(optionsKey: string | undefined, options: any) {
  return optionsKey && options?.[optionsKey]?.length > 0
    ? options[optionsKey]
    : [];
}

export function formatFieldName(fieldName: string) {
  let words = fieldName.split(/(?=[A-Z])/);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ");
}

export function showFormField(field: Field, formData: FormData) {
  if (field.visible) return true;
  if (field.visibleIf) {
    if (Array.isArray(formData[field.parent as string])) {
      return formData[field.parent as string].includes(field.visibleIf[0]);
    }
    return field.visibleIf.includes(formData[field.parent as string]);
  }
  return false;
}

// Bug fix to also reset the option to empty string where no match against filtered curriculum data e.g. programmeSpecialty field.
export function isValidOption(
  key: "curriculum" | "localOffice" | "gender",
  option: string | null | undefined,
  refData?: any,
  filteredCurriculumData?: any
): string {
  const searchedArray = refData ? refData[key] : filteredCurriculumData;
  const result = searchedArray?.some(
    (item: { label: string | null | undefined }) => item.label === option
  );
  return result ? (option as string) : "";
}

export const determineCurrentValue = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  selectedOption?: any,
  checkedStatus?: boolean
) => {
  let value: string | boolean = event.currentTarget.value;
  if (value === "Yes") value = true;
  if (value === "No") value = false;
  if (selectedOption) {
    if (Array.isArray(selectedOption)) {
      return selectedOption.map((option: any) => option.value);
    }
    return selectedOption.value;
  } else if (checkedStatus !== undefined) {
    return checkedStatus;
  } else {
    return value;
  }
};

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
    width: "max-content",
    minWidth: "70%",
    maxWidth: "100%"
  })
};
