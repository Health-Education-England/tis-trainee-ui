import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useLocation } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { Button } from "nhsuk-react-components";
import { isFormDeleted } from "../../utilities/FormBuilderUtilities";
import history from "../navigation/history";
import store from "../../redux/store/store";
import { updatedFormsRefreshNeeded } from "../../redux/slices/formsSlice";

export const StartOverButton = () => {
  const confirm = useConfirm();
  const pathName = useLocation().pathname;
  const formName = pathName.split("/")[1];

  // get id from updated form r (when autosaved)
  const formId = useAppSelector(state =>
    formName === "formr-a" ? state.formA.newFormId : state.formB.newFormId
  );
  // get id from forms draftFormProps when forms are loaded from db
  const formIdFromDraftFormProps = useAppSelector(
    state => state.forms?.draftFormProps?.id
  );

  const autosaveStatus = useAppSelector(state =>
    formName === "formr-a" ? state.formA.saveStatus : state.formB.saveStatus
  );
  const isAutosaving = autosaveStatus === "saving";

  const handleBtnClick = async () => {
    confirm({
      description:
        "This action will delete all the changes you have made to this form. Are you sure you want to continue?"
    })
      .then(async () => {
        const shouldStartOver = await isFormDeleted(
          formName,
          formId,
          formIdFromDraftFormProps
        );
        shouldStartOver
          ? checkPush(formName, pathName)
          : console.log("startover failed");
      })
      .catch(() => console.log("startover cancelled"));
  };

  return formId || formIdFromDraftFormProps ? (
    <Button
      data-cy="startOverButton"
      reverse
      type="button"
      onClick={handleBtnClick}
      disabled={isAutosaving}
    >
      Start over
    </Button>
  ) : null;
};

function checkPush(formName: string, path: string) {
  path.endsWith("create") || path.endsWith("confirm")
    ? history.push(`/${formName}`)
    : store.dispatch(updatedFormsRefreshNeeded(true));
}
