import { Redirect, useLocation } from "react-router-dom";
import store from "../../redux/store/store";
import useLocalStorage from "../../utilities/hooks/useLocalStorage";
import Loading from "../common/Loading";
import {
  issueDspCredential,
  resetDspSlice,
  updatedDspPanelObj,
  updatedDspPanelObjName,
  verifyDspIdentity
} from "../../redux/slices/dspSlice";
import { useAppDispatch } from "../../redux/hooks/hooks";
import history from "../navigation/history";
import DSPPanel from "./DSPPanel";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import {
  Button,
  ErrorMessage,
  Fieldset,
  WarningCallout
} from "nhsuk-react-components";
import style from "../Common.module.scss";

export default function Dsp() {
  const dspError = store.getState().dsp.error;
  const dspStatus = store.getState().dsp.status;
  const dspErrCode = store.getState().dsp.errorCode;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams?.get("state");
  const issuingStatus = store.getState().dsp.isIssuing;
  const issueUri = store.getState().dsp.gatewayUri;

  let content;

  if (issueUri) {
    return <IssuePrompt issueUri={issueUri} />;
  }

  if (issuingStatus === false && !stateParam) {
    return <Redirect to="/home" />;
  }

  if (stateParam) {
    return <IssueSuccessPrompt stateParam={stateParam} />;
  }

  if (dspStatus === "loading") {
    content = <Loading />;
  }

  if (dspErrCode === "401") {
    content = <VerifyIdPrompt />;
  }

  if (dspStatus === "failed" && dspErrCode !== "401") {
    return (
      <WarningCallout>
        <ErrorMessage>{dspError}</ErrorMessage>
      </WarningCallout>
    );
  }

  return (
    <>
      <PageTitle title="Dsp" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="dspHeading"
        >
          Digital Staff Passport
        </Fieldset.Legend>
      </Fieldset>
      {content}
    </>
  );
}

type IssuePromptProps = {
  issueUri: string;
};

function IssuePrompt({ issueUri }: IssuePromptProps) {
  const storedPanelData = store.getState().dsp.dspPanelObj;
  const storedPanelName = store.getState().dsp.dspPanelObjName;
  return (
    <WarningCallout>
      <WarningCallout.Label visuallyHiddenText={false}>
        Important
      </WarningCallout.Label>
      <p>You are about to issue this credential to your DSP wallet.</p>
      <DSPPanel profName={storedPanelName} profData={storedPanelData} />
      <Button
        onClick={() => {
          window.location.href = issueUri;
        }}
        data-cy="dspIssueCred"
      >
        Click to add credential to your wallet
      </Button>
    </WarningCallout>
  );
}

function VerifyIdPrompt() {
  const storedPanelData = store.getState().dsp.dspPanelObj;
  const storedPanelName = store.getState().dsp.dspPanelObjName;
  return (
    <WarningCallout>
      <WarningCallout.Label visuallyHiddenText={false}>
        Important
      </WarningCallout.Label>
      <p>
        Before you can issue this credential to you DSP wallet you must verify
        your identity.
      </p>
      <DSPPanel profName={storedPanelName} profData={storedPanelData} />
      <Button
        onClick={() => {
          handleVerifyClick();
        }}
        data-cy="dspVerifyIdentity"
      >
        Click to verify your identity
      </Button>
    </WarningCallout>
  );
}

async function handleVerifyClick() {
  await store.dispatch(verifyDspIdentity());
  const verifyUri = store.getState().dsp.gatewayUri;
  // todo go to issue prompt screen before issuing gateway
  if (verifyUri) {
    const issueName = store.getState().dsp.dspPanelObjName.slice(0, -1);
    await store.dispatch(issueDspCredential(issueName));
    const issueUri = store.getState().dsp.gatewayUri;
    if (issueUri) {
      window.location.href = issueUri;
    }
  } else console.log("Identity verification failed.");
}

type IssueSuccessPromptProps = {
  stateParam: string;
};

function IssueSuccessPrompt({ stateParam }: IssueSuccessPromptProps) {
  const dispatch = useAppDispatch();
  const [currSessionState, _setCurrSessionState] = useLocalStorage(
    stateParam,
    ""
  );
  // Re-populate the state from local storage.
  dispatch(updatedDspPanelObj(currSessionState.panelData));
  dispatch(updatedDspPanelObjName(currSessionState.panelName));
  const storedPanelData = store.getState().dsp.dspPanelObj;
  const storedPanelName = store.getState().dsp.dspPanelObjName;
  return (
    <WarningCallout>
      <WarningCallout.Label visuallyHiddenText={false}>
        Success
      </WarningCallout.Label>
      <p>The following credential has been added to you DSP wallet.</p>
      <DSPPanel profName={storedPanelName} profData={storedPanelData} />
      <Button
        onClick={() => {
          store.dispatch(resetDspSlice());
          localStorage.removeItem(stateParam);
          history.push(`/${storedPanelName}`);
        }}
        data-cy="dspVerifyIdentity"
      >
        {`Back to ${storedPanelName} page`}
      </Button>
    </WarningCallout>
  );
}
