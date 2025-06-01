import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from "react";
import { Field, Form, FormData, ReturnedWidthData } from "./FormBuilder";
import {
  determineCurrentValue,
  ReturnedWarning,
  setTextFieldWidth,
  showFieldMatchWarning,
  sumFieldValues,
  validateFields,
  createErrorObject,
  getEditPageNumber,
  continueToConfirm,
  saveDraftForm,
  FormDataType
} from "../../../utilities/FormBuilderUtilities";
import useFormAutosave from "../../../utilities/hooks/useFormAutosave";
import { FormRPartA } from "../../../models/FormRPartA";
import { FormRPartB } from "../../../models/FormRPartB";
import { LtftObj } from "../../../redux/slices/ltftSlice";
import { useCanEditStatus } from "../../../utilities/hooks/useCanEditStatus";

type FormContextType = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleChange: (
    event: any,
    selectedOption?: any,
    checkedStatus?: boolean,
    arrayIndex?: number,
    arrayName?: string,
    dtoName?: string
  ) => void;
  handleBlur: (
    event: React.FocusEvent<HTMLInputElement>,
    selectedOption?: any,
    checkedStatus?: boolean,
    arrayIndex?: number,
    arrayName?: string,
    dtoName?: string
  ) => void;
  isFormDirty: boolean;
  setIsFormDirty: React.Dispatch<React.SetStateAction<boolean>>;

  setCurrentPageFields: React.Dispatch<React.SetStateAction<Field[]>>;
  jsonForm: Form;
  fieldWarning: ReturnedWarning | null;
  setFieldWarning: React.Dispatch<React.SetStateAction<ReturnedWarning | null>>;
  fieldWidthData: ReturnedWidthData | null;
  setFieldWidthData: React.Dispatch<
    React.SetStateAction<ReturnedWidthData | null>
  >;
  formErrors: any;
  setFormErrors: React.Dispatch<React.SetStateAction<any>>;
  currentPage: number;
  handlePageChange: () => Promise<void>;
  goToPreviousPage: () => void;
  isSubmitting: boolean;
  handleSaveDraft: () => Promise<void>;
  canEditStatus: boolean;
};

const FormContext = createContext<FormContextType>({} as FormContextType);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(
      "Note to dev: useFormContext must be used within a FormProvider"
    );
  }
  return context;
};

type FormProviderProps = {
  initialData: FormData;
  initialPageFields: Field[];
  jsonForm: Form;
  validationSchema: any;
  children: React.ReactNode;
};

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialData,
  initialPageFields,
  jsonForm,
  validationSchema
}) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

  const initialPageValue = getEditPageNumber(jsonForm.name);
  const [currentPage, setCurrentPage] = useState<number>(initialPageValue);

  const [currentPageFields, setCurrentPageFields] =
    useState<Field[]>(initialPageFields);
  const [fieldWarning, setFieldWarning] = useState<ReturnedWarning | null>(
    null
  );
  const [fieldWidthData, setFieldWidthData] =
    useState<ReturnedWidthData | null>(null);
  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const canEditStatus = useCanEditStatus(jsonForm.name);

  useFormAutosave(
    jsonForm,
    formData as FormRPartA | FormRPartB | LtftObj,
    isFormDirty
  );

  // validate when form is dirty
  useEffect(() => {
    if (isFormDirty) {
      validateFields(currentPageFields, formData, validationSchema)
        .then(() => {
          setFormErrors({});
        })
        .catch((err: { inner: { path: string; message: string }[] }) => {
          setFormErrors(createErrorObject(err));
        });
    }
  }, [formData, currentPageFields, validationSchema, isFormDirty]);

  const validateCurrentPage = useCallback(async (): Promise<boolean> => {
    try {
      await validateFields(currentPageFields, formData, validationSchema);
      setFormErrors({});
      return true;
    } catch (err: any) {
      setFormErrors(createErrorObject(err));
      return false;
    }
  }, [currentPageFields, formData, validationSchema]);

  const clearErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  const handlePageChange = useCallback(async () => {
    setIsFormDirty(false);
    const isValid = await validateCurrentPage();
    const lastPage = jsonForm.pages.length - 1;

    if (isValid) {
      if (currentPage === lastPage || canEditStatus) {
        continueToConfirm(jsonForm.name, formData);
      } else {
        setCurrentPage(currentPage + 1);
      }
    }
  }, [currentPage, formData, jsonForm, validateCurrentPage, canEditStatus]);

  const handleSaveDraft = useCallback(async () => {
    setIsSubmitting(true);
    await saveDraftForm(jsonForm, formData as FormDataType);
    setIsSubmitting(false);
  }, [formData, jsonForm]);

  const goToPreviousPage = useCallback(() => {
    setIsFormDirty(false);
    clearErrors();
    setCurrentPage(currentPage - 1);
  }, [currentPage, clearErrors]);

  const updateFormData = (
    name: string,
    value: any,
    arrayIndex?: number,
    arrayName?: string,
    dtoName?: string
  ) => {
    setFormData(formData => {
      if (typeof arrayIndex === "number" && arrayName) {
        const newArray = [...(formData[arrayName] ?? [])];
        newArray[arrayIndex] = {
          ...newArray[arrayIndex],
          [name]: value
        };
        return { ...formData, [arrayName]: newArray };
      } else if (dtoName) {
        const dto = formData[dtoName] ?? {};
        const updatedDto = {
          ...dto,
          [name]: value
        };
        return { ...formData, [dtoName]: updatedDto };
      } else {
        return { ...formData, [name]: value };
      }
    });
  };

  const handleBlur = useCallback(
    (
      event: React.FocusEvent<HTMLInputElement>,
      selectedOption?: any,
      checkedStatus?: boolean,
      arrayIndex?: number,
      arrayName?: string,
      dtoName?: string
    ) => {
      const { name, value } = event.currentTarget;
      if (selectedOption || checkedStatus) {
        return;
      }
      const trimmedValue = value.trim();
      updateFormData(name, trimmedValue, arrayIndex, arrayName, dtoName);
    },
    []
  );

  const handleChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      selectedOption?: any,
      checkedStatus?: boolean,
      arrayIndex?: number,
      arrayName?: string,
      dtoName?: string
    ) => {
      const name = event.currentTarget.name;
      const primaryField = currentPageFields.find(field => field.name === name);
      const totalName = primaryField?.contributesToTotal;
      const currentValue = determineCurrentValue(
        event,
        selectedOption,
        checkedStatus
      );

      updateFormData(name, currentValue, arrayIndex, arrayName, dtoName);

      if (primaryField?.warning) {
        const matcher = primaryField.warning.matcher;
        const msg = primaryField.warning.msgText;
        const warning = showFieldMatchWarning(currentValue, matcher, msg, name);
        setFieldWarning(warning);
      }

      if (primaryField?.type === "text" && primaryField?.canGrow) {
        const newWidth = setTextFieldWidth(currentValue.length);
        setFieldWidthData({ fieldName: primaryField.name, width: newWidth });
      }

      if (totalName) {
        setFormData((prevFormData: FormData) => {
          const fieldsToTotal = currentPageFields.filter(
            field => field.contributesToTotal === totalName
          );
          const total = sumFieldValues(prevFormData, fieldsToTotal);
          return {
            ...prevFormData,
            [totalName]: total
          };
        });
      }
      setIsFormDirty(true);
    },
    [currentPageFields]
  );

  const contextValue = React.useMemo(
    () => ({
      formData,
      setFormData,
      handleChange,
      handleBlur,
      isFormDirty,
      setIsFormDirty,
      currentPageFields,
      setCurrentPageFields,
      jsonForm,
      fieldWarning,
      setFieldWarning,
      fieldWidthData,
      setFieldWidthData,
      formErrors,
      setFormErrors,
      currentPage,
      handlePageChange,
      goToPreviousPage,
      isSubmitting,
      handleSaveDraft,
      canEditStatus
    }),
    [
      formData,
      isFormDirty,
      setIsFormDirty,
      currentPageFields,
      jsonForm,
      handleBlur,
      handleChange,
      fieldWarning,
      fieldWidthData,
      formErrors,
      currentPage,
      handlePageChange,
      goToPreviousPage,
      isSubmitting,
      handleSaveDraft,
      canEditStatus
    ]
  );

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};
