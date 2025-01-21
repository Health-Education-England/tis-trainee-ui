import {
  BodyText,
  Button,
  Card,
  Label,
  SummaryList
} from "nhsuk-react-components";
import { placementPanelTemplate, SpecialtyType } from "../../models/Placement";
import { programmePanelTemplate } from "../../models/ProgrammeMembership";
import { ProfileType, TraineeProfileName } from "../../models/TraineeProfile";
import store from "../../redux/store/store";
import { PanelKeys } from "../../utilities/Constants";
import {
  DateUtilities,
  isCurrentDateBoxed,
  isUpcomingDateBoxed
} from "../../utilities/DateUtilities";
import { StringUtilities } from "../../utilities/StringUtilities";
import style from "../Common.module.scss";
import { ConditionsOfJoining } from "../programmes/ConditionsOfJoining";
import { Curricula } from "../programmes/Curricula";
import { TrainingNumber } from "../programmes/TrainingNumber";
import { OtherSites } from "../placements/OtherSites";
import { Specialty } from "../placements/Specialty";
import {
  completeTraineeAction,
  resetTraineeAction
} from "../../redux/slices/traineeActionsSlice";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import dayjs from "dayjs";
import { OnboardingTrackerLink } from "../programmes/trackers/OnboardingTrackerLink";
import InfoTooltip from "./InfoTooltip";
import { FileUtilities } from "../../utilities/FileUtilities";
import { Link } from "react-router-dom";

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
              <Card
                className={
                  currentAction.length > 0
                    ? style.panelDivHighlight
                    : style.panelDiv
                }
              >
                {panelsName === TraineeProfileName.Placements && (
                  <p className={style.panelHeader}>{panel.site}</p>
                )}
                {panelsName === TraineeProfileName.Programmes && (
                  <p className={style.panelHeader}>{panel.programmeName}</p>
                )}
                <SummaryList>
                  {panelsName === TraineeProfileName.Programmes &&
                    dayjs().isAfter(
                      dayjs(panel.startDate).subtract(16, "weeks")
                    ) && (
                      <>
                        <p
                          className={style.panelSubHeader}
                          data-cy="subheaderOnboarding"
                        >
                          Onboarding
                        </p>

                        <SummaryList.Row>
                          <SummaryList.Key>
                            <Label
                              size="s"
                              data-cy="NewProgrammeOnboardingText"
                            >
                              {`'New Programme' onboarding journey`}
                            </Label>
                          </SummaryList.Key>
                          <SummaryList.Value>
                            <OnboardingTrackerLink progPanelId={panel.tisId} />
                          </SummaryList.Value>
                        </SummaryList.Row>
                      </>
                    )}
                  <p className={style.panelSubHeader} data-cy="subheaderLtft">
                    Changing hours (LTFT)
                  </p>
                  <SummaryList.Row>
                    <SummaryList.Key>
                      <Label size="s">Thinking of changing your hours?</Label>
                    </SummaryList.Key>
                    <SummaryList.Value>
                      <Link to="/notifications" data-cy="ltft-link">
                        See your LTFT notification for more details on how to
                        apply
                      </Link>
                    </SummaryList.Value>
                  </SummaryList.Row>
                  <SummaryList.Row>
                    <SummaryList.Key>
                      <Label size="s" data-cy="cct-link-header">
                        Need a Changing hours (LTFT) calculation?
                      </Label>
                    </SummaryList.Key>
                    <SummaryList.Value>
                      <Link to="/cct" data-cy="cct-link">
                        Go to CCT page
                      </Link>
                    </SummaryList.Value>
                  </SummaryList.Row>
                  <p
                    className={style.panelSubHeader}
                    data-cy="subheaderDetails"
                  >
                    Details
                  </p>
                  {Object.keys(filteredPanel).map((panelProp, _index) => (
                    <SummaryList.Row key={_index}>
                      <SummaryList.Key data-cy={`${panelProp}${index}Key`}>
                        {panelProp === "conditionsOfJoining" ? (
                          <Label size="s" style={{ float: "right" }}>
                            <InfoTooltip
                              tooltipId={`${panelProp}${index}CojInfo`}
                              content="The Conditions of Joining a Specialty Training Programme is your acknowledgement that you will adhere to the professional responsibilities, including the need to participate actively in the assessment and, where applicable revalidation processes."
                            />
                          </Label>
                        ) : null}
                        {panelKeys[panelProp as keyof PanelKeys]}
                      </SummaryList.Key>
                      <SummaryList.Value data-cy={`${panelProp}${index}Val`}>
                        {displayTheCorrectListItem(panelProp, panel, index)}
                      </SummaryList.Value>
                    </SummaryList.Row>
                  ))}
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
                {panelsName === TraineeProfileName.Programmes &&
                (isCurrentDateBoxed(panel) || isUpcomingDateBoxed(panel)) ? (
                  <Button
                    className="btn_full-width"
                    onClick={(e: { preventDefault: () => void }) => {
                      e.preventDefault();
                      downloadPmConfirmation(panel.tisId);
                    }}
                    data-cy={`downloadPmConfirmBtn-${panelsName}-${panel.tisId}`}
                  >
                    {"Download Programme Confirmation"}
                  </Button>
                ) : null}
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

const traineeProfileService = new TraineeProfileService();
export async function downloadPmConfirmation(programmeId: string) {
  FileUtilities.downloadPdf(`programme-confirmation_${programmeId}.pdf`, () =>
    traineeProfileService.getPmConfirmation(programmeId)
  );
}

export function displayListVal<T extends Date | string>(val: T, k: string) {
  if (val === null || val === "") {
    return "None provided";
  }
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
  } else return val;
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
    case "trainingNumber":
      return (
        <TrainingNumber
          conditionsOfJoining={panel["conditionsOfJoining"]}
          startDate={panel["startDate"]}
          trainingNumber={panel[panelProp]}
          gmcNumber={
            store.getState().traineeProfile.traineeProfileData.personalDetails
              .gmcNumber
          }
          gdcNumber={
            store.getState().traineeProfile.traineeProfileData.personalDetails
              .gdcNumber
          }
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
    case "otherSpecialties":
      if (panel[panelProp]?.length > 0) {
        const sortedSpecialties = [...panel[panelProp]].sort((s1, s2) =>
          s1.name.localeCompare(s2.name)
        );
        return sortedSpecialties.map(
          ({ specialtyId, name }: SpecialtyType): JSX.Element => (
            <div key={specialtyId}>
              <div data-cy={`otherSpecialty${specialtyId}Val`}>{name}</div>
            </div>
          )
        );
      } else {
        return "None provided";
      }
    case "responsibleOfficer":
      if (panel[panelProp]?.firstName && panel[panelProp]?.lastName) {
        return `${panel[panelProp].firstName} ${panel[panelProp].lastName}`;
      } else {
        return "Not currently available";
      }
    default:
      return displayListVal(panel[panelProp], panelProp);
  }
}
