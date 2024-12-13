import { useMemo } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { ProfileUtilities } from "../../utilities/ProfileUtilities";
import { Details, WarningCallout } from "nhsuk-react-components";
import {
  PanelsCreator,
  prepareProfilePanelsData
} from "../common/PanelsCreator";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { PANEL_KEYS } from "../../utilities/Constants";

interface ProfilePanelsProps {
  profileName: TraineeProfileName;
  dataSelector: (state: any) => any;
  title: string;
  warningText: string;
  showTitle?: boolean;
}

export function ProfilePanels({
  profileName,
  dataSelector,
  title,
  warningText,
  showTitle = true
}: Readonly<ProfilePanelsProps>) {
  const dataArr = useAppSelector(dataSelector)[profileName];
  const groupedData = useMemo(() => {
    return ProfileUtilities.groupDateBoxedByDate(dataArr);
  }, [dataArr]);

  return (
    <>
      {showTitle && <h2>{title}</h2>}
      <Details.ExpanderGroup>
        <Details expander data-cy="currentExpand">
          <Details.Summary>Your current {title.toLowerCase()}</Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedData.current,
                profileName
              )}
              panelsName={profileName}
              panelsTitle={PANEL_KEYS[profileName.toLowerCase()]}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="upcomingExpand">
          <Details.Summary>
            Upcoming {title.toLowerCase()} (within 12 weeks)
          </Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedData.upcoming,
                profileName
              )}
              panelsName={profileName}
              panelsTitle={PANEL_KEYS[profileName.toLowerCase()]}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="futureExpand">
          <Details.Summary>
            Future {title.toLowerCase()} (&gt;12 weeks from today)
          </Details.Summary>
          <Details.Text>
            <WarningCallout>
              <WarningCallout.Label visuallyHiddenText={false}>
                Please note
              </WarningCallout.Label>
              <p data-cy="futureWarningText">{warningText}</p>
            </WarningCallout>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedData.future,
                profileName
              )}
              panelsName={profileName}
              panelsTitle={PANEL_KEYS[profileName.toLowerCase()]}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="pastExpand">
          <Details.Summary>Past {title.toLowerCase()}</Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedData.past,
                profileName
              )}
              panelsName={profileName}
              panelsTitle={PANEL_KEYS[profileName.toLowerCase()]}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
      </Details.ExpanderGroup>
    </>
  );
}
