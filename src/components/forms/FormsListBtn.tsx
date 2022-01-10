import { Button } from "nhsuk-react-components";
import { IFormR } from "../../models/IFormR";
import { updatedFormA } from "../../redux/slices/formASlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { loadSavedFormA } from "../../redux/slices/formASlice";
import { ProfileToFormRPartAInitialValues } from "../../models/ProfileToFormRPartAInitialValues";
import { ProfileToFormRPartBInitialValues } from "../../models/ProfileToFormRPartBInitialValues";
import { useHistory } from "react-router-dom";
import { updatedFormB } from "../../redux/slices/formBSlice";
interface IFormsListBtn {
  formRList: IFormR[];
  pathName: string;
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

// TODO types
const FormsListBtn = ({ formRList, pathName }: IFormsListBtn) => {
  const dispatch = useAppDispatch();
  const traineeProfileData = useAppSelector(selectTraineeProfile);
  let btnForm: IFormR | null = null;
  let bFProps: any;
  let history = useHistory();

  for (let form of formRList) {
    if (
      form.lifecycleState === "DRAFT" ||
      form.lifecycleState === "UNSUBMITTED"
    ) {
      btnForm = form;
      bFProps = btnProps[form.lifecycleState];
    }
  }

  // TODO conditional
  const loadTheSavedForm = (id: any) => {
    dispatch(loadSavedFormA(id)).then(() => history.push(`${pathName}/create`));
  };

  const loadNewForm = () => {
    if (pathName === "/formr-a") {
      const formAInitialValues =
        ProfileToFormRPartAInitialValues(traineeProfileData);
      dispatch(updatedFormA(formAInitialValues));
    } else if (pathName === "/formr-b") {
      const formBInitialValues =
        ProfileToFormRPartBInitialValues(traineeProfileData);
      dispatch(updatedFormB(formBInitialValues));
    }

    history.push(`${pathName}/create`);
  };

  return (
    <Button
      id="btnOpenForm"
      data-cy={btnForm ? bFProps["data-cy"] : "btnLoadNewForm"}
      reverse
      type="submit"
      onClick={
        btnForm?.id ? () => loadTheSavedForm(btnForm?.id) : () => loadNewForm()
      }
    >
      {btnForm ? bFProps["btn-text"] : "Submit new form"}
    </Button>
  );
};

export default FormsListBtn;
