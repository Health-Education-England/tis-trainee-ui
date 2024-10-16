import {
  Button,
  Card,
  SummaryList,
  WarningCallout
} from "nhsuk-react-components";
import { LtftTracker } from "./LtftTracker";

type LtftHomeProps = {
  currentLtftStatus: string;
};

export function LtftHome({ currentLtftStatus }: Readonly<LtftHomeProps>) {
  return (
    <>
      <WarningCallout>
        <WarningCallout.Label
          visuallyHiddenText={false}
          data-cy="ltftWipWarningLabel"
        >
          Important
        </WarningCallout.Label>
        <p data-cy="ltftWipWarningText">
          This page is currently under development. At the moment you can make
          save, and edit a CCT calculation but not submit a Changing hours
          (LTFT) application.
        </p>
      </WarningCallout>
      <Card>
        <Card.Content>
          <Card.Heading>Summary</Card.Heading>
          <Card.Description>
            Once developed, this section will be a summary of your Changing
            hours (LTFT) applications - past and current.
          </Card.Description>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Approved applications</SummaryList.Key>
              <SummaryList.Value>Not available</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Withdrawn applications</SummaryList.Key>
              <SummaryList.Value>Not available</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Current application status</SummaryList.Key>
              <SummaryList.Value>{currentLtftStatus}</SummaryList.Value>
              <SummaryList.Actions>
                {currentLtftStatus === "DRAFT" && (
                  <Button secondary>start over</Button>
                )}
              </SummaryList.Actions>
            </SummaryList.Row>
          </SummaryList>
          <LtftTracker />
        </Card.Content>
      </Card>
    </>
  );
}
