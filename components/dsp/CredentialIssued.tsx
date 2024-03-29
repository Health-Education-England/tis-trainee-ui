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
import { useLocation } from "react-router-dom";

const CredentialIssued: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams?.get("state");
  const errorDescParam = queryParams?.get("error_description");
  let content = <></>;

  if (stateParam && !errorDescParam) {
    const savedState = localStorage.getItem(stateParam);
    if (savedState) {
      const currSessionState = JSON.parse(savedState);
      dispatch(updatedDspPanelObj(currSessionState.panelData));
      dispatch(updatedDspPanelObjName(currSessionState.panelName));
      const storedPanelData = store.getState().dsp.dspPanelObj;
      const storedPanelName = store.getState().dsp.dspPanelObjName;
      content = (
        <WarningCallout>
          <WarningCallout.Label
            visuallyHiddenText={false}
            data-cy="dspIssuedSuccessWarningLabel"
          >
            Success
          </WarningCallout.Label>
          <p data-cy="dspIssuedSuccessWarningText">
            The following credential has been added to your DSP wallet.
          </p>
          <DSPPanel profName={storedPanelName} profData={storedPanelData} />
          <Button
            onClick={() => {
              localStorage.removeItem(stateParam);
              history.push(`/${storedPanelName}`);
              store.dispatch(resetDspSlice());
            }}
            data-cy="dspIssuedSuccessBtn"
          >
            OK
          </Button>
        </WarningCallout>
      );
    }
  }

  // Condition for when user cancels adding the cred to the wallet
  if (stateParam && errorDescParam) {
    localStorage.removeItem(stateParam);
    store.dispatch(resetDspSlice());
    content = (
      <div
        className="nhsuk-error-summary"
        aria-labelledby="error-summary-title"
        role="alert"
      >
        <h2
          className="nhsuk-error-summary__title"
          data-cy="dspIssuedErrorSummaryTitle"
          id="error-summary-title"
        >
          Something went wrong
        </h2>
        <div className="nhsuk-error-summary__body">
          {" "}
          <p data-cy="dspIssuedErrorSummaryText">{`Credential has not been added to your wallet. Reason: ${errorDescParam.replaceAll(
            "%20",
            " "
          )}`}</p>
        </div>
      </div>
    );
  }
  return content;
};

export default CredentialIssued;
