import View from "./View";
import ScrollTo from "../ScrollTo";
import { Button, WarningCallout } from "nhsuk-react-components";
import SubmitButton from "../SubmitButton";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectSavedFormA } from "../../../redux/slices/formASlice";
import { Redirect } from "react-router-dom";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
interface IConfirm {
  history: string[];
}

const Confirm = ({ history }: IConfirm) => {
  const canEdit: boolean = true;
  const formData = useAppSelector(selectSavedFormA);

  if (!formData.traineeTisId) {
    return <Redirect to="/formr-a" />;
  }

  return (
    <div>
      <ScrollTo />
      <View canEdit={canEdit} history={history}></View>
      <WarningCallout data-cy="warningSubmit" label="Warning">
        <p>
          By submitting this form, I confirm that the information above is
          correct and I will keep my Designated Body and the GMC informed as
          soon as possible of any change to my contact details.
        </p>
      </WarningCallout>

      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-two-thirds">
          <div className="nhsuk-grid-row">
            <div className="nhsuk-grid-column-one-quarter">
              <Button
                data-cy="BtnEdit"
                onClick={() =>
                  FormRUtilities.historyPush(history, "/formr-a/create")
                }
              >
                Edit
              </Button>
            </div>
            <div className="nhsuk-grid-column-one-third">
              <SubmitButton
                label="Save & Exit"
                clickHandler={() => {
                  FormRUtilities.saveDraftA(formData, history);
                }}
                data-cy="BtnSaveDraft"
              />
            </div>
            <div className="nhsuk-grid-column-one-quarter">
              <SubmitButton
                type="submit"
                label="Submit"
                clickHandler={() =>
                  FormRUtilities.handleSubmitA(formData, history)
                }
                data-cy="BtnSubmit"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
