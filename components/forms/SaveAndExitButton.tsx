import React from "react";
import { Button } from "nhsuk-react-components";
import { FormName } from "./form-builder/FormBuilder";

type SaveAndExitButtonProps = {
  onClick: (e: { preventDefault: () => void }) => void;
  isSubmitting: boolean;
  isAutosaving: boolean;
  formName: FormName;
};

export const SaveAndExitButton = ({
  onClick,
  isSubmitting,
  isAutosaving,
  formName
}: Readonly<SaveAndExitButtonProps>) => {
  const isDisabled = isSubmitting || isAutosaving;
  const buttonText = isDisabled ? "Saving..." : "Save & exit";

  return (
    <Button
      secondary
      onClick={(e: { preventDefault: () => void }) => {
        e.preventDefault();
        onClick(e);
      }}
      disabled={isDisabled}
      data-cy={`BtnSaveExit-${formName}`}
    >
      {buttonText}
    </Button>
  );
};
