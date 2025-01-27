import * as Yup from "yup";
import { CombinedReferenceData } from "../models/CombinedReferenceData";
import { FormRPartA } from "../models/FormRPartA";
import { KeyValue } from "../models/KeyValue";
import {
  autoSaveFormA,
  autoUpdateFormA,
  deleteFormA,
  loadSavedFormA,
  resetToInitFormA,
  saveFormA,
  updateFormA,
  updatedCanEdit,
  updatedEditPageNumber,
  updatedFormA
} from "../redux/slices/formASlice";
import store from "../redux/store/store";
import {
  Field,
  FieldWarning,
  Form,
  FormData,
  FormName,
  MatcherName
} from "../components/forms/form-builder/FormBuilder";
import {
  autoSaveFormB,
  autoUpdateFormB,
  deleteFormB,
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
import dayjs from "dayjs";
import { LinkedFormRDataType } from "../components/forms/form-linker/FormLinkerForm";

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

// NOTE- First stab at making this a bit more generic for all forms.
type FormActionsAndTypes<T> = {
  [key: string]: {
    update: any;
    save: any;
    state: () => string | undefined;
    type: T;
  };
};

const formActionsAndTypes: FormActionsAndTypes<FormRPartA | FormRPartB> = {
  formA: {
    update: updateFormA,
    save: saveFormA,
    state: () => store.getState().formA?.formData?.id,
    type: {} as FormRPartA
  },
  formB: {
    update: updateFormB,
    save: saveFormB,
    state: () => store.getState().formB?.formData?.id,
    type: {} as FormRPartB
  }
};

export function makeSubObj(
  jsonForm: Form,
  formData: FormData,
  savedId: string | undefined
) {
  const subFields = {
    submissionDate: new Date(),
    lifecycleState: LifeCycleState.Submitted,
    lastModifiedDate: new Date(),
    traineeTisId: formData.traineeTisId
  };
  let newFormData: FormData = {};
  jsonForm.pages.forEach(page => {
    page.sections.forEach(section => {
      section.fields.forEach(field => {
        if (
          field.visible ||
          (field.parent &&
            field?.visibleIf?.includes(newFormData[field.parent]))
        ) {
          newFormData[field.name] = formData[field.name];
        } else newFormData[field.name] = null;
      });
    });
  });
  const formType = jsonForm.name;
  const formTypeObject = formActionsAndTypes[formType].type;
  return savedId
    ? ({ ...newFormData, ...subFields, id: savedId } as typeof formTypeObject)
    : ({ ...newFormData, ...subFields } as typeof formTypeObject);
}

export async function submitForm(
  jsonForm: Form,
  formData: FormData,
  history: any,
  linkedFormRData: LinkedFormRDataType
) {
  const formName = jsonForm.name;
  const lastSavedFormDataId = formActionsAndTypes[formName].state();
  const subObject = {
    ...makeSubObj(jsonForm, formData, lastSavedFormDataId),
    ...linkedFormRData,
    localOfficeName: formData.localOfficeName
  };
  const action = lastSavedFormDataId
    ? formActionsAndTypes[formName].update
    : formActionsAndTypes[formName].save;
  await store.dispatch(action(subObject));
  resetForm(formName, history);
}

export async function saveDraftForm(
  formName: string,
  formData: FormData,
  history: string[]
) {
  const redirectPath = formName === "formA" ? "/formr-a" : "/formr-b";
  const lastSavedFormData =
    formName === "formA"
      ? store.getState().formA?.formData
      : store.getState().formB?.formData;
  let updatedFormData: FormData;
  if (lastSavedFormData.lifecycleState !== LifeCycleState.Unsubmitted) {
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
    lastSavedFormData.id
      ? await store.dispatch(
          updateFormA({
            ...updatedFormData,
            id: lastSavedFormData.id
          } as FormRPartA)
        )
      : await store.dispatch(saveFormA(updatedFormData as FormRPartA));
  } else {
    lastSavedFormData.id
      ? await store.dispatch(
          updateFormB({
            ...updatedFormData,
            id: lastSavedFormData.id
          } as FormRPartB)
        )
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

export function showFieldMatchWarning(
  inputValue: string,
  matcher: MatcherName,
  warningMsg: string,
  fieldName: string
) {
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

export function handleSoftValidationWarningMsgVisibility(
  inputVal: string,
  primaryFormField: Field | undefined,
  fieldName: string,
  setFieldWarning: (warning: FieldWarning) => void
) {
  if (inputVal?.length && primaryFormField?.warning) {
    const matcher = primaryFormField.warning.matcher as MatcherName;
    const msg = primaryFormField.warning.msgText;
    const warning = showFieldMatchWarning(inputVal, matcher, msg, fieldName);
    setFieldWarning(warning as FieldWarning);
  }
}

export function setTextFieldWidth(width: number) {
  return width < 20 ? 20 : Math.floor(width / 10) * 10;
}

export function handleTextFieldWidth(
  event: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLDivElement
  >,
  currentValue: string,
  primaryField: Field | undefined
) {
  if (
    primaryField?.type === "text" &&
    currentValue.length >= 20 &&
    primaryField?.canGrow
  ) {
    const thisFieldWidth = setTextFieldWidth(currentValue?.length);
    event.currentTarget.className = `nhsuk-input nhsuk-input--width-${thisFieldWidth}`;
  }
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

function prepFormData(formData: FormData) {
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
  return updatedFormData;
}

async function updateForm(formData: FormData, formName: string) {
  if (formName === "formA") {
    await store.dispatch(autoUpdateFormA(formData as FormRPartA));
  } else {
    await store.dispatch(autoUpdateFormB(formData as FormRPartB));
  }
}

async function saveForm(formData: FormData, formName: string) {
  if (formName === "formA") {
    await store.dispatch(autoSaveFormA(formData as FormRPartA));
  } else {
    await store.dispatch(autoSaveFormB(formData as FormRPartB));
  }
}

// TODO - needs updating for ltft form
export async function autosaveFormR(
  formName: string,
  formData: FormRPartA | FormRPartB
) {
  const lastSavedFormData =
    formName === "formA"
      ? store.getState().formA?.formData
      : store.getState().formB?.formData;

  // update form data for submission
  const preppedFormData = prepFormData(formData);

  if (lastSavedFormData.id) {
    await updateForm(
      { ...preppedFormData, id: lastSavedFormData.id },
      formName
    );
  } else {
    const linkedDataToSave = {
      isArcp: formData.isArcp,
      programmeMembershipId: formData.programmeMembershipId,
      localOfficeName: formData.localOfficeName
    };
    await saveForm({ ...preppedFormData, ...linkedDataToSave }, formName);
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

export const updateFormData = (
  name: string,
  currentValue: any,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  arrayIndex: number | undefined,
  arrayName: string | undefined,
  dtoName: string | undefined
) => {
  let updatedFormData: FormData = {};
  if (typeof arrayIndex === "number" && arrayName) {
    setFormData((prevFormData: FormData) => {
      const newArray = [...prevFormData[arrayName]];
      newArray[arrayIndex] = {
        ...newArray[arrayIndex],
        [name]: currentValue
      };
      updatedFormData = { ...prevFormData, [arrayName]: newArray };
      return updatedFormData;
    });
  } else if (dtoName) {
    setFormData((prevFormData: FormData) => {
      const dto = prevFormData[dtoName];
      const updatedDto = {
        ...dto,
        [name]: currentValue
      };
      updatedFormData = {
        ...prevFormData,
        [dtoName]: updatedDto
      };
      return updatedFormData;
    });
  } else {
    setFormData((prevFormData: FormData) => {
      updatedFormData = {
        ...prevFormData,
        [name]: currentValue
      };
      return updatedFormData;
    });
  }
};

export const updateTotalField = (
  totalName: string,
  currentPageFields: Field[],
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
  const fieldsToTotal = currentPageFields.filter(
    field => field.contributesToTotal === totalName
  );
  setFormData((prevFormData: FormData) => {
    const total = sumFieldValues(prevFormData, fieldsToTotal);
    return {
      ...prevFormData,
      [totalName]: total
    };
  });
};

export function setFinalFormFields(
  lastSavedFormData: FormData,
  formData: FormData,
  jsonFormName: FormName
) {
  const finalFields = { ...formData };

  if (lastSavedFormData?.id) {
    finalFields.id = lastSavedFormData.id;

    if (jsonFormName === "ltft") {
      finalFields.lastModified = lastSavedFormData.lastModified;
    } else {
      finalFields.lastModifiedDate = lastSavedFormData.lastModifiedDate;
      finalFields.lifecycleState = lastSavedFormData.lifecycleState;
      finalFields.traineeTisId = lastSavedFormData.traineeTisId;
    }
  } else if (jsonFormName !== "ltft") {
    finalFields.traineeTisId = lastSavedFormData.traineeTisId;
  }

  return finalFields;
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
    width: "max-content",
    minWidth: "70%",
    maxWidth: "100%"
  })
};
