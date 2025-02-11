import {
  Button,
  Card,
  Col,
  Container,
  Row,
  WarningCallout
} from "nhsuk-react-components";
import { LtftTracker } from "./LtftTracker";
import history from "../../navigation/history";
import { LtftSummaryObj } from "../../../redux/slices/ltftSummaryListSlice";
import LtftSummary from "./LtftSummary";

//TODO temp - refactor when BE is ready
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
          <WarningCallout data-cy="ltftWarning">
            <WarningCallout.Label visuallyHiddenText={false}>
              For Demonstration Only
            </WarningCallout.Label>
            <p>
              The table below has <strong>dummy data</strong> and is read only
              for demonstrating the future layout of the LTFT Applications
              Summary.
            </p>
          </WarningCallout>
          <Card.Heading data-cy="ltft-summary-header">
            Previous applications summary
          </Card.Heading>
          <LtftSummary />
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
                Choose a CCT Calculation to begin your Changing hours (LTFT)
                application
              </Button>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}
