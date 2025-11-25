import { Button, WarningCallout } from "nhsuk-react-components";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import style from "../../Common.module.scss";
import history from "../../navigation/history";
import { resetCctCalc } from "../../../redux/slices/cctSlice";
import { Link } from "react-router-dom";
import { CctSavedDrafts } from "./CctSavedDrafts";
import { useEffect } from "react";
import { loadCctList } from "../../../redux/slices/cctListSlice";
import { CctProgrammesList } from "./CctProgrammesList";
import { fetchLtftSummaryList } from "../../../redux/slices/ltftSummaryListSlice";
import { useIsLtftPilot } from "../../../utilities/hooks/useIsLtftPilot";

export function CctHome() {
  const dispatch = useAppDispatch();
  const isLtftPilot = useIsLtftPilot();

  useEffect(() => {
    dispatch(loadCctList());
    if (isLtftPilot) dispatch(fetchLtftSummaryList());
  }, [dispatch, isLtftPilot]);

  return (
    <>
      <WarningCallout data-cy="cct-home-warning">
        <WarningCallout.Heading>Important</WarningCallout.Heading>
        <p>
          If your programme is not listed or any of the details are incorrect,
          please{" "}
          <Link to="/support" target="_blank">
            contact your Local Office support
          </Link>
        </p>
      </WarningCallout>
      <p className={style.panelSubHeader} data-cy="cct-home-subheader-prog">
        Current & future programmes
      </p>
      <CctProgrammesList />
      <br />
      <p className={style.panelSubHeader} data-cy="cct-home-subheader-calcs">
        Saved calculations
      </p>
      <CctSavedDrafts />
      <Button
        as="button"
        onClick={() => {
          dispatch(resetCctCalc());
          history.push("/cct/create");
        }}
        data-cy="cct-home-new-calc-btn"
      >
        Make a new CCT Calculation
      </Button>
    </>
  );
}
