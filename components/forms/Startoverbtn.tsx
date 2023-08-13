import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useLocation } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { Button } from "nhsuk-react-components";
import { deleteForm } from "../../utilities/FormBuilderUtilities";

export const Startoverbtn = () => {
  const confirm = useConfirm();
  const formName = useLocation().pathname.split("/")[1];

  // get id from updated form r data when autosaved form
  const formId = useAppSelector(state =>
    formName === "formr-a" ? state.formA.formAData.id : state.formB.formBData.id
  );
  // get id from forms draftFormProps when forms are loaded from db
  const formIdFromDraftFormProps = useAppSelector(
    state => state.forms?.draftFormProps?.id
  );

  const autosaveStatus = useAppSelector(state =>
    formName === "formr-a"
      ? state.formA.autosaveStatus
      : state.formB.autosaveStatus
  );
  const isAutosaving = autosaveStatus === "saving";

  const deleteThisForm = async () => {
    if (formId) {
      await deleteForm(formId, formName);
    } else if (formIdFromDraftFormProps) {
      await deleteForm(formIdFromDraftFormProps, formName);
    }
  };

  const handleBtnClick = async () => {
    confirm({
      description:
        "This action will delete all the changes you have made to this form. Are you sure you want to continue?"
    })
      .then(async () => {
        await deleteThisForm();
        window.location.reload();
      })
      .catch(() => console.log("startover cancelled"));
  };

  return formId ||
    formIdFromDraftFormProps ||
    autosaveStatus === "succeeded" ? (
    <Button
      data-cy="startoverBtn"
      reverse
      type="button"
      onClick={handleBtnClick}
      disabled={isAutosaving}
    >
      Start over
    </Button>
  ) : null;
};
