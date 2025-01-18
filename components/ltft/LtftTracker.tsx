import { CSSProperties } from "react";
import { Col, Container, Row } from "nhsuk-react-components";
import { faCheckCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LtftSummaryObj } from "../../redux/slices/ltftSummaryListSlice";

type LtftTrackerProps = {
  draftOrUnsubmittedLtftSummary: LtftSummaryObj | undefined;
};

export function LtftTracker({
  draftOrUnsubmittedLtftSummary
}: Readonly<LtftTrackerProps>) {
  return (
    <Container className="tracker-container">
      <Row>
        <Col width="one-third">
          <TrackerSectionHeader
            digit={1}
            draftOrUnsubmittedLtftSummary={draftOrUnsubmittedLtftSummary}
            headerName="CCT calculation"
          />
        </Col>
        <Col width="one-third">
          <TrackerSectionHeader
            digit={2}
            draftOrUnsubmittedLtftSummary={draftOrUnsubmittedLtftSummary}
            headerName="TPD discussion"
          />
        </Col>
        <Col width="one-third">
          <TrackerSectionHeader
            digit={3}
            draftOrUnsubmittedLtftSummary={draftOrUnsubmittedLtftSummary}
            headerName="Main application"
          />
        </Col>
      </Row>
    </Container>
  );
}

type TrackerSectionHeaderProps = {
  draftOrUnsubmittedLtftSummary: LtftSummaryObj | undefined;
  digit: number;
  headerName: string;
  circleColour?: string;
  otherColour?: string;
};

function TrackerSectionHeader({
  draftOrUnsubmittedLtftSummary,
  digit,
  headerName,
  circleColour = "white",
  otherColour = "#212b32"
}: Readonly<TrackerSectionHeaderProps>) {
  const style = { "--circle-colour": otherColour } as CSSProperties;
  const style2 = { "--circle-colour": circleColour } as CSSProperties;
  return (
    <div className="tracker-section-header">
      <div className="tracker-section_node" style={style2}>
        {draftOrUnsubmittedLtftSummary ? (
          <FontAwesomeIcon
            icon={digit === 3 ? faClock : faCheckCircle}
            color={digit === 3 ? "#0071d1" : "#006400"}
            size="2x"
          />
        ) : (
          <div style={{ color: "black" }}>{digit}</div>
        )}
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
