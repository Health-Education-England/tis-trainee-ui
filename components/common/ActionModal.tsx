import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import {
  Button,
  Radios,
  Textarea,
  WarningCallout
} from "nhsuk-react-components";
import { ACTION_REASONS } from "../../utilities/Constants";
import { handleKeyDown } from "../../utilities/FormBuilderUtilities";

export type ActionType = "Save" | "Submit" | "Unsubmit" | "Withdraw" | "Delete";

export type ReasonMsgObj = {
  reason: string;
  message: string;
};

type ActionModalProps = {
  onSubmit: (values?: ReasonMsgObj) => void;
  isOpen: boolean;
  onClose: () => void;
  cancelBtnText: string;
  warningLabel: string;
  warningText: string;
  submittingBtnText: string;
  actionType?: ActionType;
  isSubmitting: boolean;
  additionalInfo?: string;
};

export function ActionModal({
  onSubmit,
  isOpen,
  onClose,
  cancelBtnText,
  warningLabel,
  warningText,
  submittingBtnText,
  actionType,
  isSubmitting = false,
  additionalInfo
}: Readonly<ActionModalProps>) {
  const hasReason = actionType === "Unsubmit" || actionType === "Withdraw";
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setMessage("");
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} cancelBtnText={cancelBtnText}>
      <WarningCallout data-cy="actionModalWarning">
        <WarningCallout.Heading
          visuallyHiddenText=""
          data-cy={`warningLabel-${warningLabel}`}
        >
          {warningLabel}
        </WarningCallout.Heading>
        <p data-cy={`warningText-${warningLabel}`}>{warningText}</p>
        {additionalInfo && <p data-cy="additionalInfo">{additionalInfo}</p>}
      </WarningCallout>
      <div>
        {hasReason && (
          <>
            <div className="nhsuk-form-group">
              <p className="nhsuk-body-m nhsuk-u-margin-bottom-1">
                {`Please choose the primary reason for the ${actionType.toLowerCase()}`}
              </p>
              <Radios name="reason" data-cy="reason" id="reason" error="">
                {(actionType === "Unsubmit"
                  ? ACTION_REASONS.UNSUBMIT
                  : ACTION_REASONS.WITHDRAW
                ).map((item, index) => (
                  <Radios.Item
                    key={item.value}
                    value={item.value}
                    data-cy={`reason${index}`}
                    checked={reason === item.value}
                    onChange={() => setReason(item.value)}
                  >
                    {item.label}
                  </Radios.Item>
                ))}
              </Radios>
            </div>
            <div className="nhsuk-form-group">
              <Textarea
                autoComplete="off"
                name="message"
                id="message"
                data-cy="message"
                onKeyDown={handleKeyDown}
                label="Please provide any supplementary information if needed"
                placeholder="Enter details here..."
                rows={3}
                error=""
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMessage(e.target.value)
                }
              />
            </div>
          </>
        )}
        <Button
          type="button"
          onClick={() => onSubmit({ reason, message })}
          disabled={isSubmitting || (hasReason && !reason)}
          data-cy={`submitBtn-${warningLabel}`}
        >
          {isSubmitting ? `${submittingBtnText}...` : "Confirm & Continue"}
        </Button>
      </div>
    </Modal>
  );
}
