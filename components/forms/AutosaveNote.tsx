import { Label } from "nhsuk-react-components";
import React from "react";

export const AutosaveNote = () => {
  return (
    <Label data-cy="autosaveNote">
      Note: This form will autosave 2 seconds after you pause making changes.
    </Label>
  );
};
