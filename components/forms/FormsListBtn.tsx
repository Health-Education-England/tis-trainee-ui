import { Button } from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import history from "../navigation/history";
import {
  DateType,
  DateUtilities,
  isWithinRange
} from "../../utilities/DateUtilities";
import { FormRUtilities } from "../../utilities/FormRUtilities";
import { useConfirm } from "material-ui-confirm";
import { loadTheSavedForm } from "../../utilities/FormBuilderUtilities";
import { LifeCycleState } from "../../models/LifeCycleState";
interface IFormsListBtn {
  pathName: string;
  latestSubDate: DateType;
}

const FormsListBtn = ({ pathName, latestSubDate }: IFormsListBtn) => {
  const confirm = useConfirm();
  const traineeProfileData = useAppSelector(selectTraineeProfile);
  const draftFormProps = useAppSelector(state => state.forms?.draftFormProps);

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
