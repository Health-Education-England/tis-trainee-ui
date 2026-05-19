import { useEffect } from "react";
import { WarningCallout } from "nhsuk-react-components";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import style from "../../Common.module.scss";
import { CctSavedDrafts } from "./CctSavedDrafts";
import { loadCctList } from "../../../redux/slices/cctListSlice";
import {
  cctHomeWarningMsgs,
  cctReadBeforeProceedingLabel
} from "../../../utilities/CctConstants";
import { CctCalculatorLinks } from "./CctCalculatorLinks";

export function CctHome() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadCctList());
  }, [dispatch]);

  return (
    <>
      <WarningCallout data-cy="cct-home-warning">
        <WarningCallout.Label visuallyHiddenText={false}>
          {cctReadBeforeProceedingLabel}
        </WarningCallout.Label>
        <p data-cy="cct-home-warning-text1">{cctHomeWarningMsgs.text1}</p>
        <p data-cy="cct-home-warning-text2">{cctHomeWarningMsgs.text2}</p>
        <p data-cy="cct-home-warning-text3">{cctHomeWarningMsgs.text3}</p>
        <p data-cy="cct-home-warning-text4">{cctHomeWarningMsgs.text4}</p>
        <CctCalculatorLinks />
      </WarningCallout>
      <br />
      <p className={style.panelSubHeader} data-cy="cct-home-subheader-calcs">
        Saved calculations
      </p>
      <CctSavedDrafts />
    </>
  );
}
