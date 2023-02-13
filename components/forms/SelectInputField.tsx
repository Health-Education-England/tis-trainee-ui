import React from "react";
import { connect, useField } from "formik";
import { Select } from "nhsuk-react-components";
import InputFooterLabel from "./InputFooterLabel";

interface Props {
  name: string;
  label: string;
  id?: string;
  hint?: string;
  options?: any[];
  footer?: any;
  onChange?: any;
}

const SelectInputField: React.FC<Props> = props => {
  const [field, { error }, helpers] = useField(props);
  const { name, id, label, onChange, hint, footer } = props;
  return (
    <>
      <div
        className={
          error
            ? "nhsuk-form-group nhsuk-form-group--error"
            : "nhsuk-form-group"
        }
      >
        <Select
          name={name}
          id={id || name}
          onBlur={() => {
            helpers.setTouched(true);
          }}
          error={error || ""}
          label={label}
          onChange={onChange ? onChange : field.onChange}
          hint={hint}
          value={field.value || ""}
          data-cy={name}
        >
          <Select.Option value="">-- Please select --</Select.Option>
          {props.options
            ? props.options.map((option, _index) => (
                <Select.Option key={option.label} value={option.value}>
                  {option.label}
                </Select.Option>
              ))
            : null}
        </Select>
        <InputFooterLabel label={footer || ""} />
      </div>
    </>
  );
};

export default connect(SelectInputField);
