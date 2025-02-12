import { Table } from "nhsuk-react-components";
import {
  fetchLtftSummaryList,
  LtftSummaryObj
} from "../../../redux/slices/ltftSummaryListSlice";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { useEffect, useState } from "react";
import { Button, CheckboxField } from "@aws-amplify/ui-react";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import useIsBetaTester from "../../../utilities/hooks/useIsBetaTester";
import Loading from "../../common/Loading";
import { mockLtftsList1 } from "../../../mock-data/mock-ltft-data";

type LtftSummaryProps = {
  ltftSummaryList?: LtftSummaryObj[];
};

const LtftSummary = ({ ltftSummaryList }: Readonly<LtftSummaryProps>) => {
  const dispatch = useAppDispatch();
  const isBetaTester = useIsBetaTester();
  useEffect(() => {
    if (isBetaTester) dispatch(fetchLtftSummaryList());
  }, [dispatch, isBetaTester]);

  // TODO: remove the mock data mockLtftsList1 and resume the data from useAppSelector when ready
  // const ltftSummaryList = useAppSelector(
  //   state => state.ltftSummaryList?.ltftList || []
  // );
  // const ltftListStatus = useAppSelector(state => state.ltftSummaryList?.status);
  const ltftSummaries = mockLtftsList1 || [];

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

  const latestSubmitted = sortedLtftSummaries.find(
    i => i.status === "SUBMITTED"
  );

  let content: JSX.Element = <></>;
  // if (ltftListStatus === "loading") content = <Loading />;
  // if (ltftListStatus === "succeeded")
  content = (
    <div>
      <CheckboxField
        data-cy="filterApprovedLtft"
        name="yesToShowApproved"
        value="yes"
        label="APPROVED"
        checked={showApproved}
        onChange={() => setShowApproved(prevShowApproved => !prevShowApproved)}
      />
      <CheckboxField
        data-cy="filterSubmittedLtft"
        name="yesToShowSubmitted"
        value="yes"
        label="SUBMITTED"
        checked={showSubmitted}
        onChange={() =>
          setShowSubmitted(prevShowSubmitted => !prevShowSubmitted)
        }
      />
      <CheckboxField
        data-cy="filterWithdrawnLtft"
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
            <Table.Cell>Status</Table.Cell>
            <Table.Cell>Status date</Table.Cell>
            <Table.Cell>Operations</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {sortedLtftSummaries.map((item, index) => {
            return (
              <Table.Row
                key={index}
                // TODO: click to show LTFT details
                // onClick={e => {
                //   e.stopPropagation();
                //   history.push(`/ltft/view/${row.original.id}`);
                // }}
              >
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>
                  {new Date(item.created).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{item.status}</Table.Cell>
                <Table.Cell data-cy={`lastModified-${index}`}>
                  {new Date(item.lastModified).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {item.status === "SUBMITTED" && item === latestSubmitted ? (
                    <>
                      <Button
                        data-cy="unsubmitLtftBtnLink"
                        fontWeight="normal"
                        // onClick={onClickEvent}
                        size="small"
                        type="reset"
                        style={{ marginRight: "0.5em" }}
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
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
  return content;
};

export default LtftSummary;
