import { Card, Col, Label, Row, SummaryList } from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import { LtftType } from "../../redux/slices/ltftSlice";
import dayjs from "dayjs";
import { calculateNewEndDates } from "../../utilities/CctUtilities";

export function LtftCctSummary() {
  const { programmeMembershipId, cct }: LtftType = useAppSelector(
    state => state.ltft.ltftApplicationData
  );

  const summaryData = calculateNewEndDates(
    cct.currentWte as number,
    [
      { value: `${cct.newWte}`, label: `${cct.newWte}%` },
      { value: "100", label: "100%" },
      { value: "80", label: "80%" },
      { value: "70", label: "70%" },
      { value: "60", label: "60%" },
      { value: "50", label: "50%" }
    ],
    cct.startDate,
    cct.endDate,
    cct.linkedProgEndDate as Date
  );

  return (
    <>
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
              {/* TODO: replace with actual programme name */}
              <p>{programmeMembershipId}</p>
            </Col>
          </Row>
          <Row>
            <Col width="one-quarter">
              <Label style={{ margin: 0 }} size="s">
                Current WTE
              </Label>
              <p>{`${cct.currentWte}%`}</p>
            </Col>
          </Row>
          <Row>
            <Col width="one-quarter">
              <Label style={{ margin: 0 }} size="s">
                Proposed WTE
              </Label>
              <p>{`${cct.newWte}%`}</p>
            </Col>
            <Col width="one-half">
              <Label style={{ margin: 0 }} size="s">
                Proposed start & end dates
              </Label>
              <p>{`${dayjs(cct.startDate).format("DD/MM/YYYY")} - ${dayjs(
                cct.endDate
              ).format("DD/MM/YYYY")}`}</p>
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
            Below shows the effect of all standard WTE changes on your chosen
            Programme end date for proposed start and end dates.
          </Card.Description>
          <Row>
            <Col width="one-third" style={{ color: "#005eb8" }}>
              <b>WTE</b>
            </Col>
            <Col width="one-third" style={{ color: "#005eb8" }}>
              <b>New Programme end date</b>
            </Col>
          </Row>
          <SummaryList>
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
