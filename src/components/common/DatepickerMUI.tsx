import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import TextField from "@mui/material/TextField";
import { useField, useFormikContext } from "formik";

export const DatepickerMUI = ({ ...props }: any) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        inputFormat="dd/MM/yyyy"
        value={field.value}
        onChange={val => {
          setFieldValue(field.name, val);
        }}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};
