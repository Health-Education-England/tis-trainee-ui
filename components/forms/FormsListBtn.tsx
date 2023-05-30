import { Button } from "nhsuk-react-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import {
  loadSavedFormA,
  resetToInitFormA
} from "../../redux/slices/formASlice";
import {
  loadSavedFormB,
  resetToInitFormB
} from "../../redux/slices/formBSlice";
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
  addLocalFormToStore
} from "../../utilities/FormBuilderUtilities";
import { LifeCycleState } from "../../models/LifeCycleState";

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
  const resetForm = (pName: string) =>
    pName === "/formr-b"
      ? dispatch(resetToInitFormB())
      : dispatch(resetToInitFormA());

  const loadTheSavedForm = async (id: string) => {
    if (pathName === "/formr-a") await dispatch(loadSavedFormA(id));
    if (pathName === "/formr-b") await dispatch(loadSavedFormB(id));
  };

  const handleNewClick = () => {
    if (isWithinRange(latestSubDate, 31, "d")) {
      const localDate = DateUtilities.ToLocalDate(latestSubDate);
      confirm({
        description: `You recently submitted a form on ${localDate}. Are you sure you want to submit another?`
      })
        .then(() =>
          FormRUtilities.loadNewForm(pathName, history, traineeProfileData)
        )
        .catch(() => console.log("action cancelled"));
    } else FormRUtilities.loadNewForm(pathName, history, traineeProfileData);
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
      onClick={async () => {
        resetForm(pathName);
        if (draftFormProps) {
          {
            draftFormProps.lifecycleState === LifeCycleState.Local
              ? addLocalFormToStore(formName)
              : await loadTheSavedForm(draftFormProps.id!!);
          }
          history.push(`${pathName}/create`);
        } else handleNewClick();
      }}
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
