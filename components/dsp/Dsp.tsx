import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import store from "../../redux/store/store";
import useLocalStorage from "../../utilities/hooks/useLocalStorage";
import Loading from "../common/Loading";

export default function Dsp() {
  const currPath = useLocation().pathname;
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
