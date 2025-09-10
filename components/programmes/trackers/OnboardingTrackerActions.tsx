import { Col, Container, Row } from "nhsuk-react-components";
import { CSSProperties, useState } from "react";
import {
  OnboardingActionState,
  OnboardingTrackerStatusActionType
} from "../../../models/Tracker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleDot,
  faCircleMinus,
  faClock,
  faExclamationCircle,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import {
  onboardingTrackerActionText,
  onboardingTrackerInfoText,
  ProgOnboardingTagType
} from "../../../utilities/Constants";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Modal } from "../../common/Modal";

type OnboardingTrackerActionsProps = {
  trackerStatusData: OnboardingTrackerStatusActionType[];
  progStartDate: Date | string | undefined;
};

export function OnboardingTrackerActions({
  trackerStatusData,
  progStartDate
}: Readonly<OnboardingTrackerActionsProps>) {
  const col2IsActive = dayjs().isSameOrAfter(
    dayjs(progStartDate).subtract(12, "weeks")
  );
  const col3IsActive = dayjs().isSameOrAfter(dayjs(progStartDate));
  const col1 = "#0071D1";
  const col2 = "#5D2F91";
  const col3 = "#002D88";
  return (
    <Container className="tracker-container">
      <Row>
        <Col width="one-third">
          <TrackerSectionHeader
            digit={1}
            circleColour={col1}
            headerName="Welcome (16 weeks)"
          />
          <TssTraineeAction
            tag="WELCOME_EMAIL"
            trackerStatusData={trackerStatusData[0]}
            actionColour={col1}
          />
          <TssTraineeAction
            tag="ROYAL_SOCIETY_REGISTRATION"
            trackerStatusData={trackerStatusData[1]}
            actionColour={col1}
          />
          <TssTraineeAction
            tag="REVIEW_PROGRAMME"
            trackerStatusData={trackerStatusData[2]}
            actionColour={col1}
          />
          <TssTraineeAction
            tag="SIGN_COJ"
            trackerStatusData={trackerStatusData[3]}
            actionColour={col1}
          />
          <TssTraineeAction
            tag="FORMR_PARTA"
            trackerStatusData={trackerStatusData[4]}
            actionColour={col1}
          />
          <TssTraineeAction
            tag="FORMR_PARTB"
            trackerStatusData={trackerStatusData[5]}
            actionColour={col1}
          />
          <TssTraineeAction
            tag="TRAINING_NUMBER"
            trackerStatusData={trackerStatusData[6]}
            actionColour={col1}
          />
          <TssTraineeAction
            tag="LTFT"
            trackerStatusData={trackerStatusData[7]}
            actionColour={col1}
          />
          <TssTraineeAction
            tag="DEFER"
            trackerStatusData={trackerStatusData[8]}
            actionColour={col1}
          />
        </Col>
        <Col width="one-third">
          <TrackerSectionHeader
            digit={2}
            circleColour={col2IsActive ? col2 : "grey"}
            headerName="Placement (12 weeks)"
          />
          <TssTraineeAction
            tag="PLACEMENT_CONFIRMATION"
            trackerStatusData={trackerStatusData[9]}
            actionColour={col2}
          />
          <TssTraineeAction
            tag="REVIEW_PLACEMENT"
            trackerStatusData={trackerStatusData[10]}
            actionColour={col2}
          />
        </Col>
        <Col width="one-third">
          <TrackerSectionHeader
            digit={3}
            circleColour={col3IsActive ? col3 : "grey"}
            headerName="In post (Day One)"
          />
          <TssTraineeAction
            tag="DAY_ONE_EMAIL"
            trackerStatusData={trackerStatusData[11]}
            actionColour={col3}
          />
          <TssTraineeAction
            tag="CONNECT_RO"
            trackerStatusData={trackerStatusData[12]}
            actionColour={col3}
            colIsActive={col3IsActive}
          />
        </Col>
      </Row>
    </Container>
  );
}

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

type TssTraineeActionProps = {
  tag: ProgOnboardingTagType;
  trackerStatusData: OnboardingTrackerStatusActionType;
  actionColour: string;
  colIsActive?: boolean;
};

// TODO uncomment the code when status work is done.
function TssTraineeAction({
  tag,
  trackerStatusData,
  actionColour
}: // colIsActive = true
Readonly<TssTraineeActionProps>) {
  const [showModal, setShowModal] = useState(false);
  const statusAction = onboardingTrackerActionText[trackerStatusData.action];
  const actionIcon = statusAction.faIcon;
  const actionText = statusAction.actionText;
  const textLink = statusAction.textLink;

  // const actionIsInactive =
  //   trackerStatusData.state === "not available" || !colIsActive;
  const actionIsInactive = false;
  // const activeColour = actionIsInactive ? "grey" : actionColour;
  const activeColour = actionColour;

  return (
    <>
      <div className="action-wrapper">
        <div className="tracker-section_icon">
          <FontAwesomeIcon
            icon={actionIcon}
            color={activeColour}
            fontSize="28px"
          />
        </div>
        <div
          className="action-card"
          style={{ "--circle-colour": activeColour } as CSSProperties}
        >
          <div
            className="action-card-contents"
            style={{ "--circle-colour": activeColour } as CSSProperties}
          >
            <StatusSection trackerStatusData={trackerStatusData} />

            <FontAwesomeIcon
              icon={faInfoCircle}
              className="action-card-info-icon"
              color={activeColour}
              onClick={() => setShowModal(true)}
            />
          </div>
          {textLink && !actionIsInactive ? (
            <p>
              {textLink.startsWith("http") ? (
                <a href={textLink} target="_blank" rel="noopener noreferrer">
                  {actionText}
                </a>
              ) : (
                <Link to={textLink}>{actionText}</Link>
              )}
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
  trackerStatusData: OnboardingTrackerStatusActionType;
};
function StatusSection({ trackerStatusData }: Readonly<StatusSectionProps>) {
  const { icon, color } = StatusIcon(trackerStatusData.state);
  return (
    <div className="status-section">
      {/* <div>
        <FontAwesomeIcon icon={icon} color={color} fontSize="20px" />
      </div>
      <div>
        <b>{trackerStatusData.state}</b>
      </div>
      <div>
        {trackerStatusData.date
          ? dayjs(trackerStatusData.date).format("DD/MM/YYYY")
          : null}
      </div> */}
    </div>
  );
}

function StatusIcon(actionStatus: OnboardingActionState) {
  switch (actionStatus) {
    case "incomplete":
      return { icon: faExclamationCircle, color: "#d5281b" };
    case "completed":
      return { icon: faCircleCheck, color: "#006400" };
    case "unsubmitted":
      return { icon: faClock, color: "#ED8B00" };
    case "submitted":
      return { icon: faCircleCheck, color: "#006400" };
    case "draft":
      return { icon: faClock, color: "#ED8B00" };
    case "not available":
      return { icon: faCircleMinus, color: "#425563" };
    default:
      return { icon: faCircleDot, color: "#425563" };
  }
}
