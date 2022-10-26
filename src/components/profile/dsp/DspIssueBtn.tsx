import { Button } from "nhsuk-react-components";
import React from "react";
import { issueDspCredential } from "../../../redux/slices/traineeProfileSlice";
import store from "../../../redux/store/store";
import styles from "./Dsp.module.scss";

interface IDspIssueBtn {
  panelName: string;
  panelId: string;
  panelKey: number;
  isPastDate: boolean;
}

export const DspIssueBtn: React.FC<IDspIssueBtn> = ({
  panelName,
  panelId,
  panelKey,
  isPastDate
}) => {
  const cyTag = `dspBtn${panelName}${panelKey}`;
  let btnTxt: string = "";
  let isBtnDisabled: boolean = false;
  if (isPastDate) {
    btnTxt = `Past ${panelName}s can't be added to your Digital Staff Passport`;
    isBtnDisabled = true;
  } else
    btnTxt = `Click to add this ${panelName} to your Digital Staff Passport`;

  return (
    <div className={styles.btnDiv}>
      <Button
        className={styles.btn}
        secondary
        onClick={(e: { preventDefault: () => void }) => {
          e.preventDefault();
          store.dispatch(issueDspCredential({ panelId, panelName }));
        }}
        disabled={isBtnDisabled}
        data-cy={cyTag}
      >
        {btnTxt}
      </Button>
    </div>
  );
};
