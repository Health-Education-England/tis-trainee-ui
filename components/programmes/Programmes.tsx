import { Details, Fieldset, WarningCallout } from "nhsuk-react-components";
import { useEffect, useMemo } from "react";
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
import { ProfileUtilities } from "../../utilities/ProfileUtilities";
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
  const groupedProgrammes = useMemo(() => {
    return ProfileUtilities.groupProgrammesByDate(programmesArr);
  }, [programmesArr]);
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
      <Details.ExpanderGroup>
        <Details expander open data-cy="currentExpand">
          <Details.Summary>Your current programme memberships</Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedProgrammes.current,
                TraineeProfileName.Programmes
              )}
              panelsName={TraineeProfileName.Programmes}
              panelsTitle={PANEL_KEYS.programmeMemberships}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="upcomingExpand">
          <Details.Summary>
            Upcoming programme memberships (within 12 weeks)
          </Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedProgrammes.upcoming,
                TraineeProfileName.Programmes
              )}
              panelsName={TraineeProfileName.Programmes}
              panelsTitle={PANEL_KEYS.programmeMemberships}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="futureExpand">
          <Details.Summary>
            Future programme memberships (&gt;12 weeks from today)
          </Details.Summary>
          <Details.Text>
            <WarningCallout>
              <WarningCallout.Label visuallyHiddenText={false}>
                Please note
              </WarningCallout.Label>
              <p data-cy="futureWarningText">
                The information we have for future programme memberships with a start date
                more than 12 weeks from today is not yet finalised and may be
                subject to change.
              </p>
            </WarningCallout>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedProgrammes.future,
                TraineeProfileName.Programmes
              )}
              panelsName={TraineeProfileName.Programmes}
              panelsTitle={PANEL_KEYS.programmeMemberships}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="pastExpand">
          <Details.Summary>Past programme memberships</Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedProgrammes.past,
                TraineeProfileName.Programmes
              )}
              panelsName={TraineeProfileName.Programmes}
              panelsTitle={PANEL_KEYS.programmeMemberships}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
      </Details.ExpanderGroup>
    </>
  );
}
