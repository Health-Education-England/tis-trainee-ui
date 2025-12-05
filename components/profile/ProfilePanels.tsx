import { useMemo } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { ProfileUtilities } from "../../utilities/ProfileUtilities";
import { Details, WarningCallout } from "nhsuk-react-components";
import { PanelsCreator } from "../common/PanelsCreator";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";

interface ProfilePanelsProps {
  profileName: TraineeProfileName;
  title: string;
  warningText: string;
  showTitle?: boolean;
}

export function ProfilePanels({
  profileName,
  title,
  warningText,
  showTitle = true
}: Readonly<ProfilePanelsProps>) {
  const dataArr = useAppSelector(selectTraineeProfile)[profileName];
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
              panelsArr={groupedData.current}
              panelsName={profileName}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="upcomingExpand">
          <Details.Summary>
            Upcoming {title.toLowerCase()} (within 12 weeks)
          </Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={groupedData.upcoming}
              panelsName={profileName}
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
              panelsArr={groupedData.future}
              panelsName={profileName}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="pastExpand">
          <Details.Summary>Past {title.toLowerCase()}</Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={groupedData.past}
              panelsName={profileName}
            />
          </Details.Text>
        </Details>
      </Details.ExpanderGroup>
    </>
  );
}
