import {
  BodyText,
  Button,
  Card,
  Label,
  SummaryList
} from "nhsuk-react-components";
import {
  Placement,
  placementPanelTemplate,
  SpecialtyType
} from "../../models/Placement";
import {
  ProgrammeMembership,
  programmePanelTemplate
} from "../../models/ProgrammeMembership";
import { ProfileType, TraineeProfileName } from "../../models/TraineeProfile";
import store from "../../redux/store/store";
import { PANEL_KEYS } from "../../utilities/Constants";
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
import { UserFeaturesType } from "../../models/FeatureFlags";
import { useAppSelector } from "../../redux/hooks/hooks";

type PanelsCreatorProps = {
  panelsArr: ProfileType[];
  panelsName: TraineeProfileName;
};

export function PanelsCreator({
  panelsArr,
  panelsName
}: Readonly<PanelsCreatorProps>) {
  const today = dayjs().format("YYYY-MM-DD");
  const unreviewedActions = store
    .getState()
    .traineeActions.traineeActionsData.filter(
      action => today >= dayjs(action.availableFrom).format("YYYY-MM-DD")
    );
  const userFeatures = useAppSelector(state => state.user.features);

  const keysToDisplay = getKeysToDisplay(panelsName, userFeatures);
  const panelsTitle = PANEL_KEYS[panelsName];

  return (
    <Card.Group>
      {panelsArr.length > 0 ? (
        panelsArr.map((panel: ProfileType, index: number) => {
          const panelTitle =
            panelsName === TraineeProfileName.Programmes
              ? (panel as ProgrammeMembership).programmeName
              : (panel as Placement).site;

          const currentAction = unreviewedActions.filter(
            action =>
              action.tisReferenceInfo.id === panel.tisId &&
              action.type === "REVIEW_DATA"
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
                <p className={style.panelHeader}>{panelTitle}</p>
                <SummaryList>
                  {panelsName === TraineeProfileName.Programmes &&
                    dayjs(panel.startDate).isAfter(
                      dayjs().subtract(1, "year")
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
                              Onboarding Tracker
                            </Label>
                          </SummaryList.Key>
                          <SummaryList.Value>
                            <OnboardingTrackerLink
                              progPanelId={panel.tisId as string}
                            />
                          </SummaryList.Value>
                        </SummaryList.Row>
                      </>
                    )}
                  <p className={style.panelSubHeader} data-cy="subheaderLtft">
                    Less than full-time (LTFT) training
                  </p>
                  <SummaryList.Row>
                    <SummaryList.Key>
                      <Label data-cy="ltft-thinking" size="s">
                        Thinking of changing your hours?
                      </Label>
                    </SummaryList.Key>
                    <SummaryList.Value>
                      <Link
                        to="/notifications"
                        data-cy="ltft-link-notifications"
                      >
                        See your 'LTFT' notification for more details on how to
                        apply
                      </Link>
                    </SummaryList.Value>
                  </SummaryList.Row>
                  <SummaryList.Row>
                    <SummaryList.Key>
                      <Label size="s" data-cy="ltft-ready">
                        Ready to make a LTFT application?
                      </Label>
                    </SummaryList.Key>
                    <SummaryList.Value>
                      <Link to="/ltft" data-cy="ltft-link-application">
                        Go to the LTFT application page
                      </Link>
                    </SummaryList.Value>
                  </SummaryList.Row>
                  <SummaryList.Row>
                    <SummaryList.Key>
                      <Label size="s" data-cy="cct-link-header">
                        Need a CCT calculation?
                      </Label>
                    </SummaryList.Key>
                    <SummaryList.Value>
                      <Link to="/cct" data-cy="cct-link">
                        Go to the CCT calculator
                      </Link>
                    </SummaryList.Value>
                  </SummaryList.Row>
                  <p
                    className={style.panelSubHeader}
                    data-cy="subheaderDetails"
                  >
                    Details
                  </p>
                  {keysToDisplay.map((panelProp, _index) => (
                    <SummaryList.Row key={_index}>
                      <SummaryList.Key data-cy={`${panelProp}${index}Key`}>
                        {panelProp === "conditionsOfJoining" ? (
                          <>
                            <InfoTooltip
                              tooltipId={`${panelProp}${index}CojInfo`}
                              content="The Conditions of Joining a Specialty Training Programme is your acknowledgement that you will adhere to the professional responsibilities, including the need to participate actively in the assessment and, where applicable revalidation processes."
                            />
                            {PANEL_KEYS[panelProp]}
                          </>
                        ) : (
                          <span>{PANEL_KEYS[panelProp]}</span>
                        )}
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
                userFeatures.details.programmes.confirmation.enabled &&
                (isCurrentDateBoxed(panel) || isUpcomingDateBoxed(panel)) ? (
                  <Button
                    className="btn_full-width"
                    onClick={(e: { preventDefault: () => void }) => {
                      e.preventDefault();
                      downloadPmConfirmation(panel.tisId as string);
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

function getKeysToDisplay(
  panelsName: TraineeProfileName,
  userFeatures: UserFeaturesType
) {
  if (panelsName === TraineeProfileName.Programmes) {
    const { tisId, ...rest } = programmePanelTemplate;
    const keys = Object.keys(rest);
    return keys.filter(
      k =>
        userFeatures.details.programmes.conditionsOfJoining.enabled ||
        k !== "conditionsOfJoining"
    );
  } else {
    const { tisId, subSpecialty, postAllowsSubspecialty, ...rest } =
      placementPanelTemplate;
    return Object.keys(rest);
  }
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
          startDate={panel.startDate}
          programmeMembershipId={panel.tisId}
        />
      );
    case "trainingNumber":
      return (
        <TrainingNumber
          trainingNumber={panel[panelProp]}
          gmcNumber={
            store.getState().traineeProfile.traineeProfileData.personalDetails
              .gmcNumber
          }
          gdcNumber={
            store.getState().traineeProfile.traineeProfileData.personalDetails
              .gdcNumber
          }
          panelId={panel.tisId}
        />
      );
    case "otherSites":
      return <OtherSites otherSites={panel[panelProp]} />;
    case "specialty":
      return (
        <Specialty
          specialty={panel[panelProp]}
          subSpecialty={panel.subSpecialty}
          postAllowsSubspecialty={panel.postAllowsSubspecialty}
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
