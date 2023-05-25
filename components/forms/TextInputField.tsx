import React, { FunctionComponent } from "react";
import { useField, connect } from "formik";
import { Input, Textarea } from "nhsuk-react-components";
import InputFooterLabel from "./InputFooterLabel";
interface Props {
  name: string;
  label: string;
  hidelabel?: boolean;
  id?: string;
  placeholder?: string;
  rows?: number;
  hint?: any;
  width?: any;
  footer?: any;
  type?: string;
  readOnly?: boolean;
  value?: any;
  disabled?: boolean;
  validate?: any;
}

const TextInputField: FunctionComponent<Props> = props => {
  const [field, { error }] = useField(props);
  const FormElement = props.rows ? Textarea : Input;
  const setFieldWidth = (width: number) => {
    return width < 20 ? 20 : Math.floor(width / 10) * 10;
  };
  const { hidelabel, ...rest } = props;
  const setCorrectLabelClass = () => {
    if (error) {
      return "nhsuk-form-group nhsuk-form-group--error";
    }
    return props.hidelabel ? "hide-label nhsuk-form-group" : "nhsuk-form-group";
  };

  return (
    <div className={setCorrectLabelClass()}>
      <FormElement
        width={
          field.value ? props.width || setFieldWidth(field.value.length) : 20
        }
        disabled={props.disabled}
        error={error ?? ""}
        id={props.id ?? props.name}
        onBlur={field.onBlur}
        onChange={field.onChange}
        value={field.value ?? ""}
        {...rest}
        readOnly={props.readOnly}
        min="1920-01-01"
        max="2119-31-12"
        data-cy={props.name}
      />
      <InputFooterLabel label={props.footer || ""} />
    </div>
  );
};

export default connect(TextInputField);
