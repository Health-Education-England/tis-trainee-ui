import { Button, Checkboxes, Hint } from "nhsuk-react-components";
import { Modal } from "../common/Modal";
import { useState } from "react";
import { Link } from "react-router-dom";

type LtftDeclarationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const LtftDeclarationsModal = ({
  isOpen,
  onClose,
  onConfirm
}: LtftDeclarationsModalProps) => {
  const [decValues, setDecValues] = useState<Record<string, boolean>>({
    discussedWithTpd: false,
    understandStartover: false
  });
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setDecValues(prevVals => ({
      ...prevVals,
      [name]: checked
    }));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 data-cy="ltft-declarations-modal-heading">
        Before proceeding to the main Changing hours (LTFT) application...
      </h2>
      <div>
        <Checkboxes>
          <Checkboxes.Box
            name="discussedWithTpd"
            data-cy="discussedWithTpd"
            checked={decValues.discussedWithTpd}
            onChange={handleCheckboxChange}
          >
            I have discussed the proposals outlined in the CCT Calculation with
            my Training Programme Director (TPD)
          </Checkboxes.Box>
          <Hint className="checkbox-hint">
            If you do not know who your TPD is, please{" "}
            <Link to="/support">contact your Local Office support</Link>
          </Hint>
          <Checkboxes.Box
            name="understandStartover"
            data-cy="understandStartover"
            checked={decValues.understandStartover}
            onChange={handleCheckboxChange}
          >
            I understand that if I proceed to the main Changing hours (LTFT)
            application, the CCT Calculation details copied over to this
            application will be for viewing only.
          </Checkboxes.Box>
          <Hint className="checkbox-hint">
            If you do proceed and then decide you want an application with
            different CCT Calculation details, you can 'start over' and choose
            another saved CCT Calculation from the list via the 'Make Changing
            hours (LTFT)' button.
          </Hint>
        </Checkboxes>
        <Button
          type="button"
          disabled={
            !decValues.discussedWithTpd || !decValues.understandStartover
          }
          onClick={onConfirm}
          data-cy="confirm-ltft-btn"
        >
          Confirm & proceed
        </Button>
      </div>
    </Modal>
  );
};
