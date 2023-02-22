import { BodyText, Card, SummaryList } from "nhsuk-react-components";
import { placementPanelTemplate } from "../../models/Placement";
import {
  Curriculum,
  programmePanelTemplate
} from "../../models/ProgrammeMembership";
import { ProfileType, TraineeProfileName } from "../../models/TraineeProfile";
import { PanelKeys } from "../../utilities/Constants";
import { DateUtilities } from "../../utilities/DateUtilities";
import { StringUtilities } from "../../utilities/StringUtilities";
import style from "../Common.module.scss";
import { Curricula } from "../programmes/Curricula";

type PanelsCreatorProps<P> = {
  panelsArr: P[];
  panelsName: string;
  panelsTitle: string;
  panelKeys: PanelKeys;
};

export function PanelsCreator<P extends {}>({
  panelsArr,
  panelsName,
  panelsTitle,
  panelKeys
}: PanelsCreatorProps<P>) {
  return (
    <Card.Group>
      {panelsArr.length > 0 ? (
        panelsArr.map((panel: P, index: number) => (
          <Card.GroupItem key={index} width="one-half">
            <Card className={style.panelDiv}>
              <SummaryList>
                {Object.keys(panel).map((panelProp, _index) => (
                  <SummaryList.Row key={index}>
                    <SummaryList.Key data-cy={`${panelProp}${index}Key`}>
                      {panelKeys[panelProp as keyof PanelKeys]}
                    </SummaryList.Key>
                    <SummaryList.Value data-cy={`${panelProp}${index}Val`}>
                      {panelProp === "curricula" ? (
                        <Curricula
                          curricula={
                            panel[
                              panelProp as keyof P
                            ] as unknown as Curriculum[]
                          }
                        />
                      ) : (
                        displayListVal(panel[panelProp as keyof P], panelProp)
                      )}
                    </SummaryList.Value>
                  </SummaryList.Row>
                ))}
              </SummaryList>
            </Card>
          </Card.GroupItem>
        ))
      ) : (
        <Card className={style.panelDiv}>
          <BodyText
            data-cy={`notAssigned${panelsName}`}
          >{`You are not assigned to any ${panelsTitle}.`}</BodyText>
        </Card>
      )}
    </Card.Group>
  );
}

function displayListVal<T>(
  val: T extends Date | string ? any : any,
  k: string
) {
  switch (k) {
    case "endDate":
      return DateUtilities.ToLocalDate(val);
    case "startDate":
      return DateUtilities.ToLocalDate(val);
    case "wholeTimeEquivalent":
      return StringUtilities.TrimZeros(val);
    default:
      return val ? val : "None provided";
  }
}

export function prepareProfilePanelsData(
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
