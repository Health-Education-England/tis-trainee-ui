import { FunctionComponent } from "react";
import { useField, connect } from "formik";
import PhoneInput from "react-phone-number-input";
import InputFooterLabel from "./InputFooterLabel";
interface IMobilePhoneInputField {
  name: string;
  label?: string;
  hidelabel?: boolean;
  footer?: any;
  disabled?: boolean;
}
const MobilePhoneInputField: FunctionComponent<
  IMobilePhoneInputField
> = props => {
  const [field, { error }, helpers] = useField(props);
  const { name, label, hidelabel, footer, disabled } = props;
  return (
    <div
      className={`nhsuk-form-group ${error && "nhsuk-form-group--error"} ${
        hidelabel && "hide-label"
      }`}
    >
      {label && (
        <label htmlFor="mobilePhoneNumber" className="nhsuk-label">
          {label}
        </label>
      )}
      <PhoneInput
        placeholder="Enter mobile number..."
        onBlur={field.onBlur}
        disabled={disabled}
        name={name}
        defaultCountry="GB"
        onChange={value => {
          helpers.setValue(value);
        }}
      />
      <span
        className="nhsuk-error-message"
        id="confirmTOTPCode--error-message"
        role="alert"
      >
        <span className="nhsuk-u-visually-hidden">Error: </span>
        {error}
      </span>
      <InputFooterLabel label={footer || ""} />
    </div>
  );
};

export default connect(MobilePhoneInputField);
