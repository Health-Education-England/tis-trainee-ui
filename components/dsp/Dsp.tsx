import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import store from "../../redux/store/store";
import useLocalStorage from "../../utilities/hooks/useLocalStorage";
import Loading from "../common/Loading";
import {
  updatedDspPanelObj,
  updatedDspPanelObjName
} from "../../redux/slices/dspSlice";
import { useAppDispatch } from "../../redux/hooks/hooks";

export default function Dsp() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const currPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams.get("state");

  if (stateParam) {
    const [_currSessionState, setCurrSessionState] = useLocalStorage(
      stateParam,
      ""
    );

    // Re-populate the state from local storage.
    dispatch(updatedDspPanelObj(_currSessionState.panelData));
    dispatch(updatedDspPanelObjName(_currSessionState.panelName));

    // TODO: Disabled for testing/dev purposes.
    // localStorage.removeItem(stateParam);
    const originalUrl = _currSessionState.redirect;
    // history.replace(originalUrl);
    console.log("original url:" + originalUrl);
  }

  const dspStatus = store.getState().dsp.status;
  const dspErrCode = store.getState().dsp.errorCode;
  console.log(dspErrCode);

  const storedPanelData = store.getState().dsp.dspPanelObj;
  const storedPanelName = store.getState().dsp.dspPanelObjName.slice(0, -1);
  const [_currPathname, setCurrPathname] = useLocalStorage("currPathname", "");

  useEffect(() => {
    const issuingStatus = store.getState().dsp.isIssuing;
    if (issuingStatus) {
      setCurrPathname(currPath);
    } else localStorage.removeItem("currPathname");
  }, [currPath]);

  if (dspStatus === "loading") {
    return <Loading />;
  }

  if (dspStatus === "failed" && dspErrCode === "401") {
    return (
      <div>{`Before you can issue this ${storedPanelName} cred you need to verify your ID (needs an OK btn etc.)`}</div>
    );
  }

  return <div>this is the dsp comp</div>;
}
