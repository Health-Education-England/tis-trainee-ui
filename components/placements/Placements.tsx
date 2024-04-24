import { useEffect, useMemo } from "react";
import { Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { resetMfaJourney } from "../../redux/slices/userSlice";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import { Details, Fieldset, WarningCallout } from "nhsuk-react-components";
import {
  PanelsCreator,
  prepareProfilePanelsData
} from "../common/PanelsCreator";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { PANEL_KEYS } from "../../utilities/Constants";
import style from "../Common.module.scss";
import Loading from "../common/Loading";
import { ProfileUtilities } from "../../utilities/ProfileUtilities";
import { fetchCredentials } from "../../utilities/DspUtilities";
import { ExpanderMsg } from "../common/ExpanderMsg";

const Placements = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  useEffect(() => {
    fetchCredentials("placement");
  }, []);

  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const dspStatus = useAppSelector(state => state.dsp.status);

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  if (dspStatus === "loading") {
    return <Loading />;
  }

  return <PlacementsPanels />;
};

export default Placements;

function PlacementsPanels() {
  const placementsArr = useAppSelector(selectTraineeProfile).placements;
  const groupedPlacements = useMemo(() => {
    return ProfileUtilities.groupPlacementsByDate(placementsArr);
  }, [placementsArr]);

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
      <ExpanderMsg expanderName="dataSource" />
      <Details.ExpanderGroup>
        <Details expander open data-cy="currentExpand">
          <Details.Summary>Your current placements</Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedPlacements.current,
                TraineeProfileName.Placements
              )}
              panelsName={TraineeProfileName.Placements}
              panelsTitle={PANEL_KEYS.placements}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="upcomingExpand">
          <Details.Summary>
            Upcoming placements (within 12 weeks)
          </Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedPlacements.upcoming,
                TraineeProfileName.Placements
              )}
              panelsName={TraineeProfileName.Placements}
              panelsTitle={PANEL_KEYS.placements}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="futureExpand">
          <Details.Summary>
            Future placements (&gt;12 weeks from today)
          </Details.Summary>
          <Details.Text>
            <WarningCallout>
              <WarningCallout.Label visuallyHiddenText={false}>
                Please note
              </WarningCallout.Label>
              <p data-cy="futureWarningText">
                The information we have for future placements with a start date
                more than 12 weeks from today is not yet finalised and may be
                subject to change.
              </p>
            </WarningCallout>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedPlacements.future,
                TraineeProfileName.Placements
              )}
              panelsName={TraineeProfileName.Placements}
              panelsTitle={PANEL_KEYS.placements}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="pastExpand">
          <Details.Summary>Past placements</Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedPlacements.past,
                TraineeProfileName.Placements
              )}
              panelsName={TraineeProfileName.Placements}
              panelsTitle={PANEL_KEYS.placements}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
      </Details.ExpanderGroup>
    </>
  );
}
