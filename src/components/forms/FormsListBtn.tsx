import { Button } from "nhsuk-react-components";
import { IFormR } from "../../models/IFormR";
import { updatedFormA } from "../../redux/slices/formASlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { ProfileToFormRPartAInitialValues } from "../../models/ProfileToFormRPartAInitialValues";
import { useHistory } from "react-router-dom";
interface IFormsListBtn {
  formRPartAList: IFormR[];
}

const btnProps = [
  {
    DRAFT: {
      "data-cy": "btnEditSavedForm",
      "on-click": "loadSavedForm",
      "btn-text": "Edit saved form"
    }
  },
  {
    UNSUBMITTED: {
      "data-cy": "btnEditUnsubmittedForm",
      "on-click": "loadSavedForm",
      "btn-text": "Edit unsubmitted form"
    }
  }
];

const FormsListBtn = ({ formRPartAList }: IFormsListBtn) => {
  const dispatch = useAppDispatch();
  const traineeProfileData = useAppSelector(selectTraineeProfile);
  let btnForm: any = null;
  let bFProps: any = btnProps[btnForm?.lifecycleState];
  let history = useHistory();

  for (let form of formRPartAList) {
    if (
      form.lifecycleState === "DRAFT" ||
      form.lifecycleState === "UNSUBMITTED"
    ) {
      btnForm = form;
    }
  }

  // TODO WIP
  const loadSavedForm = (id: string) => console.log("load saved form", id);
  const loadNewForm = () => {
    const formAInitialValues =
      ProfileToFormRPartAInitialValues(traineeProfileData);
    dispatch(updatedFormA(formAInitialValues));
    history.push("/formr-a/create");
  };

  return (
    <Button
      id="btnOpenForm"
      data-cy={btnForm ? bFProps["data-cy"] : "btnLoadNewForm"}
      reverse
      type="submit"
      onClick={btnForm ? () => loadSavedForm(btnForm.id) : () => loadNewForm()}
    >
      {btnForm ? bFProps["btn-text"] : "Submit new form"}
    </Button>
  );
};

export default FormsListBtn;
