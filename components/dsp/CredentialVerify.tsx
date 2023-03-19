import { nanoid } from "nanoid";
import { Button, WarningCallout } from "nhsuk-react-components";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { verifyDspIdentity } from "../../redux/slices/dspSlice";
import store from "../../redux/store/store";
import Loading from "../common/Loading";
import DSPPanel from "./DSPPanel";

const CredentialVerify: React.FC = () => {
  const [isIssuing, setIsIssuing] = useState(false);
  const storedPanelName = store.getState().dsp.dspPanelObjName;
  const storedPanelData = store.getState().dsp.dspPanelObj;
  let content = <></>;

  if (isIssuing) {
    return <Loading />;
  }
  if (storedPanelName && storedPanelData) {
    content = (
      <WarningCallout>
        <WarningCallout.Label visuallyHiddenText={false}>
          Important
        </WarningCallout.Label>
        <p>
          Before you can issue this credential to your DSP wallet you must
          verify your identity.
        </p>
        <DSPPanel profName={storedPanelName} profData={storedPanelData} />
        <Button
          onClick={() => {
            setIsIssuing(true);
            handleVerifyClick();
          }}
          data-cy="dspVerifyIdentity"
        >
          Click to add credential to your wallet
        </Button>
      </WarningCallout>
    );
  }
  return content;
};

export default CredentialVerify;

async function handleVerifyClick() {
  const stateId = nanoid();
  await store.dispatch(verifyDspIdentity(stateId));
  const dspSuccessCode = store.getState().dsp.successCode;
  const verifyUri = store.getState().dsp.gatewayUri;
  if (verifyUri && dspSuccessCode === 201) {
    window.location.href = verifyUri;
  } else {
    localStorage.removeItem(stateId);
    return <Redirect to="/credential/invalid" />;
  }
}
