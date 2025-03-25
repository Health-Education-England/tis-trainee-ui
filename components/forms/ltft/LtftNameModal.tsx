import { Modal } from "../../common/Modal";
import { Button, WarningCallout } from "nhsuk-react-components";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";

type LtftNameModalProps = {
  onSubmit: () => void;
  isOpen: boolean;
  onClose: () => void;
};

export function LtftNameModal({
  onSubmit,
  isOpen,
  onClose
}: Readonly<LtftNameModalProps>) {
  const { isSubmitting } = useSubmitting();
  return (
    <Modal isOpen={isOpen} onClose={onClose} cancelBtnText="Cancel">
      <form>
        <WarningCallout data-cy="ltftModalWarning">
          <WarningCallout.Label visuallyHiddenText={false}>
            Important
          </WarningCallout.Label>
          <p>
            Please check the details of the form carefully before submission.
            Are you sure you want to submit it?
          </p>
        </WarningCallout>
        <Button
          onClick={onSubmit}
          type="button"
          disabled={isSubmitting}
          data-cy="ltft-modal-save-btn"
        >
          {isSubmitting ? "Submitting..." : "Confirm & Continue"}
        </Button>
      </form>
    </Modal>
  );
}
