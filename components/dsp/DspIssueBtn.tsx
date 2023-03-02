import { Button } from "nhsuk-react-components";
import store from "../../redux/store/store";
import styles from "./Dsp.module.scss";
import history from "../navigation/history";
import {
  issueDspCredential,
  updatedDspPanelObj,
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
  const currPath = useLocation().pathname;
  const [_currPathname, setCurrPathname] = useLocalStorage("currPathname", "");

  useEffect(() => {
    setCurrPathname(currPath);
  }, [currPath]);

  const panelNameShort =
    panelName === TraineeProfileName.Programmes ? "programmes" : "placements";

  const handleClick = async () => {
    history.push(`${panelNameShort}/dsp`);
    chooseProfileArr(panelName, panelId);
    const storedPanelData = store.getState().dsp.dspPanelObj;
    const issueName = panelNameShort.slice(0, -1);
    await dispatch(issueDspCredential({ issueName, storedPanelData }));
    const issueUri = store.getState().dsp.gatewayUri;

    if (issueUri) {
      window.location.href = issueUri;
    } else if (store.getState().dsp.errorCode === "401"){
      console.log("Identity verification required.");
      const storedPersonalData = store.getState().traineeProfile.traineeProfileData.personalDetails;
      await dispatch(verifyDspIdentity({storedPersonalData}));
      const verifyUri = store.getState().dsp.gatewayUri;

      if (verifyUri) {
        window.location.href = verifyUri;
      } else {
        console.log("Identity verification failed.")
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
  );
  if (matchedProfile) store.dispatch(updatedDspPanelObj(matchedProfile[0]));
}
