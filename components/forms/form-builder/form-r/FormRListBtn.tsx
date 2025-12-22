import { Button } from "nhsuk-react-components";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import history from "../../../navigation/history";
import { updatedFormALifecycleState } from "../../../../redux/slices/formASlice";
import { updatedFormBLifecycleState } from "../../../../redux/slices/formBSlice";

type FormsListBtnType = {
  pathName: string;
};

const FormRListBtn = ({ pathName }: FormsListBtnType) => {
  const dispatch = useAppDispatch();
  const draftFormProps = useAppSelector(state => state.forms?.draftFormProps);
  const formName = pathName.split("/")[1] === "formr-a" ? "formA" : "formB";
  const isFormDeleting = useAppSelector(
    state => state[formName].status === "deleting"
  );

  const handleBtnClick = () => {
    if (draftFormProps?.id) {
      history.push(`${pathName}/${draftFormProps.id}/create`);
    } else {
      formName === "formA"
        ? dispatch(updatedFormALifecycleState(LifeCycleState.Draft))
        : dispatch(updatedFormBLifecycleState(LifeCycleState.Draft));
      history.push(`${pathName}/new/create`);
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
      onClick={handleBtnClick}
      disabled={isFormDeleting}
    >
      {chooseBtnText(draftFormProps?.lifecycleState)}
    </Button>
  );
};

export default FormRListBtn;

function chooseBtnText(lifecycleState: LifeCycleState | undefined) {
  switch (lifecycleState) {
    case LifeCycleState.Draft:
      return "Edit saved draft form";
    case LifeCycleState.Unsubmitted:
      return "Edit unsubmitted form";
    default:
      return "Submit new form";
  }
}
