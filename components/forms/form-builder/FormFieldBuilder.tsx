import React from "react";
import { Field, FormErrorsType } from "./FormBuilder";
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
import { useScrollToField } from "../../../utilities/hooks/useScrollToField";
import { useFormContext } from "./FormContext";

type FormFieldBuilderProps = {
  field: Field;
  value: any;
  error: string;
  options?: any;
  arrayDetails?: { arrayIndex: number; arrayName: string };
  dtoName?: string;
  formErrors?: FormErrorsType;
};

export function FormFieldBuilder({
  field,
  value,
  error,
  options,
  arrayDetails,
  dtoName,
  formErrors
}: Readonly<FormFieldBuilderProps>) {
  const {
    name,
    type,
    label,
    placeholder,
    optionsKey,
    width,
    isNumberField,
    readOnly,
    rows,
    isMultiSelect,
    hint,
    maxDigits,
    conditionalField
  } = field;
  const { arrayIndex, arrayName } = arrayDetails ?? {};
  const { currentPageFields, formData } = useFormContext();

  const shouldAttachScroll = arrayIndex === undefined && !arrayName;

  useScrollToField(target => {
    if (!shouldAttachScroll) return false;
    return target === name;
  });

  switch (type) {
    case "array":
      return (
        <FormArrayPanelBuilder
          field={field}
          panelErrors={error}
          options={options}
        />
      );
    case "dto":
      return (
        <FormDtoBuilder field={field} dtoErrors={error} options={options} />
      );
    case "text":
      return (
        <Text
          name={name}
          label={label}
          fieldError={error}
          placeholder={placeholder}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
          width={width}
          isNumberField={isNumberField}
          readOnly={readOnly}
          hint={hint}
          maxDigits={maxDigits}
        />
      );
    case "textArea":
      return (
        <TextArea
          name={name}
          label={label}
          hint={hint}
          fieldError={error}
          placeholder={placeholder}
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
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
          isMultiSelect={isMultiSelect}
          hint={hint}
          placeholder={placeholder}
        />
      );

    case "date":
      return (
        <Dates
          name={name}
          label={label}
          hint={hint}
          fieldError={error}
          placeholder={placeholder}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
        />
      );

    case "phone":
      return (
        <Phone
          name={name}
          label={label}
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
        />
      );
    case "checkbox": {
      const childField = conditionalField
        ? currentPageFields.find(f => f.name === conditionalField)
        : undefined;

      const conditional = childField ? (
        <FormFieldBuilder
          field={childField}
          value={formData[childField.name] ?? ""}
          error={(formErrors?.[childField.name] as string) ?? ""}
          options={options}
          formErrors={formErrors}
        />
      ) : undefined;

      return (
        <Checkboxes
          name={name}
          label={label}
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
          conditional={conditional}
        />
      );
    }

    default:
      return null;
  }
}
