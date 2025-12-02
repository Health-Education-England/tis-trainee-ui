import React, { FunctionComponent } from "react";
import { useField, connect } from "formik";
import { Input, Textarea } from "nhsuk-react-components";
import InputFooterLabel from "./InputFooterLabel";
import { handleKeyDown } from "../../utilities/FormBuilderUtilities";
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
  onBlur?: any;
  isNumberField?: boolean;
  maxLength?: number;
  inputSymbol?: string;
}

const TextInputField: FunctionComponent<Props> = props => {
  const [field, { error }] = useField(props);
  const FormElement = props.rows ? Textarea : Input;
  const setFieldWidth = (valueLength: number | undefined) => {
    return valueLength && valueLength < 20 ? 20 : Math.floor(width / 10) * 10;
  };
  const {
    hidelabel,
    isNumberField,
    width,
    readOnly,
    maxLength,
    inputSymbol,
    ...rest
  } = props;
  const setCorrectLabelClass = () => {
    if (error) {
      return "nhsuk-form-group nhsuk-form-group--error";
    }
    return props.hidelabel ? "hide-label nhsuk-form-group" : "nhsuk-form-group";
  };
  const showInputSymbol = () => {
    if (error) return null;
    if (inputSymbol) {
      return (
        <span
          style={{
            marginLeft: "2px"
          }}
          data-cy="input-symbol"
        >
          {inputSymbol}
        </span>
      );
    }
    return null;
  };

  return (
    <div className={setCorrectLabelClass()}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FormElement
          autoComplete="off"
          onKeyDown={handleKeyDown}
          onInput={e => handleNumberInput(isNumberField, e)}
          width={width ?? setFieldWidth(field.value?.length)}
          disabled={props.disabled}
          error={error ?? ""}
          id={props.id ?? props.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          value={field.value ?? ""}
          maxLength={maxLength}
          {...rest}
          readOnly={props.readOnly}
          min="1920-01-01"
          max="2119-12-31"
          data-cy={props.name}
          className={readOnly ? "readonly-field" : ""}
        />
        {showInputSymbol()}
      </div>
      <InputFooterLabel label={props.footer ?? ""} />
    </div>
  );
};

export default connect(TextInputField);

function handleNumberInput(
  isNumberField: boolean | undefined,
  e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
) {
  if (isNumberField) {
    const input = e.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, "");
  }
}
