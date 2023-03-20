import { nanoid } from "nanoid";
import { Button, WarningCallout } from "nhsuk-react-components";
import { useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import {
  issueDspCredential,
  updatedDspPanelObj,
  updatedDspPanelObjName
} from "../../redux/slices/dspSlice";
import store from "../../redux/store/store";
import Loading from "../common/Loading";
import DSPPanel from "./DSPPanel";

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
        <WarningCallout.Label visuallyHiddenText={false}>
          Important
        </WarningCallout.Label>
        <p>You are about to issue this credential to your DSP wallet.</p>
        <DSPPanel profName={storedPanelName} profData={storedPanelData} />
        <Button
          disabled={isIssuing ? true : false}
          onClick={() => {
            setIsIssuing(true);
            window.location.href = issueUri;
          }}
          data-cy="dspIssueCred"
        >
          Click to add credential to your wallet
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
          <WarningCallout.Label visuallyHiddenText={false}>
            Success
          </WarningCallout.Label>
          <p>
            Your ID has been verified and you can now add this credential to
            your DSP wallet.
          </p>
          <DSPPanel profName={storedPanelName} profData={storedPanelData} />
          <Button
            disabled={isIssuing ? true : false}
            onClick={async () => {
              setIsIssuing(true);
              localStorage.removeItem(stateParam);
              const stateId = nanoid();
              const issueName = storedPanelName.slice(0, -1);
              await store.dispatch(issueDspCredential({ issueName, stateId }));
              const issueUri = store.getState().dsp.gatewayUri;
              if (issueUri) window.location.href = issueUri;
            }}
            data-cy="dspIssueCred"
          >
            Click to add credential to your wallet
          </Button>
        </WarningCallout>
      );
    }
  }
  return content;
};

export default CredentialIssue;
