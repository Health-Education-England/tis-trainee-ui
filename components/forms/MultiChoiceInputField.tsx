import React from "react";
import { connect, FieldHelperProps, FieldInputProps, useField } from "formik";
import { Checkboxes, Radios, Label } from "nhsuk-react-components";
import InputFooterLabel from "./InputFooterLabel";

interface Props {
  name: string;
  type: "radios" | "checkbox";
  items: any[];
  label?: string;
  id?: string;
  hint?: any;
  footer?: any;
  onChange?: any;
  conditional?: any;
  canEdit?: boolean;
  checked?: boolean;
}

const MultiChoiceInputField: React.FC<Props> = props => {
  const [field, { error }, helpers] = useField(props);
  const FormElement = props.type === "radios" ? Radios : Checkboxes;
  const FormChildElement =
    props.type === "radios" ? Radios.Radio : Checkboxes.Box;
  return (
    <div
      data-jest={props.name}
      data-cy={props.name}
      className={
        error ? "nhsuk-form-group nhsuk-form-group--error" : "nhsuk-form-group"
      }
    >
      <Label htmlFor={props.id}>{props.label}</Label>

      <FormElement
        name={props.name}
        data-cy={props.name}
        id={props.id ?? props.name}
        error={error ?? ""}
        onChange={props.onChange ? props.onChange : field.onChange}
        hint={props.hint}
      >
        {props?.items?.map((item, index) => (
          <FormChildElement
            key={item.value}
            value={item.value}
            id={item.id}
            data-cy={`${props.name}${index}`}
            checked={!props.checked ? setCheckedStatus(field, item) : true}
            onChange={() => setOnChangeValue(props, helpers, item)}
            conditional={props.conditional}
            disabled={!props.canEdit && props.canEdit != null}
          >
            {item.label}
          </FormChildElement>
        ))}
      </FormElement>
      <InputFooterLabel label={props.footer || ""} />
    </div>
  );
};

const setCheckedStatus = (
  field: FieldInputProps<any>,
  item: { value: string | boolean }
) =>
  typeof field.value === "boolean"
    ? field.value === item.value || item.value === field.value.toString()
    : (field.value && field.value.toString() === item.value.toString()) ||
      false;

const setOnChangeValue = (
  props: React.PropsWithChildren<Props>,
  helpers: FieldHelperProps<string | boolean>,
  item: { value: string }
) =>
  props.type === "checkbox"
    ? helpers.setValue(!item.value)
    : helpers.setValue(item.value, true);

export default connect(MultiChoiceInputField);
