import { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { resetMfaJourney } from "../../redux/slices/userSlice";
import Dsp from "../dsp/Dsp";
import PageNotFound from "../common/PageNotFound";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import { Fieldset } from "nhsuk-react-components";
import DataSourceMsg from "../common/DataSourceMsg";
import {
  PanelsCreator,
  prepareProfilePanelsData
} from "../common/PanelsCreator";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { PANEL_KEYS } from "../../utilities/Constants";
import style from "../Common.module.scss";

const Placements = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  const preferredMfa = useAppSelector(state => state.user.preferredMfa);

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  return (
    <Switch>
      <Route exact path="/placements/dsp" component={Dsp} />
      <Route exact path="/placements" component={PlacementsPanels} />
      <Redirect exact path="/" to="/placements" />
      <Route path="/placements/*" component={PageNotFound} />
    </Switch>
  );
};

export default Placements;

function PlacementsPanels() {
  const placementsArr = useAppSelector(selectTraineeProfile).placements;
  return (
    <>
      <PageTitle title="Placements" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="placementsHeading"
        >
          Placements
        </Fieldset.Legend>
      </Fieldset>
      <DataSourceMsg />
      <PanelsCreator
        panelsArr={prepareProfilePanelsData(
          placementsArr,
          TraineeProfileName.Placements
        )}
        panelsName={TraineeProfileName.Placements}
        panelsTitle={PANEL_KEYS.placements}
        panelKeys={PANEL_KEYS}
      />
    </>
  );
}
