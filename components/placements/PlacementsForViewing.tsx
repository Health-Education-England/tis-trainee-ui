import { useMemo } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { ProfileUtilities } from "../../utilities/ProfileUtilities";
import { Details, WarningCallout } from "nhsuk-react-components";
import {
  PanelsCreator,
  prepareProfilePanelsData
} from "../common/PanelsCreator";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { PANEL_KEYS } from "../../utilities/Constants";

export function PlacementsForViewing() {
  const placementsArr = useAppSelector(selectTraineeProfile).placements;
  const groupedPlacements = useMemo(() => {
    return ProfileUtilities.groupDateBoxedByDate(placementsArr);
  }, [placementsArr]);

  return (
    <>
      <h2>Placements</h2>
      <Details.ExpanderGroup>
        <Details expander data-cy="currentExpand">
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
      </Details.ExpanderGroup>
    </>
  );
}
