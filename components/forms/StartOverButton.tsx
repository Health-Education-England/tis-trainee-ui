import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useConfirm } from "material-ui-confirm";
import { Button } from "nhsuk-react-components";
import {
  getDraftFormId,
  isFormDeleted,
  mapFormNameToUrl
} from "../../utilities/FormBuilderUtilities";
import history from "../navigation/history";
import store from "../../redux/store/store";
import { updatedFormsRefreshNeeded } from "../../redux/slices/formsSlice";
import { FormName } from "./form-builder/FormBuilder";

export type StartOverButtonProps = {
  formName: FormName;
  isFormButton: boolean;
  formsListDraftId?: string;
};

export const StartOverButton = ({
  formName,
  isFormButton,
  formsListDraftId
}: Readonly<StartOverButtonProps>) => {
  const confirm = useConfirm();
  const formId = isFormButton
    ? getDraftFormId(
        useAppSelector(state => state[formName].formData),
        formName
      )
    : formsListDraftId;
  console.log("formId in startover button", formId);
  const saveStatus = useAppSelector(state => state[formName].saveStatus);
  const isSaving = saveStatus === "saving";

  const handleBtnClick = async () => {
    confirm({
      description:
        "This action will delete all the changes you have made to this form. Are you sure you want to continue?"
    })
      .then(async () => {
        const shouldStartOver = await isFormDeleted(formName, formId as string);
        shouldStartOver
          ? checkPush(formName, isFormButton)
          : console.log("startover failed");
      })
      .catch(() => console.log("startover cancelled"));
  };

  return formId ? (
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

// TODO - for ltft forms list refresh
function checkPush(formName: FormName, isFormButton: boolean) {
  if (isFormButton) {
    const mappedUrl = mapFormNameToUrl(formName);
    history.push(`/${mappedUrl}`);
  } else {
    store.dispatch(updatedFormsRefreshNeeded(true));
  }
}
