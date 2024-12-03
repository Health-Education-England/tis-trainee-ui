import { useMemo } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { ProfileUtilities } from "../../utilities/ProfileUtilities";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { Details, WarningCallout } from "nhsuk-react-components";
import {
  PanelsCreator,
  prepareProfilePanelsData
} from "../common/PanelsCreator";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { PANEL_KEYS } from "../../utilities/Constants";

export function ProgrammesForViewing() {
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships;
  const groupedProgrammes = useMemo(() => {
    return ProfileUtilities.groupDateBoxedByDate(programmesArr);
  }, [programmesArr]);

  return (
    <>
      <h2>Programmes</h2>
      <Details.ExpanderGroup>
        <Details expander data-cy="currentExpand">
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
                The information we have for future programme memberships with a
                start date more than 12 weeks from today is not yet finalised
                and may be subject to change.
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
      </Details.ExpanderGroup>
    </>
  );
}
