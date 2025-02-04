import React, { createContext, useContext, useState, useCallback } from "react";
import { Field, FormData, FormName, ReturnedWidthData } from "./FormBuilder";
import {
  determineCurrentValue,
  ReturnedWarning,
  setTextFieldWidth,
  showFieldMatchWarning,
  sumFieldValues
} from "../../../utilities/FormBuilderUtilities";
import useFormAutosave from "../../../utilities/hooks/useFormAutosave";
import { FormRPartA } from "../../../models/FormRPartA";
import { FormRPartB } from "../../../models/FormRPartB";
import { LtftObj } from "../../../redux/slices/ltftSlice";

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
  currentPageFields: Field[];
  setCurrentPageFields: React.Dispatch<React.SetStateAction<Field[]>>;
  formName: FormName;
  fieldWarning: ReturnedWarning | null;
  setFieldWarning: React.Dispatch<React.SetStateAction<ReturnedWarning | null>>;
  fieldWidthData: ReturnedWidthData | null;
  setFieldWidthData: React.Dispatch<
    React.SetStateAction<ReturnedWidthData | null>
  >;
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
  formName: FormName;
  children: React.ReactNode;
};

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialData,
  initialPageFields,
  formName
}) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [currentPageFields, setCurrentPageFields] =
    useState<Field[]>(initialPageFields);
  const [fieldWarning, setFieldWarning] = useState<ReturnedWarning | null>(
    null
  );
  const [fieldWidthData, setFieldWidthData] =
    useState<ReturnedWidthData | null>(null);

  useFormAutosave(
    formName,
    formData as FormRPartA | FormRPartB | LtftObj,
    isFormDirty
  );

  const updateFormData = (
    name: string,
    value: any,
    arrayIndex?: number,
    arrayName?: string,
    dtoName?: string
  ) => {
    setFormData(formData => {
      if (typeof arrayIndex === "number" && arrayName) {
        const newArray = [...(formData[arrayName] || [])];
        newArray[arrayIndex] = {
          ...newArray[arrayIndex],
          [name]: value
        };
        return { ...formData, [arrayName]: newArray };
      } else if (dtoName) {
        const dto = formData[dtoName] || {};
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
      formName,
      fieldWarning,
      setFieldWarning,
      fieldWidthData,
      setFieldWidthData
    }),
    [
      formData,
      isFormDirty,
      currentPageFields,
      formName,
      handleBlur,
      handleChange,
      fieldWarning,
      fieldWidthData
    ]
  );

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};
