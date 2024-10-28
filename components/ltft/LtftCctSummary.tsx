import { Card, Col, Label, Row, SummaryList } from "nhsuk-react-components";
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
          <Card.Description>
            This uses the CCT Calculation data you provide to estimate a new
            Programme end date.
          </Card.Description>

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
        </Card.Content>
      </Card>
      <Card>
        <Card.Content>
          <Card.Heading style={{ color: "#005eb8" }}>
            For your information
          </Card.Heading>
          <Card.Description>
            Below shows the effect of all standard WTE percentages on your
            Linked Programme end date.
          </Card.Description>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>WTE</SummaryList.Key>
              <SummaryList.Value>New Programme end date</SummaryList.Value>
            </SummaryList.Row>
            {summaryData.slice(1).map(item => (
              <SummaryList.Row key={item.ftePercent}>
                <SummaryList.Key>{item.ftePercent}</SummaryList.Key>
                <SummaryList.Value>{item.newEndDate}</SummaryList.Value>
              </SummaryList.Row>
            ))}
          </SummaryList>
        </Card.Content>
      </Card>
    </>
  );
}
