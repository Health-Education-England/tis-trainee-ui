import { Button } from "nhsuk-react-components";
import store from "../../redux/store/store";
import styles from "./Dsp.module.scss";
import history from "../navigation/history";
import {
  issueDspCredential,
  resetDspSlice,
  updatedDspPanelObj,
  updatedDspPanelObjName
} from "../../redux/slices/dspSlice";
import { ProfileType, TraineeProfileName } from "../../models/TraineeProfile";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { nanoid } from "nanoid";
import { useState } from "react";
import { ToastType, showToast } from "../common/ToastMessage";

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
  const [isIssuing, setIsIssuing] = useState(false);
  const dispatch = useAppDispatch();
  const panelNameShort =
    panelName === TraineeProfileName.Programmes ? "programmes" : "placements";

  const handleClick = async () => {
    setIsIssuing(true);
    const stateId = nanoid();
    dispatch(updatedDspPanelObjName(panelNameShort));
    chooseProfileArr(panelName, panelId);
    const issueName = panelNameShort.slice(0, -1);
    await dispatch(issueDspCredential({ issueName, stateId }));
    const dspErrorCode = store.getState().dsp.errorCode;
    const dspErrorText = store.getState().dsp.error;
    const dspSuccessCode = store.getState().dsp.successCode;

    if (dspSuccessCode === 201) {
      history.push("/credential/issue");
    }
    if (dspErrorCode === "401") {
      localStorage.removeItem(stateId);
      history.push("/credential/verify");
    }
    if (dspErrorCode && dspErrorCode !== "401") {
      localStorage.removeItem(stateId);
      const dspToastText = "Something went wrong issuing the DSP credential";
      showToast(dspToastText, ToastType.ERROR, dspErrorText);
      dispatch(resetDspSlice());
    }
  };

  const cyTag = `dspBtn${panelName}${panelId}`;
  let btnTxt: string = "";
  if (isPastDate) {
    btnTxt = `Past ${panelNameShort} can't be added to your Digital Staff Passport`;
  } else
    btnTxt = isIssuing
      ? "Please wait..."
      : `Click to add this ${panelNameShort.slice(
          0,
          -1
        )} to your Digital Staff Passport`;

  return (
    <div className={styles.btnDiv}>
      <Button
        disabled={isIssuing || isPastDate}
        className={styles.btn}
        secondary
        onClick={(e: { preventDefault: () => void }) => {
          e.preventDefault();
          handleClick();
        }}
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
