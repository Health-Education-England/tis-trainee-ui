import { useField, useFormikContext } from "formik";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import gb from "date-fns/locale/en-GB";
registerLocale("en-gb", gb);

export const DatepickerField = ({ ...props }: any) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <DatePicker
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      onChange={val => {
        setFieldValue(field.name, val);
      }}
      dateFormat="dd/MM/yyyy"
      locale="en-gb"
    />
  );
};
