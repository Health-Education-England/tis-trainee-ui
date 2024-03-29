import { Fieldset } from "nhsuk-react-components";
import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { resetMfaJourney } from "../../redux/slices/userSlice";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import style from "../Common.module.scss";
import DataSourceMsg from "../common/DataSourceMsg";
import {
  PanelsCreator,
  prepareProfilePanelsData
} from "../common/PanelsCreator";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { PANEL_KEYS } from "../../utilities/Constants";
import Loading from "../common/Loading";
import { fetchCredentials } from "../../utilities/DspUtilities";

const Programmes = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  useEffect(() => {
    fetchCredentials("programme-membership");
  }, []);

  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const dspStatus = useAppSelector(state => state.dsp.status);

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  if (dspStatus === "loading") {
    return <Loading />;
  }

  return <ProgrammesPanels />;
};

export default Programmes;

function ProgrammesPanels() {
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships;
  return (
    <>
      <PageTitle title="Programmes" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="programmesHeading"
        >
          Programmes
        </Fieldset.Legend>
      </Fieldset>
      <DataSourceMsg />
      <PanelsCreator
        panelsArr={prepareProfilePanelsData(
          programmesArr,
          TraineeProfileName.Programmes
        )}
        panelsName={TraineeProfileName.Programmes}
        panelsTitle={PANEL_KEYS.programmeMemberships}
        panelKeys={PANEL_KEYS}
      />
    </>
  );
}
