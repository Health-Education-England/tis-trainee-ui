import { Button, Checkboxes, Hint } from "nhsuk-react-components";
import { Modal } from "../../common/Modal";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ExpanderMsg } from "../../common/ExpanderMsg";

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
    madeCctCalc: false
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
        {`Before proceeding to the main Less than full-time (LTFT) application...`}
      </h2>
      <div>
        <Checkboxes>
          <Checkboxes.Box
            name="madeCctCalc"
            data-cy="madeCctCalc"
            checked={decValues.madeCctCalc}
            onChange={handleCheckboxChange}
          >
            I understand that a change to my full time working hours percentage
            will affect my programme completion date.
          </Checkboxes.Box>
          <Hint className="checkbox-hint">
            You can make a CCT Calculation using this{" "}
            <Link to="/cct">CCT Calculator</Link> to get a rough idea how
            changing your hours will affect your programme completion date.
          </Hint>
          <Checkboxes.Box
            name="discussedWithTpd"
            data-cy="discussedWithTpd"
            checked={decValues.discussedWithTpd}
            onChange={handleCheckboxChange}
          >
            {`I have discussed my proposed changes and the effect on my completion date with my pre-approver. They are aware of this application to change my hours.`}
          </Checkboxes.Box>
          <Hint className="checkbox-hint">
            <ExpanderMsg expanderName="preApproverInfo" />
            <p>
              Your pre-approver will usually be your Training Programme Director
              (TPD), but for GP programmes may be your GP Programme Manager. If
              you are unsure who your pre-approver is, please{" "}
              <Link to="/support" target="_blank">
                contact your Local Office support
              </Link>
              .
            </p>
          </Hint>
        </Checkboxes>
        <Button
          type="button"
          disabled={!decValues.discussedWithTpd || !decValues.madeCctCalc}
          onClick={onConfirm}
          data-cy="confirm-ltft-btn"
        >
          Confirm & proceed
        </Button>
      </div>
    </Modal>
  );
};
