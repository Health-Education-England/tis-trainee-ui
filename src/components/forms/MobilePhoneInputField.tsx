import { FunctionComponent } from "react";
import { useField, connect } from "formik";
import PhoneInput from "react-phone-number-input";
import InputFooterLabel from "./InputFooterLabel";
import "./MobilePhoneInputField.scss";
interface IMobilePhoneInputField {
  name: string;
  label?: string;
  hidelabel?: boolean;
  id?: string;
  placeholder?: string;
  footer?: any;
  value?: any;
  disabled?: boolean;
}
const MobilePhoneInputField: FunctionComponent<IMobilePhoneInputField> =
  props => {
    const [field, { error }, helpers] = useField(props);
    return (
      <div
        className={`nhsuk-form-group ${error && "nhsuk-form-group--error"} ${
          props.hidelabel && "hide-label"
        }`}
      >
        {props.label && (
          <label htmlFor="mobilePhoneNumber" className="nhsuk-label">
            {props.label}
          </label>
        )}
        <PhoneInput
          placeholder="Enter mobile phone number"
          onBlur={field.onBlur}
          disabled={props.disabled}
          name="mobilePhoneNumber"
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
        <InputFooterLabel label={props.footer || ""} />
      </div>
    );
  };

export default connect(MobilePhoneInputField);
