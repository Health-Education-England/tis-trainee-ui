import { Modal } from "./Modal";
import { Button, WarningCallout } from "nhsuk-react-components";
import { Form, Formik } from "formik";
import MultiChoiceInputField from "../forms/MultiChoiceInputField";
import TextInputField from "../forms/TextInputField";
import { ACTION_REASONS } from "../../utilities/Constants";

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
  isSubmitting = false
}: Readonly<ActionModalProps>) {
  const hasReason = actionType === "Unsubmit" || actionType === "Withdraw";

  return (
    <Modal isOpen={isOpen} onClose={onClose} cancelBtnText={cancelBtnText}>
      <WarningCallout data-cy="actionModalWarning">
        <WarningCallout.Label
          visuallyHiddenText={false}
          data-cy={`warningLabel-${warningLabel}`}
        >
          {warningLabel}
        </WarningCallout.Label>
        <p data-cy={`warningText-${warningLabel}`}>{warningText}</p>
      </WarningCallout>
      <Formik initialValues={{ reason: "", message: "" }} onSubmit={onSubmit}>
        {({ values }) => (
          <Form>
            {hasReason && (
              <>
                <MultiChoiceInputField
                  name="reason"
                  type="radios"
                  items={
                    actionType === "Unsubmit"
                      ? [...ACTION_REASONS.UNSUBMIT]
                      : [...ACTION_REASONS.WITHDRAW]
                  }
                  label={`Please choose the primary reason for the ${actionType.toLowerCase()}`}
                  id="reason"
                />
                <TextInputField
                  name="message"
                  id="message"
                  label="Please provide any supplementary information if needed"
                  placeholder="Enter details here..."
                  width="300px"
                  rows={3}
                />
              </>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || (hasReason && !values.reason)}
              data-cy={`submitBtn-${warningLabel}`}
            >
              {isSubmitting ? `${submittingBtnText}...` : "Confirm & Continue"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
