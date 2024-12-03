import { Button, WarningCallout } from "nhsuk-react-components";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import style from "../../Common.module.scss";
import history from "../../navigation/history";
import { resetCctCalc } from "../../../redux/slices/cctSlice";
import { Link } from "react-router-dom";
import { CctSavedDrafts } from "./CctSavedDrafts";
import { useEffect } from "react";
import { loadCctSummaryList } from "../../../redux/slices/cctSummaryListSlice";
import { CctProgrammesList } from "./CctProgrammesList";

export function CctHome() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadCctSummaryList());
  }, [dispatch]);

  return (
    <>
      <WarningCallout>
        <WarningCallout.Label visuallyHiddenText={false}>
          Important
        </WarningCallout.Label>
        <p>
          If your programme is not listed or any of the details are incorrect,
          please <Link to="/support">contact your Local Office support</Link>
        </p>
      </WarningCallout>
      <p className={style.panelSubHeader} data-cy="subheaderProgs">
        Current & future programmes
      </p>
      <CctProgrammesList />
      <br />
      <CctSavedDrafts />
      <Button
        type="button"
        onClick={() => {
          dispatch(resetCctCalc());
          history.push("/cct/create");
        }}
        data-cy="makeNewCctBtn"
      >
        Make a new calculation
      </Button>
    </>
  );
}
