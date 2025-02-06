import { Table } from "nhsuk-react-components";
import { LtftSummaryObj } from "../../../redux/slices/ltftSummaryListSlice";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { useState } from "react";
import { Button, CheckboxField } from "@aws-amplify/ui-react";

type LtftSummaryProps = {
  ltftSummaryList?: LtftSummaryObj[];
};

const LtftSummary = ({ ltftSummaryList }: Readonly<LtftSummaryProps>) => {
  const ltftSummaries = ltftSummaryList || [];
  const [showSubmitted, setShowSubmitted] = useState(true);
  const [showApproved, setShowApproved] = useState(true);
  const [showWithdrawn, setShowWithdrawn] = useState(true);

  const filteredLtftSummaries = ltftSummaries.filter(
    item =>
      item.status !== "DRAFT" &&
      item.status !== "UNSUBMITTED" &&
      (showSubmitted || item.status !== "SUBMITTED") &&
      (showApproved || item.status !== "APPROVED") &&
      (showWithdrawn || item.status !== "WITHDRAWN")
  );

  const sortedLtftSummaries = DateUtilities.genericSort(
    filteredLtftSummaries.slice(),
    "lastModified",
    true
  );

  return (
    <div>
      <CheckboxField
        name="yesToShowApproved"
        value="yes"
        label="APPROVED"
        checked={showApproved}
        onChange={() => setShowApproved(prevShowApproved => !prevShowApproved)}
      />
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
        name="yesToShowWithdrawn"
        value="yes"
        label="WITHDRAWN"
        checked={showWithdrawn}
        onChange={() =>
          setShowWithdrawn(prevShowWithdrawn => !prevShowWithdrawn)
        }
      />
      <Table responsive data-cy="ltftSummary">
        <Table.Head>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>Created date</Table.Cell>
            <Table.Cell>Last Modified date</Table.Cell>
            <Table.Cell>Status</Table.Cell>
            <Table.Cell>Operation</Table.Cell>
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
              <Table.Cell>
                {/* TODO: update logic */}
                {item.status === "APPROVED" ? (
                  <>
                    <Button
                      data-cy="unsubmitLtftBtnLink"
                      fontWeight="normal"
                      // onClick={onClickEvent}
                      size="small"
                      type="reset"
                    >
                      Unsubmit
                    </Button>
                    <Button
                      data-cy="withdrawLtftBtnLink"
                      fontWeight="normal"
                      // onClick={onClickEvent}
                      size="small"
                      type="reset"
                    >
                      Withdraw
                    </Button>
                  </>
                ) : null}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default LtftSummary;
