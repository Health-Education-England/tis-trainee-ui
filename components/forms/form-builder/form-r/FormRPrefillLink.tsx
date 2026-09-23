import { useState } from "react";
import { Button, WarningCallout } from "nhsuk-react-components";
import {
  DraftFormProps,
  openPrefilledFormR
} from "../../../../utilities/FormBuilderUtilities";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import history from "../../../navigation/history";
import { Modal } from "../../../common/Modal";
import {
  formRInProgressWarningLabel,
  formRInProgressWarningText,
  formRLoadErrorWarningLabel,
  formRLoadErrorWarningText
} from "../../../../utilities/Constants";

type FormRPrefillLinkProps = {
  formType: "A" | "B";
  programmeMembershipId: string;
  label: string;
};

export function FormRPrefillLink({
  formType,
  programmeMembershipId,
  label
}: Readonly<FormRPrefillLinkProps>) {
  const [isChecking, setIsChecking] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [formInProgress, setFormInProgress] = useState<DraftFormProps | null>(
    null
  );

  const basePath = formType === "A" ? "/formr-a" : "/formr-b";
  const isUnsubmitted =
    formInProgress?.lifecycleState === LifeCycleState.Unsubmitted;

  const checkForFormInProgress = async () => {
    if (isChecking) return;
    setIsChecking(true);
    setHasLoadError(false);

    try {
      setFormInProgress(
        await openPrefilledFormR(formType, programmeMembershipId)
      );
    } catch {
      setHasLoadError(true);
    } finally {
      setIsChecking(false);
    }
  };

  const modalContent = formInProgress ? (
    <ModalWarning
      name="formRInProgress"
      label={formRInProgressWarningLabel}
      text={formRInProgressWarningText(formType, isUnsubmitted)}
      btnDataCy="goToFormInProgressBtn"
      btnText={
        isUnsubmitted ? "Edit unsubmitted form" : "Edit saved draft form"
      }
      onBtnClick={() =>
        history.push(
          `${basePath}/${formInProgress.id}/${
            isUnsubmitted ? "view" : "create"
          }`
        )
      }
    />
  ) : (
    <ModalWarning
      name="formRLoadError"
      label={formRLoadErrorWarningLabel}
      text={formRLoadErrorWarningText}
      btnDataCy="retryFormRCheckBtn"
      btnText="Try again"
      isBtnDisabled={isChecking}
      onBtnClick={checkForFormInProgress}
    />
  );

  return (
    <>
      <button
        type="button"
        className="link-button"
        onClick={checkForFormInProgress}
        data-cy={`formRPrefillLink-${formType}`}
      >
        {label}
      </button>
      {(formInProgress || hasLoadError) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setFormInProgress(null);
            setHasLoadError(false);
          }}
          cancelBtnText="Close"
        >
          {modalContent}
        </Modal>
      )}
    </>
  );
}

type ModalWarningProps = {
  name: string;
  label: string;
  text: string;
  btnDataCy: string;
  btnText: string;
  isBtnDisabled?: boolean;
  onBtnClick: () => void;
};

function ModalWarning({
  name,
  label,
  text,
  btnDataCy,
  btnText,
  isBtnDisabled,
  onBtnClick
}: Readonly<ModalWarningProps>) {
  return (
    <>
      <WarningCallout data-cy={`${name}Warning`}>
        <WarningCallout.Heading visuallyHiddenText="" data-cy={`${name}Label`}>
          {label}
        </WarningCallout.Heading>
        <p data-cy={`${name}Text`}>{text}</p>
      </WarningCallout>
      <div className="nhsuk-button-group">
        <Button
          type="button"
          data-cy={btnDataCy}
          disabled={isBtnDisabled}
          onClick={onBtnClick}
        >
          {btnText}
        </Button>
      </div>
    </>
  );
}
