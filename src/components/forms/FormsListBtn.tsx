import { Button } from "nhsuk-react-components";
import { IFormR } from "../../models/IFormR";

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
  let btnForm: any = null;
  let bFProps: any = btnProps[btnForm?.lifecycleState];

  for (let form of formRPartAList) {
    if (
      form.lifecycleState === "DRAFT" ||
      form.lifecycleState === "UNSUBMITTED"
    ) {
      btnForm = form;
    }
  }

  // temp stuff to stop errors
  const loadSavedForm = (id: string) => console.log("load saved form", id);
  const loadNewForm = () => console.log("load new form");

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
