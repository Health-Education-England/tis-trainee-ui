import { useState } from "react";
import { Link } from "react-router-dom";
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
  formRInProgressWarningText
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
  const [formInProgress, setFormInProgress] = useState<DraftFormProps | null>(
    null
  );

  const basePath = formType === "A" ? "/formr-a" : "/formr-b";
  const isUnsubmitted =
    formInProgress?.lifecycleState === LifeCycleState.Unsubmitted;

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (isChecking) return;
    setIsChecking(true);

    try {
      setFormInProgress(
        await openPrefilledFormR(formType, programmeMembershipId)
      );
    } catch {
      history.push(basePath);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <Link
        to={basePath}
        onClick={handleClick}
        data-cy={`formRPrefillLink-${formType}`}
      >
        {label}
      </Link>
      {formInProgress && (
        <Modal
          isOpen={true}
          onClose={() => setFormInProgress(null)}
          cancelBtnText="Close"
        >
          <WarningCallout data-cy="formRInProgressWarning">
            <WarningCallout.Heading
              visuallyHiddenText=""
              data-cy="formRInProgressLabel"
            >
              {formRInProgressWarningLabel}
            </WarningCallout.Heading>
            <p data-cy="formRInProgressText">
              {formRInProgressWarningText(formType, isUnsubmitted)}
            </p>
          </WarningCallout>
          <div className="nhsuk-button-group">
            <Button
              type="button"
              data-cy="goToFormInProgressBtn"
              onClick={() =>
                history.push(
                  `${basePath}/${formInProgress.id}/${
                    isUnsubmitted ? "view" : "create"
                  }`
                )
              }
            >
              {isUnsubmitted
                ? "Edit unsubmitted form"
                : "Edit saved draft form"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
