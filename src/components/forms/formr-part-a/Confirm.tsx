import View from "../View";
import ScrollTo from "../ScrollTo";
import { Button, WarningCallout } from "nhsuk-react-components";
import SubmitButton from "../SubmitButton";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  selectSavedForm,
  updatedFormA,
  updateForm,
  resetToInit
} from "../../../redux/slices/formASlice";
import { FormRPartA } from "../../../models/FormRPartA";
import store from "../../../redux/store/store";
import { LifeCycleState } from "../../../models/LifeCycleState";
import { fetchForms } from "../../../redux/slices/formsSlice";

interface IConfirm {
  history: any;
}

const Confirm = ({ history }: IConfirm) => {
  const canEdit: boolean = true;
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSavedForm);

  const handleEdit = () => history.push("/formr-a/create");

  const saveDraft = async (formData: FormRPartA) => {
    if (formData.lifecycleState !== LifeCycleState.Unsubmitted) {
      dispatch(
        updatedFormA({
          ...formData,
          submissionDate: null,
          lifecycleState: LifeCycleState.Draft,
          lastModifiedDate: new Date()
        })
      );
    } else
      dispatch(updatedFormA({ ...formData, lastModifiedDate: new Date() }));

    const updatedFormAData = store.getState().formA.formAData;
    await dispatch(updateForm(updatedFormAData));
    dispatch(fetchForms());
    history.push("/formr-a");
  };

  const handleSubmit = async (formData: FormRPartA) => {
    dispatch(
      updatedFormA({
        ...formData,
        submissionDate: new Date(),
        lifecycleState: LifeCycleState.Submitted,
        lastModifiedDate: new Date()
      })
    );
    const updatedFormAData = store.getState().formA.formAData;
    await dispatch(updateForm(updatedFormAData));
    dispatch(resetToInit());
    dispatch(fetchForms());
    history.push("/formr-a");
  };

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
              <Button onClick={() => handleEdit()}>Edit</Button>
            </div>
            <div className="nhsuk-grid-column-one-third">
              <SubmitButton
                label="Save & Exit"
                clickHandler={() => saveDraft(formData)}
                data-cy="BtnSaveDraft"
              />
            </div>
            <div className="nhsuk-grid-column-one-quarter">
              <SubmitButton
                type="submit"
                label="Submit"
                clickHandler={() => handleSubmit(formData)}
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
