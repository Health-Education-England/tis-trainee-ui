import { useEffect, useState } from "react";
import { Button } from "nhsuk-react-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import history from "../navigation/history";
import { DateType } from "../../utilities/DateUtilities";
import {
  loadTheSavedForm,
  resetForm
} from "../../utilities/FormBuilderUtilities";
import { LifeCycleState } from "../../models/LifeCycleState";
import { FormLinkerModal } from "./form-linker/FormLinkerModal";
import {
  FormRUtilities,
  makeWarningText,
  processLinkedFormData
} from "../../utilities/FormRUtilities";
import { LinkedFormRDataType } from "./form-linker/FormLinkerForm";
import { updatedSaveStatus } from "../../redux/slices/formASlice";
import { updatedSaveStatusB } from "../../redux/slices/formBSlice";

interface IFormsListBtn {
  pathName: string;
  latestSubDate: DateType;
}

const FormsListBtn = ({ pathName, latestSubDate }: IFormsListBtn) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const draftFormProps = useAppSelector(state => state.forms?.draftFormProps);
  const traineeProfileData = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );
  const formName = pathName.split("/")[1] === "formr-a" ? "formA" : "formB";
  const isFormDeleting = useAppSelector(
    state => state[formName].status === "deleting"
  );

  useEffect(() => {
    resetForm(formName);
  }, [formName]);

  const handleBtnClick = async () => {
    // NOTE: this is needed for edge case where stale state from race between form click save event & redirect and auto update event.
    if (formName === "formA") {
      dispatch(updatedSaveStatus("idle"));
    } else {
      dispatch(updatedSaveStatusB("idle"));
    }
    if (
      draftFormProps?.id &&
      draftFormProps?.lifecycleState === LifeCycleState.Draft
    ) {
      history.push(`${pathName}/${draftFormProps.id}/create`);
    } else {
      // Show modal for NEW and UNSUBMITTED
      setShowModal(true);
    }
  };

  const handleModalFormSubmit = (data: LinkedFormRDataType) => {
    // TODO NEXT: refactor this.
    // 1. Existing form (with id): The idea is to have the linkedFormData in state for when the formData is fetched and then populate.
    // 2. New form: probably keep the same (although may rename the loadNewForm for clarity).
    const processedFormRData = processLinkedFormData(
      data,
      traineeProfileData.programmeMemberships
    );

    setShowModal(false);
    if (draftFormProps?.id) {
      history.push(`${pathName}/${draftFormProps.id}/create`);
    } else {
      // FormRUtilities.loadNewForm(
      //   pathName,
      //   traineeProfileData,
      //   processedFormRData
      // );
      history.push(`${pathName}/new/create`);
    }
  };

  const handleModalFormClose = () => {
    setShowModal(false);
    setFormKey(Date.now());
  };

  const warningText = makeWarningText("new", latestSubDate);

  return (
    <>
      <Button
        id="btnOpenForm"
        data-cy={
          draftFormProps?.lifecycleState
            ? `btn-${chooseBtnText(draftFormProps?.lifecycleState)}`
            : "Submit new form"
        }
        type="submit"
        onClick={handleBtnClick}
        disabled={isSubmitting || isFormDeleting}
      >
        {chooseBtnText(draftFormProps?.lifecycleState)}
      </Button>
      <FormLinkerModal
        key={formKey}
        onSubmit={handleModalFormSubmit}
        isOpen={showModal}
        onClose={handleModalFormClose}
        warningText={warningText}
        linkedFormData={{
          isArcp: null,
          programmeMembershipId: null
        }}
      />
    </>
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
