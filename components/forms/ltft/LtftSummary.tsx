import { Table } from "nhsuk-react-components";
import { LtftSummaryObj } from "../../../redux/slices/ltftSummaryListSlice";
import { DateUtilities } from "../../../utilities/DateUtilities";

type LtftSummaryProps = {
  ltftSummaryList?: LtftSummaryObj[];
};

const LtftSummary = ({ ltftSummaryList }: Readonly<LtftSummaryProps>) => {
  const ltftSummaries = ltftSummaryList || [];

  const nonDraftLtftSummaries = ltftSummaries.filter(
    item => item.status !== "DRAFT"
  );

  const sortedLtftSummaries = DateUtilities.genericSort(
    nonDraftLtftSummaries.slice(),
    "lastModified",
    true
  );

  return (
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
            <Table.Cell>
              {new Date(item.lastModified).toLocaleDateString()}
            </Table.Cell>
            <Table.Cell>{item.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default LtftSummary;
