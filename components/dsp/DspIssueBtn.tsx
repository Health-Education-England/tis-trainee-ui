import { Button } from "nhsuk-react-components";
import store from "../../redux/store/store";
import styles from "./Dsp.module.scss";
import history from "../navigation/history";
import {
  issueDspCredential,
  updatedDspIsIssuing,
  updatedDspPanelObj,
  updatedDspPanelObjName,
  verifyDspIdentity
} from "../../redux/slices/dspSlice";
import { ProfileType, TraineeProfileName } from "../../models/TraineeProfile";
import { useLocation } from "react-router-dom";
import useLocalStorage from "../../utilities/hooks/useLocalStorage";
import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks/hooks";

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
  const dispatch = useAppDispatch();
  const panelNameShort =
    panelName === TraineeProfileName.Programmes ? "programmes" : "placements";

  const handleClick = async () => {
    dispatch(updatedDspIsIssuing());
    dispatch(updatedDspPanelObjName(panelNameShort));
    chooseProfileArr(panelName, panelId);
    const issueName = panelNameShort.slice(0, -1);
    await dispatch(issueDspCredential(issueName));
    // history.push(`${panelNameShort}/dsp`);
    const issueUri = store.getState().dsp.gatewayUri;

    if (issueUri) {
      window.location.href = issueUri;
    } else if (store.getState().dsp.errorCode === "401") {
      console.log("Identity verification required.");
      await dispatch(verifyDspIdentity());
      const verifyUri = store.getState().dsp.gatewayUri;

      if (verifyUri) {
        window.location.href = verifyUri;
      } else {
        console.log("Identity verification failed.");
      }
    } else {
      console.log("Unknown error occured.");
    }
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
  const matchedProfile = profileArr.filter(
    (pObj: ProfileType) => pObj.tisId === id
  )[0];
  if (matchedProfile) store.dispatch(updatedDspPanelObj(matchedProfile));
}
