import {
  Card,
  Col,
  Container,
  Row,
  SummaryList,
  WarningCallout
} from "nhsuk-react-components";
import { CctCalculation } from "../../../redux/slices/cctSlice";
import style from "../../Common.module.scss";
import dayjs from "dayjs";
import { CalcDetails } from "./CctCalcCreate";
import { isDateWithin16Weeks } from "../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../FieldWarningMsg";
import { cctCalcWarningsMsgs } from "../../../utilities/CctConstants";
import { fteOptions } from "../../../utilities/Constants";

export function CctCalcSummaryDetails({
  viewedCalc
}: Readonly<{
  viewedCalc: CctCalculation;
}>) {
  const { programmeMembership, cctDate, changes, name, created, lastModified } =
    viewedCalc;
  const { shortNoticeMsg, wteIncreaseMsg, wteCustomMsg } = cctCalcWarningsMsgs;

  return (
    <Card className="pdf-visible">
      <WarningCallout>
        <WarningCallout.Label data-cy="cct-calc-warning-label">
          New completion date
        </WarningCallout.Label>
        <p data-cy="cct-calc-warning-text1">
          Please note: the new completion date shown below is indicative and
          does not take into account your full circumstances (e.g. Out of
          Programme, Parental Leave).
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
                <h3 className={style.panelSubHeader}> Changes</h3>
                <SummaryList.Row>
                  <SummaryList.Key>
                    Full-time hours percentage before change
                  </SummaryList.Key>
                  <SummaryList.Value>
                    {programmeMembership.wte && programmeMembership.wte * 100}%
                  </SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>
                    Full-time hours percentage after change
                  </SummaryList.Key>
                  <SummaryList.Value data-cy="cct-view-new-wte">
                    {changes[0].wte && changes[0].wte * 100}%
                    {changes[0].wte! > programmeMembership.wte! && (
                      <FieldWarningMsg warningMsgs={[wteIncreaseMsg]} />
                    )}
                    {!fteOptions.some(
                      option =>
                        option.value === (changes[0].wte as number) * 100
                    ) && <FieldWarningMsg warningMsgs={[wteCustomMsg]} />}
                  </SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Change start date</SummaryList.Key>
                  <SummaryList.Value>
                    {dayjs(changes[0].startDate).format("DD/MM/YYYY")}
                    {isDateWithin16Weeks(changes[0].startDate, true) && (
                      <FieldWarningMsg warningMsgs={[shortNoticeMsg]} />
                    )}
                    {dayjs(changes[0].startDate).isBefore(
                      dayjs().startOf("day")
                    ) && (
                      <FieldWarningMsg
                        warningMsgs={["Change start date is now in the past"]}
                      />
                    )}
                  </SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>New completion date</SummaryList.Key>
                  <SummaryList.Value
                    style={{
                      color: "teal",
                      fontWeight: "bold"
                    }}
                    data-cy="saved-cct-date"
                  >
                    {cctDate && dayjs(cctDate).format("DD/MM/YYYY")}
                  </SummaryList.Value>
                </SummaryList.Row>
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
