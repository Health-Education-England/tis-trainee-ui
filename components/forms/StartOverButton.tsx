import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useConfirm } from "material-ui-confirm";
import { Button } from "nhsuk-react-components";
import {
  BtnLocation,
  checkPush,
  getDraftFormId,
  isFormDeleted
} from "../../utilities/FormBuilderUtilities";
import store from "../../redux/store/store";
import { FormName } from "./form-builder/FormBuilder";

export type StartOverButtonProps = {
  formName: FormName;
  btnLocation: BtnLocation;
  formsListDraftId?: string;
};

export const StartOverButton = ({
  formName,
  btnLocation,
  formsListDraftId
}: Readonly<StartOverButtonProps>) => {
  const confirm = useConfirm();
  const formId =
    btnLocation === "formsList"
      ? formsListDraftId
      : getDraftFormId(store.getState()[formName].formData, formName);
  const saveStatus = useAppSelector(state => state[formName].saveStatus);
  const isSaving = saveStatus === "saving";

  const handleBtnClick = async () => {
    confirm({
      description:
        "This action will delete all the changes you have made to this form. Are you sure you want to continue?"
    })
      .then(async () => {
        const shouldStartOver = formId
          ? await isFormDeleted(formName, formId as string)
          : btnLocation === "formView";
        shouldStartOver
          ? checkPush(formName, btnLocation)
          : console.log("startover failed");
      })
      .catch(() => console.log("startover cancelled"));
  };

  return formId || btnLocation === "formView" ? (
    <Button
      data-cy="startOverButton"
      reverse
      type="button"
      onClick={handleBtnClick}
      disabled={isSaving}
    >
      Start over
    </Button>
  ) : null;
};
