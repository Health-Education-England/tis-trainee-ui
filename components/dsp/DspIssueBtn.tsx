import { Button } from "nhsuk-react-components";
import store from "../../redux/store/store";

import styles from "./Dsp.module.scss";
import history from "../navigation/history";
import { updatedDspPanelObj } from "../../redux/slices/dspSlice";
import { ProfileType, TraineeProfileName } from "../../models/TraineeProfile";
import { useLocation } from "react-router-dom";
import useLocalStorage from "../../utilities/hooks/useLocalStorage";
import { useEffect } from "react";

interface IDspIssueBtn {
  panelName: string;
  panelId: string;
  isPastDate: boolean;
}

export const DspIssueBtn: React.FC<IDspIssueBtn> = ({
  panelName,
  panelId,
  isPastDate
}) => {
  const currPath = useLocation().pathname;
  const [_currPathname, setCurrPathname] = useLocalStorage("currPathname", "");

  useEffect(() => {
    setCurrPathname(currPath);
  }, [currPath]);

  const panelNameShort =
    panelName === TraineeProfileName.Programmes ? "programmes" : "placements";

  const handleClick = () => {
    history.push(`${panelNameShort}/dsp`);
    // store matched panel data
    chooseProfileArr(panelName, panelId);
    // TODO
    // issuing cred using stored matched panel data
    // return to current path in local storage to return to later
  };
  const cyTag = `dspBtn${panelName}${panelId}`;
  let btnTxt: string = "";
  let isBtnDisabled: boolean = false;
  if (isPastDate) {
    btnTxt = `Past ${panelNameShort} can't be added to your Digital Staff Passport`;
    isBtnDisabled = true;
  } else
    btnTxt = `Click to add this ${panelNameShort.slice(
      0,
      -1
    )} to your Digital Staff Passport`;

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

function chooseProfileArr(pName: string, id: string) {
  const profileArr: any =
    pName === TraineeProfileName.Programmes
      ? store.getState().traineeProfile.traineeProfileData.programmeMemberships
      : store.getState().traineeProfile.traineeProfileData.placements;
  const matchedProfileObj = profileArr.filter(
    (pObj: ProfileType) => pObj.tisId === id
  );
  if (matchedProfileObj) store.dispatch(updatedDspPanelObj(matchedProfileObj));
}
