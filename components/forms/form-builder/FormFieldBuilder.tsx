import React from "react";
import { Field, FieldWarning } from "./FormBuilder";
import { FormDtoBuilder } from "./FormDtoBuilder";
import { Text } from "./form-fields/Text";
import { TextArea } from "./form-fields/TextArea";
import { filteredOptions } from "../../../utilities/FormBuilderUtilities";
import { Selector } from "./form-fields/Selector";
import { Dates } from "./form-fields/Dates";
import { Phone } from "./form-fields/Phone";
import { Checkboxes } from "./form-fields/Checkboxes";
import { Radios } from "./form-fields/Radios";
import { FormArrayPanelBuilder } from "./FormArrayPanelBuilder";

type FormFieldBuilderProps = {
  field: Field;
  value: any;
  error: string;
  fieldWarning: FieldWarning | undefined;
  handlers: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    setFormData: React.Dispatch<any>;
  };
  options?: any;
  arrayDetails?: { arrayIndex: number; arrayName: string };
  dtoName?: string;
  formData?: any;
  isFormDirty: React.MutableRefObject<boolean>;
};

export function FormFieldBuilder({
  field,
  value,
  error,
  fieldWarning,
  handlers,
  options,
  arrayDetails,
  dtoName,
  formData,
  isFormDirty
}: Readonly<FormFieldBuilderProps>) {
  const {
    name,
    type,
    label,
    placeholder,
    optionsKey,
    width,
    isNumberField,
    isTotal,
    readOnly,
    rows,
    isMultiSelect
  } = field;
  const { handleChange, handleBlur, setFormData } = handlers;
  const { arrayIndex, arrayName } = arrayDetails ?? {};
  switch (type) {
    case "array":
      return (
        <FormArrayPanelBuilder
          field={field}
          setFormData={setFormData}
          handleChange={handleChange}
          handleBlur={handleBlur}
          panelErrors={error}
          fieldWarning={fieldWarning}
          options={options}
          formData={formData}
          isFormDirty={isFormDirty}
        />
      );
    case "dto":
      return (
        <FormDtoBuilder
          field={field}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleBlur={handleBlur}
          dtoErrors={error}
          options={options}
          fieldWarning={fieldWarning}
          isFormDirty={isFormDirty}
        />
      );
    case "text":
      return (
        <Text
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error}
          fieldWarning={fieldWarning}
          placeholder={placeholder}
          handleBlur={handleBlur}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
          width={width}
          isNumberField={isNumberField}
          isTotal={isTotal}
          readOnly={readOnly}
        />
      );
    case "textArea":
      return (
        <TextArea
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error}
          placeholder={placeholder}
          handleBlur={handleBlur}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
          rows={rows}
        />
      );

    case "radio":
      return (
        <Radios
          name={name}
          label={label}
          options={filteredOptions(optionsKey, options)}
          handleChange={handleChange}
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
        />
      );

    case "select":
      return (
        <Selector
          name={name}
          label={label}
          options={filteredOptions(optionsKey, options)}
          handleChange={handleChange}
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
          isMultiSelect={isMultiSelect}
        />
      );

    case "date":
      return (
        <Dates
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error}
          placeholder={placeholder}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
          fieldWarning={fieldWarning}
        />
      );

    case "phone":
      return (
        <Phone
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
        />
      );
    case "checkbox":
      return (
        <Checkboxes
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
        />
      );

    default:
      return null;
  }
}
