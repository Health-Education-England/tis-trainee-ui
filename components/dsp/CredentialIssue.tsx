import { Button, WarningCallout } from "nhsuk-react-components";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  updatedDspPanelObj,
  updatedDspPanelObjName
} from "../../redux/slices/dspSlice";
import store from "../../redux/store/store";
import Loading from "../common/Loading";
import DSPPanel from "./DSPPanel";
import { handleIssueCredential } from "../../utilities/DspUtilities";

const CredentialIssue: React.FC = () => {
  const [isIssuing, setIsIssuing] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams?.get("state");
  const storedPanelName = store.getState().dsp.dspPanelObjName;
  const storedPanelData = store.getState().dsp.dspPanelObj;
  const issueUri = store.getState().dsp.gatewayUri;
  let content = <></>;

  if (isIssuing) {
    return <Loading />;
  }

  if (issueUri) {
    content = (
      <WarningCallout>
        <WarningCallout.Label
          visuallyHiddenText={false}
          data-cy="dspIssueWarningLabel"
        >
          Important
        </WarningCallout.Label>
        <p data-cy="dspIssueWarningText">
          You are about to issue this credential to your DSP wallet.
        </p>
        <DSPPanel profName={storedPanelName} profData={storedPanelData} />
        <Button
          disabled={isIssuing}
          onClick={() => {
            setIsIssuing(true);
            window.location.href = issueUri;
          }}
          data-cy="dspIssueCredBtn"
        >
          Add credential to wallet
        </Button>
      </WarningCallout>
    );
  }

  if (!issueUri && stateParam) {
    const savedState = localStorage.getItem(stateParam);
    if (savedState) {
      const currSessionState = JSON.parse(savedState);
      store.dispatch(updatedDspPanelObj(currSessionState.panelData));
      store.dispatch(updatedDspPanelObjName(currSessionState.panelName));
      const storedPanelData = store.getState().dsp.dspPanelObj;
      const storedPanelName = store.getState().dsp.dspPanelObjName;
      content = (
        <WarningCallout>
          <WarningCallout.Label
            visuallyHiddenText={false}
            data-cy="dspVerifiedWarningLabel"
          >
            Success
          </WarningCallout.Label>
          <p data-cy="dspVerifiedWarningText">
            Your ID has been verified and you can now add this credential to
            your DSP wallet.
          </p>
          <DSPPanel profName={storedPanelName} profData={storedPanelData} />
          <Button
            disabled={isIssuing}
            onClick={async () => {
              setIsIssuing(true);
              const newIssueUri = await handleIssueCredential(
                stateParam,
                storedPanelName
              );
              if (newIssueUri) window.location.href = newIssueUri;
            }}
            data-cy="dspIssueCredBtn"
          >
            Add credential to wallet
          </Button>
        </WarningCallout>
      );
    }
  }
  return content;
};

export default CredentialIssue;
