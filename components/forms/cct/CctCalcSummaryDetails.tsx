import {
  Card,
  Col,
  Container,
  Row,
  SummaryList,
  Table,
  WarningCallout
} from "nhsuk-react-components";
import { CctCalculation } from "../../../redux/slices/cctSlice";
import style from "../../Common.module.scss";
import dayjs from "dayjs";
import { CalcDetails } from "./CctCalcCreate";
import {
  getCalculationTypeConfig,
  hasWteChangeField
} from "../../../utilities/CctUtilities";

export function CctCalcSummaryDetails({
  viewedCalc
}: Readonly<{
  viewedCalc: CctCalculation;
}>) {
  const { programmeMembership, cctDate, changes, name, created, lastModified } =
    viewedCalc;

  return (
    <Card className="pdf-visible">
      <WarningCallout>
        <WarningCallout.Label data-cy="cct-calc-warning-label">
          Projected completion date
        </WarningCallout.Label>
        <p data-cy="cct-calc-warning-text1">
          Please note: the new completion date shown below is indicative and
          does not take into account your full circumstances.
        </p>
        <p data-cy="cct-calc-warning-text2">
          Your formal completion date will be agreed at ARCP.
        </p>
      </WarningCallout>
      <Card.Content>
        <Card.Heading data-cy="cct-calc-summary-header">
          CCT Calculation Summary
        </Card.Heading>
        <Container>
          <Row>
            <Col width="full">
              <SummaryList noBorder>
                <h3 className={style.panelSubHeader}>Linked Programme</h3>
                <SummaryList.Row>
                  <SummaryList.Key>Programme name</SummaryList.Key>
                  <SummaryList.Value>
                    {programmeMembership.name}
                  </SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Start date</SummaryList.Key>
                  <SummaryList.Value>
                    {dayjs(programmeMembership.startDate).format("DD/MM/YYYY")}
                  </SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Completion date</SummaryList.Key>
                  <SummaryList.Value>
                    {dayjs(programmeMembership.endDate).format("DD/MM/YYYY")}
                  </SummaryList.Value>
                </SummaryList.Row>

                <h3 className={style.panelSubHeader}>Changes</h3>
                <Table
                  responsive
                  className="cct-results-table"
                  data-cy="cct-summary-table"
                >
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>Change</Table.Cell>
                      <Table.Cell>Type</Table.Cell>
                      <Table.Cell>Start date</Table.Cell>
                      <Table.Cell>End date</Table.Cell>
                      <Table.Cell>Days added</Table.Cell>
                      <Table.Cell>Resulting completion date</Table.Cell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {changes.map((change, index) => {
                      const typeConfig = change.type
                        ? getCalculationTypeConfig(change.type)
                        : null;
                      return (
                        <Table.Row
                          key={change.id ?? `change-${index}`}
                          data-cy={`change-summary-${index}`}
                        >
                          <Table.Cell>{index + 1}</Table.Cell>
                          <Table.Cell>
                            {typeConfig?.shortLabel ?? change.type}
                            {change.type &&
                              hasWteChangeField(change.type) &&
                              change.wte &&
                              ` (${change.wte * 100}%)`}
                          </Table.Cell>
                          <Table.Cell>
                            {dayjs(change.startDate).format("DD/MM/YYYY")}
                          </Table.Cell>
                          <Table.Cell>
                            {dayjs(change.endDate).isSame(
                              dayjs(programmeMembership.endDate),
                              "day"
                            )
                              ? "End of programme"
                              : dayjs(change.endDate).format("DD/MM/YYYY")}
                          </Table.Cell>
                          <Table.Cell data-cy={`days-added-${index}`}>
                            {change.daysAdded}
                          </Table.Cell>
                          <Table.Cell
                            data-cy={`change-resulting-cct-${index}`}
                            style={{ color: "teal", fontWeight: "bold" }}
                          >
                            {dayjs(change.resultingCctDate).format(
                              "DD/MM/YYYY"
                            )}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>

                {changes.length > 0 && (
                  <>
                    <h3 className={style.panelSubHeader}>Completion date</h3>
                    <SummaryList.Row>
                      <SummaryList.Key>
                        Estimated new completion date
                      </SummaryList.Key>
                      <SummaryList.Value
                        style={{
                          color: "teal",
                          fontWeight: "bold",
                          fontSize: "1.2em"
                        }}
                        data-cy="saved-cct-date"
                      >
                        {cctDate && dayjs(cctDate).format("DD/MM/YYYY")}
                      </SummaryList.Value>
                    </SummaryList.Row>
                  </>
                )}
              </SummaryList>
            </Col>
          </Row>
        </Container>
        {name && created && lastModified && (
          <CalcDetails
            created={created}
            lastModified={lastModified}
            name={name}
          />
        )}
      </Card.Content>
    </Card>
  );
}
