import View from "./View";
import ScrollTo from "../ScrollTo";
import { Button, WarningCallout } from "nhsuk-react-components";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectSavedFormA } from "../../../redux/slices/formASlice";
import { Redirect } from "react-router-dom";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
import { useConfirm } from "material-ui-confirm";
import { FormRPartA } from "../../../models/FormRPartA";
import { useState } from "react";
import { dialogBoxWarnings } from "../../../utilities/Constants";
interface IConfirm {
  history: string[];
}

const Confirm = ({ history }: IConfirm) => {
  const confirm = useConfirm();
  const canEdit: boolean = true;
  const formData = useAppSelector(selectSavedFormA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubClick = (vals: FormRPartA) => {
    setIsSubmitting(false);
    confirm({
      description: dialogBoxWarnings.formSubMsg
    })
      .then(() => FormRUtilities.handleSubmitA(vals, history))
      .catch(() => {
        console.log("form a submit cancelled");
      });
  };

  if (!formData.traineeTisId) {
    return <Redirect to="/formr-a" />;
  }

  return (
    <div>
      <ScrollTo />
      <View canEdit={canEdit} history={history}></View>
      <WarningCallout data-cy="warningSubmit">
        <WarningCallout.Label visuallyHiddenText={false}>
          Warning
        </WarningCallout.Label>
        <p>
          By submitting this form, I confirm that the information above is
          correct and I will keep my Designated Body and the GMC informed as
          soon as possible of any change to my contact details.
        </p>
      </WarningCallout>

      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-two-thirds">
          <div className="nhsuk-grid-row">
            <div className="nhsuk-grid-column-one-third">
              <Button
                reverse
                data-cy="BtnEdit"
                onClick={() =>
                  FormRUtilities.historyPush(history, "/formr-a/create")
                }
              >
                Edit Form
              </Button>
            </div>
            <div className="nhsuk-grid-column-one-third">
              <Button
                secondary
                onClick={() => {
                  setIsSubmitting(true);
                  FormRUtilities.saveDraftA(formData, history);
                }}
                disabled={isSubmitting}
                data-cy="BtnSaveDraft"
              >
                Save for later
              </Button>
            </div>
            <div className="nhsuk-grid-column-one-third">
              <Button
                onClick={(e: { preventDefault: () => void }) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  handleSubClick(formData);
                }}
                disabled={isSubmitting}
                data-cy="BtnSubmit"
              >
                Submit Form
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
