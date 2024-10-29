import {
  BackLink,
  Button,
  Card,
  Col,
  Label,
  Row,
  Table
} from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import { LtftType } from "../../redux/slices/ltftSlice";
import dayjs from "dayjs";
import {
  calculateNewEndDates,
  findLinkedProgramme,
  standardWtePercents
} from "../../utilities/CctUtilities";
import ScrollToTop from "../common/ScrollToTop";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { Redirect } from "react-router-dom";
import history from "../navigation/history";

export function LtftCctSummary() {
  const progsArr = useAppSelector(selectTraineeProfile).programmeMemberships;
  const { programmeMembershipId, cct }: LtftType = useAppSelector(
    state => state.ltft.ltftApplicationData
  );
  const linkedProg = findLinkedProgramme(programmeMembershipId, progsArr);

  const summaryData = calculateNewEndDates(
    cct.currentWte as number,
    [
      { value: `${cct.newWte}`, label: `${cct.newWte}%` },
      ...standardWtePercents
    ],
    cct.startDate,
    cct.endDate,
    cct.linkedProgEndDate as Date
  );

  if (!linkedProg) {
    return <Redirect to="/ltft/cct-calculation" />;
  }

  return (
    <>
      <ScrollToTop />
      <Card>
        <Card.Content>
          <Card.Heading style={{ color: "#005eb8" }}>
            CCT Calculation Summary
          </Card.Heading>
          <Row>
            <Col width="one-third">
              <BackLink
                data-cy="backLink-to-cct-calculation"
                className="back-link"
                onClick={() => history.push("/ltft/cct-calculation")}
              >
                Back to edit calculation
              </BackLink>
            </Col>
          </Row>
          <Row>
            <Col width="one-half">
              <Label style={{ margin: 0 }} size="s">
                Linked Programme
              </Label>

              <p>{`${linkedProg?.programmeName} (${dayjs(
                linkedProg?.startDate
              ).format("DD/MM/YYYY")} to ${dayjs(linkedProg?.endDate).format(
                "DD/MM/YYYY"
              )})`}</p>
            </Col>
          </Row>
          <Row>
            <Col width="one-half">
              <Label style={{ margin: 0 }} size="s">
                Current WTE
              </Label>
              <p>{`${cct.currentWte}%`}</p>
            </Col>
            <Col width="one-half">
              <Label style={{ margin: 0 }} size="s">
                Proposed WTE changes
              </Label>
              <p>{`${cct.newWte}% from ${dayjs(cct.startDate).format(
                "DD/MM/YYYY"
              )} to ${dayjs(cct.endDate).format("DD/MM/YYYY")}`}</p>
            </Col>
          </Row>
          <Row>
            <Col width="one-half">
              <Label style={{ margin: 0 }} size="s">
                {`Current Programme end date (${cct.currentWte}%)`}
              </Label>
              <p>{dayjs(cct.linkedProgEndDate).format("DD/MM/YYYY")}</p>
            </Col>
            <Col width="one-half">
              <Label style={{ margin: 0 }} size="s">
                {`New Programme end date (${cct.newWte}%)`}
              </Label>
              <p>{summaryData[0].newEndDate}</p>
            </Col>
          </Row>
          <Row>
            <Col width="one-third">
              <Button
                type="button"
                onClick={() => alert("Submit calculation")}
                data-cy="submit-cct-calculation"
              >
                Submit calculation
              </Button>
            </Col>
            <Col width="one-third">
              <Button
                secondary
                type="button"
                onClick={() => alert("Save PDF")}
                data-cy="save-cct-pdf"
              >
                Save PDF
              </Button>
            </Col>
          </Row>
          <br />
          <Table style={{ color: "GrayText" }} caption="For your information">
            <Table.Head>
              <Table.Row>
                <Table.Cell>WTE</Table.Cell>
                <Table.Cell>New Programme end date</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {summaryData.slice(1).map(item => (
                <Table.Row key={item.ftePercent}>
                  <Table.Cell>{item.ftePercent}</Table.Cell>
                  <Table.Cell>{item.newEndDate}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Content>
      </Card>
    </>
  );
}
