import { useState } from "react";
import { Button } from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import history from "../navigation/history";
import { DateType } from "../../utilities/DateUtilities";
import { loadTheSavedForm } from "../../utilities/FormBuilderUtilities";
import { LifeCycleState } from "../../models/LifeCycleState";
import { FormLinkerModal } from "./form-linker/FormLinkerModal";
import store from "../../redux/store/store";
import {
  FormRUtilities,
  makeWarningText
} from "../../utilities/FormRUtilities";
import { LinkedFormRDataType } from "./form-linker/FormLinkerForm";

interface IFormsListBtn {
  pathName: string;
  latestSubDate: DateType;
}

const FormsListBtn = ({ pathName, latestSubDate }: IFormsListBtn) => {
  const [formKey, setFormKey] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const draftFormProps = useAppSelector(state => state.forms?.draftFormProps);
  const traineeProfileData = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );

  const handleBtnClick = () => {
    if (
      draftFormProps?.id &&
      draftFormProps?.lifecycleState !== LifeCycleState.Unsubmitted
    ) {
      loadTheSavedForm(pathName, draftFormProps.id, history);
    } else {
      setShowModal(true);
    }
  };

  const handleModalFormSubmit = (data: LinkedFormRDataType) => {
    const managingDeanery = store
      .getState()
      .traineeProfile.traineeProfileData.programmeMemberships.filter(
        prog => prog.tisId === data.linkedProgrammeUuid
      )[0].managingDeanery;
    const linkedFormRData = { ...data, managingDeanery };
    setShowModal(false);
    if (
      draftFormProps?.id &&
      draftFormProps.lifecycleState === LifeCycleState.Unsubmitted
    ) {
      loadTheSavedForm(pathName, draftFormProps?.id, history, linkedFormRData);
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
          linkedProgrammeUuid: null
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
