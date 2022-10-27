import { ControlProps } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { TextField } from "@mui/material";
import MultiChoiceInputField from "../MultiChoiceInputField";
import { Checkboxes, Radios, Label } from "nhsuk-react-components";

const FormADeclarationControl = (props: ControlProps) => (
  <MultiChoiceInputField
    type="checkbox"
    name="appInstalledNow"
    items={props.data}
  />
);
export default FormADeclarationControl;
