import { Col, Container, Row } from "nhsuk-react-components";
import { CSSProperties, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleDot,
  faCircleMinus,
  faExclamationCircle,
  faInfoCircle,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import {
  onboardingTrackerAction,
  onboardingTrackerInfoText
} from "../../../utilities/Constants";
import dayjs from "dayjs";
import { Modal } from "../../common/Modal";
import { useTraineeActions } from "../../../utilities/hooks/useTraineeActions";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import { getActionStatus } from "../../../utilities/OnboardingTrackerUtilities";
import { TrackerLink } from "./TrackerLink";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { createPmRelatedNotificationMap } from "../../../utilities/NotificationsUtilities";
import {
  OnboardingActionStatus,
  TrackerActionType
} from "../../../models/Tracker";
import { NotificationSubjectType } from "../../../models/Notifications";

const TRACKER_SECTIONS = [
  {
    digit: 1,
    headerName: "Welcome (16 weeks)",
    color: "#002D88",
    isActive: (startDate: string) =>
      dayjs(startDate)
        .startOf("day")
        .isSameOrBefore(dayjs().add(16, "weeks").startOf("day")),
    actions: [
      "WELCOME_EMAIL",
      "WELCOME", // this is for ROYAL_SOCIETY_REGISTRATION details within the welcome notification
      "REVIEW_PROGRAMME",
      "SIGN_COJ",
      "SIGN_FORM_R_PART_A",
      "SIGN_FORM_R_PART_B",
      "TRAINING_NUMBER",
      "LTFT",
      "DEFERRAL"
    ] as TrackerActionType[]
  },
  {
    digit: 2,
    headerName: "Placement (12 weeks)",
    color: "#002D88",
    isActive: (startDate: string) =>
      dayjs(startDate)
        .startOf("day")
        .isSameOrBefore(dayjs().add(12, "weeks").startOf("day")),
    actions: [
      "PLACEMENT_CONFIRMATION",
      "REVIEW_PLACEMENT"
    ] as TrackerActionType[]
  },
  {
    digit: 3,
    headerName: "In post (Day One)",
    color: "#002D88",
    isActive: (startDate: string) =>
      dayjs(startDate).startOf("day").isSameOrBefore(dayjs().startOf("day")),
    actions: ["DAY_ONE_EMAIL", "DAY_ONE"] as TrackerActionType[]
  }
];

type TrackerSectionHeaderProps = {
  digit: number;
  circleColour: string;
  headerName: string;
};

function TrackerSectionHeader({
  digit,
  circleColour,
  headerName
}: Readonly<TrackerSectionHeaderProps>) {
  const style = { "--circle-colour": circleColour } as CSSProperties;

  return (
    <div className="tracker-section-header">
      <div className="tracker-section_node" style={style}>
        {digit}
      </div>
      <div className="tracker-section-header_name" style={style}>
        {headerName}
      </div>
      {["arrow-right", "arrow-right_tip"].map(className => (
        <div key={className} className={className} style={style}></div>
      ))}
    </div>
  );
}

type OnboardingTrackerActionsProps = {
  panel: ProgrammeMembership;
};

export function OnboardingTrackerActions({
  panel
}: Readonly<OnboardingTrackerActionsProps>) {
  const progId = panel.tisId as string;
  const { filteredActionsBelongingToThisProg } = useTraineeActions(progId);
  const notificationsList = useAppSelector(
    state => state.notifications.notificationsList
  );

  const notificationsMap = useMemo(
    () => createPmRelatedNotificationMap(notificationsList, progId),
    [notificationsList, progId]
  );

  return (
    <Container className="tracker-container">
      <Row>
        {TRACKER_SECTIONS.map(section => {
          const sectionIsActive = section.isActive(panel.startDate as string);
          const sectionColor = sectionIsActive ? section.color : "#768692";

          return (
            <Col width="one-third" key={section.digit}>
              <TrackerSectionHeader
                digit={section.digit}
                circleColour={sectionColor}
                headerName={section.headerName}
              />

              {section.actions.map(actionTag => (
                <TssTraineeAction
                  key={actionTag}
                  tag={actionTag}
                  pmId={progId}
                  notificationsMap={notificationsMap}
                  status={
                    sectionIsActive
                      ? getActionStatus(
                          actionTag,
                          filteredActionsBelongingToThisProg
                        )
                      : "not available"
                  }
                />
              ))}
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

type TssTraineeActionProps = {
  tag: TrackerActionType;
  status: OnboardingActionStatus;
  pmId: string;
  notificationsMap: Map<NotificationSubjectType, string>;
};

function TssTraineeAction({
  tag,
  status,
  pmId,
  notificationsMap
}: Readonly<TssTraineeActionProps>) {
  const [showModal, setShowModal] = useState(false);
  const statusAction = onboardingTrackerAction[tag];
  const actionIcon = statusAction.faIcon;
  const actionText = statusAction.actionText;
  const textLink = statusAction.textLink;
  const { icon, color } = StatusIcon(status);

  return (
    <>
      <div className="action-wrapper">
        <div className="tracker-section_icon">
          <FontAwesomeIcon icon={actionIcon} color={color} fontSize="28px" />
        </div>
        <div
          className="action-card"
          style={{ "--circle-colour": color } as CSSProperties}
        >
          <div
            className="action-card-contents"
            style={{ "--circle-colour": color } as CSSProperties}
          >
            <StatusSection
              status={status}
              icon={icon}
              color={color}
              cyTag={`status-section-${tag}`}
            />

            <FontAwesomeIcon
              icon={faInfoCircle}
              className="action-card-info-icon"
              color="#005eb8"
              onClick={() => setShowModal(true)}
            />
          </div>
          {textLink && status !== "not available" ? (
            <p>
              <TrackerLink
                textLink={textLink}
                actionText={actionText}
                pmId={pmId}
                tag={tag}
                notificationsMap={notificationsMap}
              />
            </p>
          ) : (
            <p>{actionText}</p>
          )}
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        cancelBtnText="Close"
      >
        <div className="modal-content">
          <h2>{actionText}</h2>
          {onboardingTrackerInfoText[tag]}
        </div>
      </Modal>
    </>
  );
}

type StatusSectionProps = {
  status: OnboardingActionStatus;
  icon: IconDefinition;
  color: string;
  cyTag: string;
};

function StatusSection({
  status,
  icon,
  color,
  cyTag
}: Readonly<StatusSectionProps>) {
  return (
    <div className="status-section" data-cy={cyTag}>
      <div data-cy="status-icon">
        <FontAwesomeIcon icon={icon} color={color} fontSize="20px" />
      </div>
      <div>
        <b data-cy="status-text">{status}</b>
      </div>
    </div>
  );
}

function StatusIcon(actionStatus: OnboardingActionStatus) {
  switch (actionStatus) {
    case "outstanding":
      return { icon: faExclamationCircle, color: "#d5281b" };
    case "completed":
      return { icon: faCircleCheck, color: "#006400" };
    case "not available":
      return { icon: faCircleMinus, color: "#768692" };
    default:
      return { icon: faCircleDot, color: "#425563" };
  }
}
