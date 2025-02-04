import React, { createContext, useContext, useState } from "react";
import { FormData } from "./FormBuilder";
import {
  determineCurrentValue
  // updateFormData
} from "../../../utilities/FormBuilderUtilities";

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
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  isFormDirty: boolean;
  setIsFormDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

type FormProviderProps = {
  initialData: FormData;
  children: React.ReactNode;
};

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialData
}) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

  const handleBlur = (event: any) => {
    const { name, value } = event.currentTarget;
    setFormData((formData: FormData) => {
      return { ...formData, [name]: value.trim() };
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    selectedOption?: any,
    checkedStatus?: boolean,
    arrayIndex?: number,
    arrayName?: string,
    dtoName?: string
  ) => {
    const name = event.currentTarget.name;
    const currentValue = determineCurrentValue(
      event,
      selectedOption,
      checkedStatus
    );

    setFormData(formData => {
      if (typeof arrayIndex === "number" && arrayName) {
        const newArray = [...(formData[arrayName] || [])];
        newArray[arrayIndex] = {
          ...newArray[arrayIndex],
          [name]: currentValue
        };
        return { ...formData, [arrayName]: newArray };
      } else if (dtoName) {
        const dto = formData[dtoName] || {};
        const updatedDto = {
          ...dto,
          [name]: currentValue
        };
        return { ...formData, [dtoName]: updatedDto };
      } else {
        return { ...formData, [name]: currentValue };
      }
    });
    setIsFormDirty(true);
  };

  const contextValue = React.useMemo(
    () => ({
      formData,
      setFormData,
      handleChange,
      handleBlur,
      isFormDirty,
      setIsFormDirty
    }),
    [formData, isFormDirty]
  );

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};
