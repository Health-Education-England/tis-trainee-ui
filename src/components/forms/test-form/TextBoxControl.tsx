import { ControlProps } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { TextField } from "@mui/material";
import MultiChoiceInputField from "../MultiChoiceInputField";
import { Checkboxes, Radios, Label } from "nhsuk-react-components";

const FormADeclarationControl = (props: ControlProps) => (
  <TextField
    label={props.label}
    value={props.data}
    onChange={event => props.handleChange(props.path, event.target.value)}
    error={!!props.errors}
    helperText={props.errors || props.description}
    disabled={!props.enabled}
  />
);
export default FormADeclarationControl;
