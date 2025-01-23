import { Button, Card, Col, Container, Row } from "nhsuk-react-components";
import { LtftTracker } from "./LtftTracker";
import history from "../../navigation/history";

export function LtftHome() {
  return (
    <Card>
      <Card.Content>
        <Card.Heading data-cy="ltft-tracker-header">
          New Application
        </Card.Heading>
        <LtftTracker />
        <TrackerBtns />
      </Card.Content>
      <Card.Content>
        <Card.Heading data-cy="ltft-summary-header">
          Applications summary
        </Card.Heading>
        <LtftSummary />
      </Card.Content>
    </Card>
  );
}

function LtftSummary() {
  return <p>LTFT Summary goes here</p>;
}

function TrackerBtns() {
  return (
    <div style={{ marginTop: "2rem" }}>
      <Container>
        <Row>
          <Col width="full">
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
    </div>
  );
}
