import { Modal } from "./Modal";
import { Button, WarningCallout } from "nhsuk-react-components";
import { useSubmitting } from "../../utilities/hooks/useSubmitting";

export type ActionType = "Save" | "Submit" | "Unsubmit" | "Withdraw" | "Delete";

type ActionModalProps = {
  onSubmit: () => void;
  isOpen: boolean;
  onClose: () => void;
  cancelBtnText: string;
  warningLabel: string;
  warningText: string;
  submittingBtnText: string;
};

export function ActionModal({
  onSubmit,
  isOpen,
  onClose,
  cancelBtnText,
  warningLabel,
  warningText,
  submittingBtnText
}: Readonly<ActionModalProps>) {
  const { isSubmitting } = useSubmitting();
  return (
    <Modal isOpen={isOpen} onClose={onClose} cancelBtnText={cancelBtnText}>
      <form>
        <WarningCallout data-cy="actionModalWarning">
          <WarningCallout.Label visuallyHiddenText={false}>
            {warningLabel}
          </WarningCallout.Label>
          <p>{warningText}</p>
          <p> Are you sure you want to continue?</p>.
        </WarningCallout>
        <Button
          onClick={onSubmit}
          type="button"
          disabled={isSubmitting}
          data-cy="ltft-action-modal-btn"
        >
          {isSubmitting ? `${submittingBtnText}...` : "Confirm & Continue"}
        </Button>
      </form>
    </Modal>
  );
}
