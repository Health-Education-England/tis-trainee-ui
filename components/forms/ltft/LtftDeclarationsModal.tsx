import { Button, Checkboxes, Details, HintText } from "nhsuk-react-components";
import { Modal } from "../../common/Modal";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@aws-amplify/ui-react";

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
        {`Before proceeding to the main Changing hours (LTFT) application...`}
      </h2>
      <div>
        <Checkboxes
          data-cy="ltft-declarations-checkboxes"
          className="ltft-declarations-checkboxes"
          onChange={handleCheckboxChange}
        >
          <Checkboxes.Item
            labelProps={""}
            hint="your pre-approver will..."
            hintProps={""}
            name="discussedWithTpd"
            data-cy="discussedWithTpd"
            checked={decValues.discussedWithTpd}
          >
            I have discussed the proposal outlined in the CCT calculation with
            my pre-approver.
          </Checkboxes.Item>

          {/* <Checkboxes.Box
            name="discussedWithTpd"
            data-cy="discussedWithTpd"
            checked={decValues.discussedWithTpd}
            onChange={handleCheckboxChange}
          >
            {`I have discussed the proposal outlined in the CCT calculation with my pre-approver.`}
          </Checkboxes.Box> */}
          {/* <HintText className="checkbox-hint">
            <p>
              Your pre-approver will usually be your Training Programme Director
              (TPD), but for GP programmes may be your GP Programme Manager. If
              you are unsure who your pre-approver is, please{" "}
              <Link to="/support" target="_blank">
                contact your Local Office support
              </Link>
              .
            </p>
            <Details>
              <Details.Summary data-cy="dataSourceSummary">
                What should I discuss with my pre-approver?
              </Details.Summary>
              <Details.Text data-cy="dataSourceText">
                <p>
                  Before submitting your LTFT application, you must have a
                  discussion with your Training Programme Director (TPD) or
                  Primary Approver. This conversation ensures your request
                  supports both your personal circumstances and your training
                  progression.
                </p>
                <p>During this discussion, you should cover:</p>
                <ul>
                  <ul>
                    <li>
                      Your reason(s) for requesting LTFT (e.g. caring
                      responsibilities, health, professional development,
                      wellbeing).
                    </li>
                    <li>
                      The proposed working pattern (e.g. 60%, 80% WTE, expected
                      days per week).
                    </li>
                    <li>
                      Impact on training progression, pay changes and completion
                      dates.
                    </li>
                    <li>Planned start date and notice period.</li>
                    <li>Any support or adjustments you may need.</li>
                  </ul>
                  <p>
                    The purpose of this discussion is to ensure understanding
                    and support within your training programme.
                  </p>
                </ul>
              </Details.Text>
            </Details>
          </HintText> */}
          {/* <Checkboxes.Box
            name="understandStartover"
            data-cy="understandStartover"
            checked={decValues.understandStartover}
            onChange={handleCheckboxChange}
          >
            {`I understand that if I proceed to the main Changing hours (LTFT)
            application, a copy of these CCT Calculation details will be used for this application.`}
          </Checkboxes.Box> */}
          {/* <HintText className="checkbox-hint">
            {`If you do proceed but later want to use different CCT Calculation
            details for your LTFT application, you will be able to discard your
            current application. You can then restart the process by choosing CCT Calculation details for your new LTFT application from your list of saved calculations via the 'Apply for Changing hours
            (LTFT)' button.`}
          </HintText> */}
        </Checkboxes>
        <Button
          as="button"
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
