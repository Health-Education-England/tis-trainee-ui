import { Table } from "nhsuk-react-components";
import ErrorPage from "../../common/ErrorPage";
import dayjs from "dayjs";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../../redux/slices/traineeProfileSlice";

export function CctProgrammesList() {
  const progsArr = useAppSelector(selectTraineeProfile).programmeMemberships;
  if (!progsArr.length) {
    return (
      <ErrorPage message="No programmes found. Please try again by refreshing the page to reload." />
    );
  }
  return (
    <Table responsive>
      <Table.Head>
        <Table.Row>
          <Table.Cell>Programme name</Table.Cell>
          <Table.Cell>Start date</Table.Cell>
          <Table.Cell>Current completion date</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {progsArr.reduce<JSX.Element[]>((acc, item) => {
          if (dayjs(item.endDate).isAfter(dayjs())) {
            acc.push(
              <Table.Row
                key={item.tisId}
                data-cy={`cct-home-prog-${item.tisId}`}
              >
                <Table.Cell>{item.programmeName}</Table.Cell>
                <Table.Cell
                  data-cy={`cct-home-prog-item-startdate-${item.tisId}`}
                >
                  {dayjs(item.startDate).format("DD/MM/YYYY")}
                </Table.Cell>
                <Table.Cell data-cy={`cct-home-prog-item-end-${item.tisId}`}>
                  {dayjs(item.endDate).format("DD/MM/YYYY")}
                </Table.Cell>
              </Table.Row>
            );
          }
          return acc;
        }, [])}
      </Table.Body>
    </Table>
  );
}
