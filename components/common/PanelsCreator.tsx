import {
  BodyText,
  Button,
  Card,
  Label,
  SummaryList
} from "nhsuk-react-components";
import { placementPanelTemplate } from "../../models/Placement";
import { programmePanelTemplate } from "../../models/ProgrammeMembership";
import { ProfileType, TraineeProfileName } from "../../models/TraineeProfile";
import store from "../../redux/store/store";
import { PanelKeys } from "../../utilities/Constants";
import { DateUtilities } from "../../utilities/DateUtilities";
import { StringUtilities } from "../../utilities/StringUtilities";
import style from "../Common.module.scss";
import { DspIssueBtn } from "../dsp/DspIssueBtn";
import { ConditionsOfJoining } from "../programmes/ConditionsOfJoining";
import { Curricula } from "../programmes/Curricula";
import { OtherSites } from "../placements/OtherSites";
import { Specialty } from "../placements/Specialty";
import {
  completeTraineeAction,
  resetTraineeAction
} from "../../redux/slices/traineeActionsSlice";
import dayjs from "dayjs";

type PanelsCreatorProps = {
  panelsArr: ProfileType[];
  panelsName: string;
  panelsTitle: string;
  panelKeys: PanelKeys;
};

export function PanelsCreator({
  panelsArr,
  panelsName,
  panelsTitle,
  panelKeys
}: Readonly<PanelsCreatorProps>) {
  const cognitoGroups = store.getState().user.cognitoGroups;
  const inDspBetaConsultantsGp: boolean = !!cognitoGroups?.includes(
    "dsp-beta-consultants"
  );

  const today = dayjs().format("YYYY-MM-DD");
  const unreviewedActions = store
    .getState()
    .traineeActions.traineeActionsData.filter(
      action => today >= dayjs(action.availableFrom).format("YYYY-MM-DD")
    );
  return (
    <Card.Group>
      {panelsArr.length > 0 ? (
        panelsArr.map((panel: any, index: number) => {
          const {
            tisId,
            subSpecialty,
            postAllowsSubspecialty,
            ...filteredPanel
          } = panel;
          const currentAction = unreviewedActions.filter(
            action => action.tisReferenceInfo.id === panel.tisId
          );
          return (
            <Card.GroupItem key={index} width="one-half">
              <Card className={style.panelDiv}>
                <SummaryList>
                  {Object.keys(filteredPanel).map((panelProp, _index) => (
                    <SummaryList.Row key={_index}>
                      <SummaryList.Key data-cy={`${panelProp}${index}Key`}>
                        {panelKeys[panelProp as keyof PanelKeys]}
                      </SummaryList.Key>
                      <SummaryList.Value data-cy={`${panelProp}${index}Val`}>
                        {displayTheCorrectListItem(panelProp, panel, index)}
                      </SummaryList.Value>
                    </SummaryList.Row>
                  ))}
                  {inDspBetaConsultantsGp ? (
                    <DspIssueBtn
                      panelName={panelsName}
                      panelId={panel.tisId}
                      isPastDate={DateUtilities.IsPastDate(panel.endDate)}
                      data-cy={`dspIssueBtn-${panelsName}-${panel.tisId}`}
                    />
                  ) : null}
                  {currentAction.length > 0 ? (
                    <SummaryList.Row>
                      <SummaryList.Key>
                        <Label data-cy={`${index}Key`}>
                          <b>{"Review Actions"}</b>
                        </Label>
                      </SummaryList.Key>
                      <SummaryList.Value>
                        <p
                          data-cy={`actionDueDate-${panelsName}-${panel.tisId}`}
                        >
                          Due by{" "}
                          {DateUtilities.ToLocalDate(currentAction[0].dueBy)}
                        </p>
                        <Button
                          className="btn_full-width"
                          onClick={(e: { preventDefault: () => void }) => {
                            e.preventDefault();
                            handleReview(currentAction[0].id);
                          }}
                          data-cy={`reviewActionBtn-${panelsName}-${panel.tisId}`}
                        >
                          {"Mark As Read"}
                        </Button>
                      </SummaryList.Value>
                    </SummaryList.Row>
                  ) : null}
                </SummaryList>
              </Card>
            </Card.GroupItem>
          );
        })
      ) : (
        <Card className={style.panelDiv}>
          <BodyText
            data-cy={`notAssigned${panelsName}`}
          >{`You are not assigned to any p${panelsTitle.slice(1)}.`}</BodyText>
        </Card>
      )}
    </Card.Group>
  );
}

export async function handleReview(actionId: string) {
  await store.dispatch(completeTraineeAction(actionId));
  store.dispatch(resetTraineeAction());
}

export function displayListVal<T extends Date | string>(val: T, k: string) {
  const transformations: Record<string, (value: Date | string) => string> = {
    endDate: DateUtilities.ToLocalDate,
    startDate: DateUtilities.ToLocalDate,
    wholeTimeEquivalent: StringUtilities.TrimZeros as (
      v: Date | string
    ) => string
  };
  const transformation = transformations[k];
  if (transformation) {
    return transformation(val);
  } else {
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
  pObj: any
) {
  if (pName === TraineeProfileName.Placements) {
    const reorderedPl = populateTemplateProperties(placementPanelTemplate, {
      ...pObj
    });
    const { status, ...filteredPlacementPanel } = reorderedPl;
    return filteredPlacementPanel;
  } else {
    const reorderedPr = populateTemplateProperties(programmePanelTemplate, {
      ...pObj
    });
    const {
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

function displayTheCorrectListItem(
  panelProp: string,
  panel: any,
  index: number
) {
  switch (panelProp) {
    case "curricula":
      return <Curricula curricula={panel[panelProp]} />;
    case "conditionsOfJoining":
      return (
        <ConditionsOfJoining
          conditionsOfJoining={panel[panelProp]}
          startDate={panel["startDate"]}
          programmeMembershipId={panel.tisId}
          programmeName={panel.programmeName}
        />
      );
    case "otherSites":
      return <OtherSites otherSites={panel[panelProp]} />;
    case "specialty":
      return (
        <Specialty
          specialty={panel[panelProp]}
          subSpecialty={panel["subSpecialty"]}
          postAllowsSubspecialty={panel["postAllowsSubspecialty"]}
          index={index}
        />
      );
    default:
      return displayListVal(panel[panelProp], panelProp);
  }
}
