import { Button } from "nhsuk-react-components";
import store from "../../redux/store/store";
import styles from "./Dsp.module.scss";
import history from "../navigation/history";
import {
  issueDspCredential,
  updatedDspIsIssuing,
  updatedDspPanelObj,
  updatedDspPanelObjName,
  updatedDspStateId
} from "../../redux/slices/dspSlice";
import { ProfileType, TraineeProfileName } from "../../models/TraineeProfile";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { nanoid } from "nanoid";

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
    // create and store the stateid here so we can use the same one throughout the issue -> verify -> issue journey.
    const stateId = nanoid();
    dispatch(updatedDspStateId(stateId));
    dispatch(updatedDspIsIssuing(true));
    dispatch(updatedDspPanelObjName(panelNameShort));
    chooseProfileArr(panelName, panelId);
    const issueName = panelNameShort.slice(0, -1);
    await dispatch(issueDspCredential(issueName));
    history.push("/credential");
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
