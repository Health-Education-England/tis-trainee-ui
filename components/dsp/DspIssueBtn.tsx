import { Button, Label, SummaryList } from "nhsuk-react-components";
import store from "../../redux/store/store";
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
import { CredentialDsp } from "../../models/Dsp";
import { useConfirm } from "material-ui-confirm";
import { DateUtilities } from "../../utilities/DateUtilities";
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
  const confirm = useConfirm();
  const [isIssuing, setIsIssuing] = useState(false);
  const dispatch = useAppDispatch();
  const panelNameShort =
    panelName === TraineeProfileName.Programmes ? "programmes" : "placements";
  const credentials = store.getState().dsp.credentials;
  const matchedCredential = credentials.find(cred => cred.tisId === panelId);
  const matchRevoked = matchedCredential?.revokedAt;
  const matchIssued = matchedCredential?.issuedAt;
  const matchedCredTimestamp =
    matchedCredential && matchRevoked
      ? DateUtilities.ConvertToLondonTime(matchRevoked)
      : DateUtilities.ConvertToLondonTime(matchIssued);

  const credName = `${panelNameShort.slice(0, -1)} credential`;
  const cyTag = `${panelNameShort}-${panelId}`;
  const confirmMsg = `If you decide to add this ${credName} again, please remove the existing ${
    matchRevoked ? "revoked" : "issued"
  } credential from your wallet to avoid any confusion.`;

  const issueCredential = async () => {
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

  const handleClick = async () => {
    if (matchedCredential) {
      confirm({
        description: confirmMsg
      })
        .then(async () => {
          await issueCredential();
        })
        .catch(() => console.log("DSP issue cancelled"));
    } else await issueCredential();
  };

  return (
    <SummaryList.Row>
      <SummaryList.Key>
        <Label data-cy={`dsp-key-${cyTag}`}>
          <b>{"Digital Staff Passport (DSP)"}</b>
        </Label>
      </SummaryList.Key>
      <SummaryList.Value>
        {!isIssuing && (
          <span data-cy={`dsp-value-${cyTag}`}>
            {populateSummaryText(
              isPastDate,
              matchedCredTimestamp,
              credName,
              matchRevoked,
              matchIssued
            )}
          </span>
        )}
        {!isPastDate && (
          <Button
            disabled={isIssuing || isPastDate}
            className="dsp-btn_issue"
            secondary
            onClick={(e: { preventDefault: () => void }) => {
              e.preventDefault();
              handleClick();
            }}
            data-cy={`dsp-btn-${cyTag}`}
          >
            {populateButtonText(isIssuing, matchedCredential)}
          </Button>
        )}
      </SummaryList.Value>
    </SummaryList.Row>
  );
};

function chooseProfileArr(pName: string, id: string) {
  const profileArr =
    pName === TraineeProfileName.Programmes
      ? store.getState().traineeProfile.traineeProfileData.programmeMemberships
      : store.getState().traineeProfile.traineeProfileData.placements;
  const matchedIndex = profileArr.findIndex(
    (pObj: ProfileType) => pObj.tisId === id
  );
  const matchedProfile = profileArr[matchedIndex];

  if (matchedProfile) store.dispatch(updatedDspPanelObj(matchedProfile));
}

function populateButtonText(
  isIssuing: boolean,
  matchedCredential: CredentialDsp | undefined
) {
  if (isIssuing) {
    return "Please wait...";
  }
  if (matchedCredential) {
    return "Add to wallet again";
  }
  return "Add to wallet";
}

function populateSummaryText(
  isPastDate: boolean,
  matchedCredentialTimestamp: string,
  credentialName: string,
  matchRevoked: Date | null | undefined,
  matchIssued: Date | null | undefined
) {
  if (isPastDate) {
    return `A past ${credentialName} can't be added to your wallet`;
  }
  if (matchRevoked) {
    return `This ${credentialName} was revoked on ${matchedCredentialTimestamp}`;
  }
  if (matchIssued) {
    return `This ${credentialName} was added to your wallet on ${matchedCredentialTimestamp}`;
  }
  return `This ${credentialName} is not in your wallet`;
}
