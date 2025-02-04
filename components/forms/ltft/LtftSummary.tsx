import { Table } from "nhsuk-react-components";
import { LtftSummaryObj } from "../../../redux/slices/ltftSummaryListSlice";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { useState } from "react";
import { CheckboxField } from "@aws-amplify/ui-react";

type LtftSummaryProps = {
  ltftSummaryList?: LtftSummaryObj[];
};

const LtftSummary = ({ ltftSummaryList }: Readonly<LtftSummaryProps>) => {
  const ltftSummaries = ltftSummaryList || [];
  const [showSubmitted, setShowSubmitted] = useState(true);
  const [showUnsubmitted, setShowUnsubmitted] = useState(true);

  const filteredLtftSummaries = ltftSummaries.filter(
    item =>
      item.status !== "DRAFT" &&
      (showSubmitted || item.status !== "SUBMITTED") &&
      (showUnsubmitted || item.status !== "UNSUBMITTED")
  );

  const sortedLtftSummaries = DateUtilities.genericSort(
    filteredLtftSummaries.slice(),
    "lastModified",
    true
  );

  return (
    <div>
      <CheckboxField
        name="yesToShowSubmitted"
        value="yes"
        label="SUBMITTED"
        checked={showSubmitted}
        onChange={() =>
          setShowSubmitted(prevShowSubmitted => !prevShowSubmitted)
        }
      />
      <CheckboxField
        name="yesToShowUnsubmitted"
        value="yes"
        label="UNSUBMITTED"
        checked={showUnsubmitted}
        onChange={() =>
          setShowUnsubmitted(prevShowUnsubmitted => !prevShowUnsubmitted)
        }
      />
      <Table responsive data-cy="ltftSummary">
        <Table.Head>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>Created date</Table.Cell>
            <Table.Cell>Last Modified date</Table.Cell>
            <Table.Cell>Status</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {sortedLtftSummaries.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>
                {new Date(item.created).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell data-cy={`lastModified-${index}`}>
                {new Date(item.lastModified).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default LtftSummary;
