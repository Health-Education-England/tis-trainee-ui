import { faCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Container, Row } from "nhsuk-react-components";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";

export function LtftTracker() {
  return (
    <>
      <Card.Heading>Tracker</Card.Heading>
      <Card.Description>
        When the development work is completed, this will track the progress of
        your current Changing hours (LTFT) application.
      </Card.Description>
      <LtftTrackerContainer />
    </>
  );
}

function LtftTrackerContainer() {
  const col1 = "#0071D1";
  // const col2 = "#5D2F91";
  // const col3 = "#002D88";
  return (
    <Container className="tracker-container">
      <Row>
        <Col width="one-third">
          <TrackerSectionHeader
            digit={1}
            circleColour={col1}
            headerName="CCT Calculation"
          />
          <TrackerSectionContent
            sectionColour={col1}
            linkUrl="/ltft/cct-calculation"
            linkText="Make new CCT calculation"
          />
        </Col>
        <Col width="one-third">
          <TrackerSectionHeader digit={2} headerName="TPD Approval" />
          <TrackerSectionContent tempHideContents={true} />
        </Col>
        <Col width="one-third">
          <TrackerSectionHeader digit={3} headerName="Application form" />
          <TrackerSectionContent tempHideContents={true} />
        </Col>
      </Row>
    </Container>
  );
}

type TrackerSectionHeaderProps = {
  digit: number;
  headerName: string;
  circleColour?: string;
};

function TrackerSectionHeader({
  digit,
  headerName,
  circleColour = "grey"
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

type TrackerSectionContentProps = {
  sectionColour?: string;
  sectionIconColour?: string;
  sectionStatus?: string;
  linkUrl?: string;
  linkText?: string;
  tempHideContents?: boolean;
};

function TrackerSectionContent({
  sectionColour = "grey",
  sectionIconColour = "#FFFFFF",
  sectionStatus = "Not started",
  linkUrl = "/notifications",
  linkText = "See LTFT notification for more details",
  tempHideContents = false
}: Readonly<TrackerSectionContentProps>) {
  const activeColour = sectionColour;
  return (
    <div className="action-wrapper">
      <div className="tracker-section_icon">
        <FontAwesomeIcon
          icon={faCircle}
          color={sectionIconColour}
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
          {tempHideContents ? (
            <div className="status-section">
              This section is currently under development. Please follow the
              current application process.
            </div>
          ) : (
            <>
              <div className="status-section">
                <div>Status:</div>
                <div>{sectionStatus}</div>
              </div>
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="action-card-info-icon"
                color={activeColour}
                onClick={() =>
                  console.log("info will show in popup or possibly a tooltip")
                }
              />
            </>
          )}
        </div>
        <Link to={linkUrl} className="action-card-link">
          {linkText}
        </Link>
      </div>
    </div>
  );
}
