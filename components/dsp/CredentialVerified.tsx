import { Redirect, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks/hooks";
import {
  issueDspCredential,
  updatedDspPanelObj,
  updatedDspPanelObjName,
  updatedDspStateId
} from "../../redux/slices/dspSlice";
import store from "../../redux/store/store";
import { Button, WarningCallout } from "nhsuk-react-components";
import DSPPanel from "./DSPPanel";

const CredentialVerified: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams?.get("state");
  const verificationStatus = localStorage.getItem("verification");

  if (stateParam && verificationStatus === "yes") {
    const savedState = localStorage.getItem(stateParam) as string;
    const currSessionState = JSON.parse(savedState);
    dispatch(updatedDspStateId(stateParam));
    dispatch(updatedDspPanelObj(currSessionState.panelData));
    dispatch(updatedDspPanelObjName(currSessionState.panelName));
    const storedPanelData = store.getState().dsp.dspPanelObj;
    const storedPanelName = store.getState().dsp.dspPanelObjName;
    return (
      <WarningCallout>
        <WarningCallout.Label visuallyHiddenText={false}>
          Success
        </WarningCallout.Label>
        <p>
          Your ID has been verified and you can now add this credential to your
          DSP wallet.
        </p>
        <DSPPanel profName={storedPanelName} profData={storedPanelData} />
        <Button
          onClick={async () => {
            localStorage.removeItem("verification");
            await dispatch(issueDspCredential(storedPanelName.slice(0, -1)));

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
  // TODO ensure any dsp local storage data is removed
  localStorage.removeItem("verification");
  return <Redirect to="/credential/invalid" />;
};

export default CredentialVerified;
