import { useState } from "react";
import { Button } from "nhsuk-react-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import history from "../navigation/history";
import { DateType } from "../../utilities/DateUtilities";
import { loadTheSavedForm } from "../../utilities/FormBuilderUtilities";
import { LifeCycleState } from "../../models/LifeCycleState";
import { FormLinkerModal } from "./form-linker/FormLinkerModal";
import {
  filterManagingDeanery,
  FormRUtilities,
  getLinkedProgrammeDetails,
  makeWarningText
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

  const handleBtnClick = async () => {
    // NOTE: this is needed for edge case where stale state from race between form click save event & redirect and auto update event.
    if (formName === "formA") {
      dispatch(updatedSaveStatus("idle"));
    } else {
      dispatch(updatedSaveStatusB("idle"));
    }
    setIsSubmitting(true);
    if (draftFormProps?.id && draftFormProps?.programmeMembershipId) {
      await loadTheSavedForm(pathName, draftFormProps.id, history);
    } else {
      setShowModal(true);
    }
    setIsSubmitting(false);
  };

  const handleModalFormSubmit = (data: LinkedFormRDataType) => {
    const localOfficeName = filterManagingDeanery(
      data.programmeMembershipId as string
    );
    const linkedProgramme =
      getLinkedProgrammeDetails(
        traineeProfileData.programmeMemberships,
        data.programmeMembershipId
      ) ?? undefined;
    const linkedFormRData = { ...data, localOfficeName, linkedProgramme };
    setShowModal(false);
    if (draftFormProps?.id) {
      loadTheSavedForm(pathName, draftFormProps?.id, history, linkedFormRData); // UNSUBMITTED
    } else {
      FormRUtilities.loadNewForm(
        pathName,
        history,
        traineeProfileData,
        linkedFormRData
      );
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
