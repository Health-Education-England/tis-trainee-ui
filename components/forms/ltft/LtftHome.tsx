import { Card } from "nhsuk-react-components";

export function LtftHome() {
  return (
    <Card>
      <Card.Content>
        <Card.Heading data-cy="ltft-tracker-header">
          Current Changing hours (LTFT) application
        </Card.Heading>
        <LtftCurrent />
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

function LtftCurrent() {
  return <p>Current LTFT application tracker goes here</p>;
}

function LtftSummary() {
  return <p>LTFT Summary goes here</p>;
}
