import { Button } from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import history from "../navigation/history";
import { LifeCycleState } from "../../models/LifeCycleState";

type FormsListBtnType = {
  pathName: string;
};

const FormsListBtn = ({ pathName }: FormsListBtnType) => {
  const draftFormProps = useAppSelector(state => state.forms?.draftFormProps);
  const formName = pathName.split("/")[1] === "formr-a" ? "formA" : "formB";
  const isFormDeleting = useAppSelector(
    state => state[formName].status === "deleting"
  );

  const handleBtnClick = async () => {
    if (draftFormProps?.id) {
      history.push(`${pathName}/${draftFormProps.id}/create`);
    } else {
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

export default FormsListBtn;

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
