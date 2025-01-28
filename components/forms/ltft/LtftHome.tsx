import { Button, Card, Col, Container, Row } from "nhsuk-react-components";
import { LtftTracker } from "./LtftTracker";
import history from "../../navigation/history";
import { LtftSummaryObj } from "../../../redux/slices/ltftSummaryListSlice";

//TODO temp -remove when BE is ready
const draftOrUnsubmittedLtftSummary = undefined;

export function LtftHome() {
  return (
    <>
      <Card>
        <Card.Content>
          <>
            <Card.Heading data-cy="ltft-tracker-header">
              {draftOrUnsubmittedLtftSummary
                ? "In progress application"
                : "New application"}
            </Card.Heading>
            <LtftTracker
              draftOrUnsubmittedLtftSummary={draftOrUnsubmittedLtftSummary}
            />
            <TrackerSectionBtns
              draftOrUnsubmittedLtftSummary={draftOrUnsubmittedLtftSummary}
            />
          </>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content>
          <Card.Heading data-cy="ltft-summary-header">
            Previous applications summary
          </Card.Heading>
          <p>No previous applications</p>
        </Card.Content>
      </Card>
    </>
  );
}

type TrackerSectionBtnsProps = {
  draftOrUnsubmittedLtftSummary: LtftSummaryObj | undefined;
};

function TrackerSectionBtns({
  draftOrUnsubmittedLtftSummary
}: Readonly<TrackerSectionBtnsProps>) {
  return (
    <div style={{ marginTop: "2rem" }}>
      {draftOrUnsubmittedLtftSummary ? (
        <Container>
          <Row>
            <Col width="two-thirds">
              <Button data-cy="continue-application-button">
                {`Continue ${
                  draftOrUnsubmittedLtftSummary?.status === "DRAFT"
                    ? "draft"
                    : "unsubmitted"
                } application`}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col width="one-third">
              <Button secondary data-cy="ltft-startover-btn">
                Start over
              </Button>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container>
          <Row>
            <Col width="two-thirds">
              <Button
                data-cy="choose-cct-btn"
                onClick={() => {
                  history.push("/cct");
                }}
              >
                Choose a CCT Calculation to make a new application
              </Button>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}
