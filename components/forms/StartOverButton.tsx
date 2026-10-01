import React, { useState } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { Button } from "nhsuk-react-components";
import {
  BtnLocation,
  checkPush,
  getDraftFormId,
  isFormDeleted
} from "../../utilities/FormBuilderUtilities";
import store from "../../redux/store/store";
import { FormName } from "./form-builder/FormBuilder";
import { ActionModal } from "../common/ActionModal";

const startOverWarningText =
  "This action will delete all the changes you have made to this form. Are you sure you want to continue?";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const formId =
    btnLocation === "formsList"
      ? formsListDraftId
      : getDraftFormId(store.getState()[formName].formData, formName);
  const saveStatus = useAppSelector(state => state[formName].saveStatus);
  const isSaving = saveStatus === "saving";

  const handleConfirm = async () => {
    setShowConfirmModal(false);
    const shouldStartOver = formId
      ? await isFormDeleted(formName, formId)
      : btnLocation === "formView";
    shouldStartOver
      ? checkPush(formName, btnLocation)
      : console.log("startover failed");
  };

  return formId || btnLocation === "formView" ? (
    <>
      <Button
        data-cy="startOverButton"
        reverse
        type="button"
        onClick={() => setShowConfirmModal(true)}
        disabled={isSaving}
      >
        Start over
      </Button>
      {showConfirmModal && (
        <ActionModal
          onSubmit={handleConfirm}
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          cancelBtnText="Cancel"
          warningLabel="Start over"
          warningText={startOverWarningText}
          submittingBtnText=""
          isSubmitting={false}
        />
      )}
    </>
  ) : null;
};
