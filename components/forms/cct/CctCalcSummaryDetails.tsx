import {
  Card,
  Col,
  Container,
  Row,
  SummaryList,
  WarningCallout
} from "nhsuk-react-components";
import { CctCalculation } from "../../../redux/slices/cctSlice";
import { LtftFormStatus } from "../../../redux/slices/ltftSlice";
import style from "../../Common.module.scss";
import dayjs from "dayjs";
import { Button as BtnAmplify } from "@aws-amplify/ui-react";
import { CalcDetails } from "./CctCalcCreate";
import { useState } from "react";
import {
  getStartDateValidationSchema,
  getWteValidationSchema
} from "./cctCalcValidationSchema";
import { recalculateCctDate } from "../../../utilities/ltftUtilities";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import TextInputField from "../TextInputField";

export function CctCalcSummaryDetails({
  viewedCalc,
  ltftFormStatus
}: Readonly<{
  viewedCalc: CctCalculation;
  ltftFormStatus?: LtftFormStatus;
}>) {
  const { programmeMembership, cctDate, changes, name, created, lastModified } =
    viewedCalc;

  const hasChanges = changes.length > 0;
  const initChangeDateValue = dayjs(changes[0].startDate);
  const initWteValue = ((changes[0].wte as number) * 100).toString();

  const [editableFields, setEditableFields] = useState({
    changeDate: false,
    wte: false
  });

  const [displayValues, setDisplayValues] = useState({
    changeDate: hasChanges ? initChangeDateValue.format("DD/MM/YYYY") : "",
    wte: hasChanges ? `${initWteValue}%` : ""
  });

  const isEditMode = editableFields.changeDate || editableFields.wte;

  const toggleEditMode = (field: "changeDate" | "wte") => {
    setEditableFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validationSchema = Yup.object().shape({
    changeDate: getStartDateValidationSchema(programmeMembership),
    wte: getWteValidationSchema(programmeMembership)
  });

  const handleSubmit = (
    values: { changeDate: string; wte: string },
    { setSubmitting }: FormikHelpers<{ changeDate: string; wte: string }>
  ) => {
    recalculateCctDate(
      programmeMembership.endDate,
      programmeMembership.wte as number,
      values.changeDate,
      values.wte
    );
    setDisplayValues({
      changeDate: dayjs(values.changeDate).format("DD/MM/YYYY"),
      wte: `${values.wte}%`
    });
    setEditableFields({
      changeDate: false,
      wte: false
    });
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        changeDate: hasChanges ? initChangeDateValue.format("YYYY-MM-DD") : "",
        wte: hasChanges ? initWteValue : ""
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid }) => (
        <Form>
          <Card className="pdf-visible">
            <WarningCallout>
              <WarningCallout.Label data-cy="cct-calc-warning-label">
                New completion date
              </WarningCallout.Label>
              <p data-cy="cct-calc-warning-text1">
                Please note: the new completion date shown below is indicative
                and does not take into account your full circumstances (e.g. Out
                of Programme, Parental Leave).
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
                  <Col width="three-quarters">
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
                          {dayjs(programmeMembership.startDate).format(
                            "DD/MM/YYYY"
                          )}
                        </SummaryList.Value>
                      </SummaryList.Row>
                      <SummaryList.Row>
                        <SummaryList.Key>Completion date</SummaryList.Key>
                        <SummaryList.Value>
                          {dayjs(programmeMembership.endDate).format(
                            "DD/MM/YYYY"
                          )}
                        </SummaryList.Value>
                      </SummaryList.Row>
                      <h3 className={style.panelSubHeader}>
                        Current WTE percentage
                      </h3>
                      <SummaryList.Row>
                        <SummaryList.Key>WTE</SummaryList.Key>
                        <SummaryList.Value>
                          {programmeMembership.wte &&
                            programmeMembership.wte * 100}
                          %
                        </SummaryList.Value>
                      </SummaryList.Row>
                    </SummaryList>
                  </Col>
                </Row>
              </Container>
              <Container
                className={
                  ltftFormStatus === "UNSUBMITTED" ? "cct-calc-container" : ""
                }
              >
                <Row>
                  <Col width="full">
                    {ltftFormStatus === "UNSUBMITTED" && (
                      <WarningCallout>
                        <WarningCallout.Label>
                          Recalculating your New completion date
                        </WarningCallout.Label>
                        <p>
                          If required, please edit the{" "}
                          <strong>Change date</strong> and/or{" "}
                          <strong>Proposed WTE</strong> values to recalculate
                          your <strong>New completion date</strong>.
                        </p>
                        <p>
                          Please note: Any updated values are not saved until
                          you 're-submit' the application (see below).
                        </p>
                      </WarningCallout>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col
                    width={
                      ltftFormStatus === "UNSUBMITTED" ? "two-thirds" : "full"
                    }
                  >
                    <h3 className={style.panelSubHeader}>Proposed changes</h3>
                    <SummaryList noBorder>
                      <SummaryList.Row>
                        <SummaryList.Key>Change type</SummaryList.Key>
                        <SummaryList.Value>
                          {changes[0].type === "LTFT" &&
                            "Changing hours (LTFT)"}
                        </SummaryList.Value>
                      </SummaryList.Row>
                      <SummaryList.Row>
                        <SummaryList.Key>Change date</SummaryList.Key>
                        <SummaryList.Value>
                          {editableFields.changeDate ? (
                            <TextInputField
                              name="changeDate"
                              label="Change date"
                              type="date"
                              data-cy="change-date-input"
                              hidelabel
                            />
                          ) : (
                            <span>{displayValues.changeDate}</span>
                          )}
                        </SummaryList.Value>
                        {ltftFormStatus === "UNSUBMITTED" && (
                          <SummaryList.Actions>
                            <BtnAmplify
                              type="button"
                              size="small"
                              style={{ minWidth: "9em" }}
                              onClick={() => toggleEditMode("changeDate")}
                            >
                              {editableFields.changeDate ? "Revert" : "Edit"}
                            </BtnAmplify>
                          </SummaryList.Actions>
                        )}
                      </SummaryList.Row>
                      <SummaryList.Row>
                        <SummaryList.Key>Proposed WTE</SummaryList.Key>
                        <SummaryList.Value data-cy="cct-view-new-wte">
                          {editableFields.wte ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <TextInputField
                                name="wte"
                                label="Proposed WTE"
                                width={2}
                                data-cy="wte-input"
                                hidelabel
                              />
                              <span
                                style={{
                                  marginBottom: "auto",
                                  marginTop: "0.5rem",
                                  marginLeft: "0.25rem"
                                }}
                              >
                                %
                              </span>
                            </div>
                          ) : (
                            <span>{displayValues.wte}</span>
                          )}
                        </SummaryList.Value>
                        {ltftFormStatus === "UNSUBMITTED" && (
                          <SummaryList.Actions>
                            <BtnAmplify
                              type="button"
                              size="small"
                              style={{ minWidth: "9em" }}
                              onClick={() => toggleEditMode("wte")}
                            >
                              {editableFields.wte ? "Revert" : "Edit"}
                            </BtnAmplify>
                          </SummaryList.Actions>
                        )}
                      </SummaryList.Row>
                      <SummaryList.Row>
                        <SummaryList.Key>New completion date</SummaryList.Key>
                        <SummaryList.Value
                          style={{
                            color: isEditMode ? "grey" : "teal",
                            fontWeight: "bold"
                          }}
                          data-cy="saved-cct-date"
                        >
                          {cctDate && dayjs(cctDate).format("DD/MM/YYYY")}
                        </SummaryList.Value>
                        {ltftFormStatus === "UNSUBMITTED" && isEditMode && (
                          <SummaryList.Actions>
                            <BtnAmplify
                              type="submit"
                              data-cy="cct-recalculate-btn"
                              style={{
                                minWidth: "8em",
                                backgroundColor: "teal",
                                color: "white"
                              }}
                              isDisabled={!isValid}
                            >
                              Recalculate
                            </BtnAmplify>
                          </SummaryList.Actions>
                        )}
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
        </Form>
      )}
    </Formik>
  );
}
