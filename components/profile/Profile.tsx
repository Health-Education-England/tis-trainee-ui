import { useEffect } from "react";
import PersonalDetailsComponent from "./personal-details/PersonalDetailsComponent";
import { Fieldset, Details } from "nhsuk-react-components";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import DataSourceMsg from "../common/DataSourceMsg";
import { Redirect } from "react-router-dom";
import { PanelsCreator } from "./PanelsCreator";
import { ProfileType, TraineeProfileName } from "../../models/TraineeProfile";
import style from "../Common.module.scss";
import { PANEL_KEYS } from "../../utilities/Constants";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { placementPanelTemplate } from "../../models/Placement";
import { programmePanelTemplate } from "../../models/ProgrammeMembership";
import { resetMfaJourney } from "../../redux/slices/userSlice";

const Profile = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  const placementsArr = useAppSelector(selectTraineeProfile).placements;
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships;
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
  const content = (
    <div id="profile">
      <PageTitle title="Profile" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="profileHeading"
        >
          Profile
        </Fieldset.Legend>
      </Fieldset>
      <DataSourceMsg />
      <Details.ExpanderGroup>
        <PersonalDetailsComponent />
        <PanelsCreator
          panelsArr={prepareProfilePanelsData(
            placementsArr,
            TraineeProfileName.Placements
          )}
          panelsName={TraineeProfileName.Placements}
          panelsTitle={PANEL_KEYS.placements}
          panelKeys={PANEL_KEYS}
        />
        <PanelsCreator
          panelsArr={prepareProfilePanelsData(
            programmesArr,
            TraineeProfileName.Programmes
          )}
          panelsName={TraineeProfileName.Programmes}
          panelsTitle={PANEL_KEYS.programmeMemberships}
          panelKeys={PANEL_KEYS}
        />
      </Details.ExpanderGroup>
    </div>
  );
  return <div>{content}</div>;
};

export default Profile;

function prepareProfilePanelsData(
  arr: ProfileType[],
  arrName: TraineeProfileName
) {
  return arr.map((obj, _index) => filterAndOrderProfilePanelData(arrName, obj));
}

function filterAndOrderProfilePanelData<T>(
  pName: TraineeProfileName,
  pObj: T extends ProfileType ? any : any
) {
  if (pName === TraineeProfileName.Placements) {
    const reorderedPl = populateTemplateProperties(placementPanelTemplate, {
      ...pObj
    });
    const { tisId, status, ...filteredPlacementPanel } = reorderedPl;
    return filteredPlacementPanel;
  } else {
    const reorderedPr = populateTemplateProperties(programmePanelTemplate, {
      ...pObj
    });
    const {
      tisId,
      programmeTisId,
      programmeMembershipType,
      status,
      programmeCompletionDate,
      ...filteredProgrammePanel
    } = reorderedPr;
    return filteredProgrammePanel;
  }
}

function populateTemplateProperties(template: any, values: any) {
  const populatedTemplate: any = {};
  Object.keys(template).forEach(
    key => (populatedTemplate[key] = (key in values ? values : template)[key])
  );
  return populatedTemplate;
}
