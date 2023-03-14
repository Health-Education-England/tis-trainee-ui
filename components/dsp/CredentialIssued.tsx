import { Button, WarningCallout } from "nhsuk-react-components";
import React from "react";
import { useAppDispatch } from "../../redux/hooks/hooks";
import {
  resetDspSlice,
  updatedDspPanelObj,
  updatedDspPanelObjName
} from "../../redux/slices/dspSlice";
import store from "../../redux/store/store";
import DSPPanel from "./DSPPanel";
import history from "../navigation/history";
import { Redirect } from "react-router-dom";

const CredentialIssued: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams?.get("state");
  const errorDescParam = queryParams?.get("error_description");

  if (stateParam && !errorDescParam) {
    const savedState = localStorage.getItem(stateParam) as string;
    const currSessionState = JSON.parse(savedState);
    dispatch(updatedDspPanelObj(currSessionState.panelData));
    dispatch(updatedDspPanelObjName(currSessionState.panelName));
    const storedPanelData = store.getState().dsp.dspPanelObj;
    const storedPanelName = store.getState().dsp.dspPanelObjName;
    return (
      <WarningCallout>
        <WarningCallout.Label visuallyHiddenText={false}>
          Success
        </WarningCallout.Label>
        <p>The following credential has been added to your DSP wallet.</p>
        <DSPPanel profName={storedPanelName} profData={storedPanelData} />
        <Button
          onClick={() => {
            localStorage.removeItem("verification");
            localStorage.removeItem(stateParam);
            history.push(`/${storedPanelName}`);
            store.dispatch(resetDspSlice());
          }}
          data-cy="dspVerifyIdentity"
        >
          {`Back to ${storedPanelName} page`}
        </Button>
      </WarningCallout>
    );
  }

  if (stateParam && errorDescParam) {
    // Condition for when user cancels adding the cred to the wallet
    // i.e. ...error_description=User%20cancelled%20the%20issuance%20request
    localStorage.removeItem("verification");
    localStorage.removeItem(stateParam);
    store.dispatch(resetDspSlice());
    // placeholder error msg until agree best approach
    return <p>{`${errorDescParam.replaceAll("%20", " ")}`}</p>;
  }

  return <Redirect to="/credential/invalid" />;
};

export default CredentialIssued;
