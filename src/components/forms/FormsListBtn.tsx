import { Button } from "nhsuk-react-components";
import { IFormR } from "../../models/IFormR";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { loadSavedFormA } from "../../redux/slices/formASlice";
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
interface IFormsListBtn {
  formRList: IFormR[];
  pathName: string;
  latestSubDate: DateType;
}

const btnProps = {
  DRAFT: {
    "data-cy": "btnEditSavedForm",
    "on-click": "loadSavedForm",
    "btn-text": "Edit saved form"
  },
  UNSUBMITTED: {
    "data-cy": "btnEditUnsubmittedForm",
    "on-click": "loadSavedForm",
    "btn-text": "Edit unsubmitted form"
  }
};

const FormsListBtn = ({
  formRList,
  pathName,
  latestSubDate
}: IFormsListBtn) => {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const traineeProfileData = useAppSelector(selectTraineeProfile);
  let btnForm: IFormR | null = null;
  let bFProps: any;

  for (let form of formRList) {
    if (
      form.lifecycleState === "DRAFT" ||
      form.lifecycleState === "UNSUBMITTED"
    ) {
      btnForm = form;
      bFProps = btnProps[form.lifecycleState];
    }
  }

  const resetForm = (pName: string) =>
    pName === "/formr-b" && dispatch(resetToInitFormB());

  const loadTheSavedForm = async (id: string) => {
    if (pathName === "/formr-a") {
      await dispatch(loadSavedFormA(id));
    } else await dispatch(loadSavedFormB(id));
    history.push(`${pathName}/create`);
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
      data-cy={btnForm ? bFProps["data-cy"] : "btnLoadNewForm"}
      reverse
      type="submit"
      onClick={() => {
        resetForm(pathName);
        if (btnForm?.id) loadTheSavedForm(btnForm.id);
        else handleNewClick();
      }}
    >
      {btnForm ? bFProps["btn-text"] : "Submit new form"}
    </Button>
  );
};

export default FormsListBtn;
