import { Button } from "nhsuk-react-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { resetToInitFormA } from "../../redux/slices/formASlice";
import { resetToInitFormB } from "../../redux/slices/formBSlice";
import history from "../navigation/history";
import {
  DateType,
  DateUtilities,
  isWithinRange
} from "../../utilities/DateUtilities";
import { FormRUtilities } from "../../utilities/FormRUtilities";
import { useConfirm } from "material-ui-confirm";
import {
  DraftFormProps,
  loadTheSavedForm,
  resetLocalStorageFormData
} from "../../utilities/FormBuilderUtilities";
import { LifeCycleState } from "../../models/LifeCycleState";
import { useCallback, useEffect } from "react";
interface IFormsListBtn {
  draftFormProps: DraftFormProps | null;
  pathName: string;
  latestSubDate: DateType;
}

const FormsListBtn = ({
  draftFormProps,
  pathName,
  latestSubDate
}: IFormsListBtn) => {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const traineeProfileData = useAppSelector(selectTraineeProfile);
  const formName: string = pathName === "/formr-a" ? "formA" : "formB";
  const resetForm = useCallback(
    (pName: string) => {
      if (pName === "/formr-b") {
        dispatch(resetToInitFormB());
      } else {
        dispatch(resetToInitFormA());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    resetLocalStorageFormData(formName);
    resetForm(pathName);
  }, [resetForm, formName, pathName]);

  const handleNewClick = () => {
    if (isWithinRange(latestSubDate, 31, "d")) {
      const localDate = DateUtilities.ToLocalDate(latestSubDate);
      confirm({
        description: `You recently submitted a form on ${localDate}. Are you sure you want to submit another?`
      })
        .then(() => {
          FormRUtilities.loadNewForm(pathName, history, traineeProfileData);
        })
        .catch(() => console.log("action cancelled"));
    } else {
      FormRUtilities.loadNewForm(pathName, history, traineeProfileData);
    }
  };

  const handleBtnClick = () => {
    resetForm(pathName);
    if (draftFormProps?.id) {
      loadTheSavedForm(pathName, draftFormProps?.id, history);
    } else {
      handleNewClick();
    }
  };

  return (
    <Button
      id="btnOpenForm"
      data-cy={
        draftFormProps?.lifecycleState
          ? `btn-${chooseBtnText(draftFormProps?.lifecycleState)}`
          : "Submit new form"
      }
      reverse
      type="submit"
      onClick={handleBtnClick}
    >
      {chooseBtnText(draftFormProps?.lifecycleState)}
    </Button>
  );
};

export default FormsListBtn;

function chooseBtnText(lifecycleState: LifeCycleState | undefined) {
  switch (lifecycleState) {
    case LifeCycleState.Draft:
      return "Edit saved draft form";
    case LifeCycleState.Local:
      return "Edit unsaved draft form";
    case LifeCycleState.Unsubmitted:
      return "Edit unsubmitted form";
    default:
      return "Submit new form";
  }
}
