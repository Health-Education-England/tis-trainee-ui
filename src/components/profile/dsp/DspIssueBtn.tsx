import { Button } from "nhsuk-react-components";
import React from "react";
import { issueDspCredential } from "../../../redux/slices/traineeProfileSlice";
import store from "../../../redux/store/store";
import styles from "./Dsp.module.scss";
import { useConfirm } from "material-ui-confirm";
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
  const confirm = useConfirm();
  const handleClick = () => {
    confirm({
      description: "Yes, I am me."
    })
      .then(() => store.dispatch(issueDspCredential({ panelId, panelName })))
      .catch(() => console.log("cancelled"));
  };
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
          handleClick();
        }}
        disabled={isBtnDisabled}
        data-cy={cyTag}
      >
        {btnTxt}
      </Button>
    </div>
  );
};
