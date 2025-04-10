import { Card, SummaryList, WarningCallout } from "nhsuk-react-components";
import { CctCalculation } from "../../../redux/slices/cctSlice";
import { LtftFormStatus } from "../../../redux/slices/ltftSlice";
import style from "../../Common.module.scss";
import dayjs from "dayjs";
import { Button as BtnAmplify } from "@aws-amplify/ui-react";
import { CalcDetails } from "./CctCalcCreate";
import { FormEvent, useState } from "react";
import {
  getStartDateValidationSchema,
  getWteValidationSchema
} from "./cctCalcValidationSchema";
import { validateInput } from "../../../utilities/ltftUtilities";
import { InputField } from "../InputField";

export function CctCalcSummaryDetails({
  viewedCalc,
  ltftFormStatus
}: Readonly<{
  viewedCalc: CctCalculation;
  ltftFormStatus?: LtftFormStatus;
}>) {
  const { programmeMembership, cctDate, changes, name, created, lastModified } =
    viewedCalc;

  // Form state
  const [canEditChangeDate, setCanEditChangeDate] = useState<boolean>(false);
  const [canEditWte, setCanEditWte] = useState<boolean>(false);
  const isEditMode = canEditChangeDate || canEditWte;
  const [changeDateValue, setChangeDateValue] = useState<string>(
    changes.length > 0 ? dayjs(changes[0].startDate).format("YYYY-MM-DD") : ""
  );
  const [wteValue, setWteValue] = useState<string>(
    changes.length > 0 ? ((changes[0].wte as number) * 100).toString() : ""
  );

  const [changeDateError, setChangeDateError] = useState<string | null>(null);
  const [wteError, setWteError] = useState<string | null>(null);

  const dateSchema = getStartDateValidationSchema(programmeMembership);
  const wteSchema = getWteValidationSchema(programmeMembership);

  const validateChangeDate = (value: string): boolean =>
    validateInput(new Date(value), dateSchema, setChangeDateError);

  const validateWte = (value: string): boolean =>
    validateInput(Number(value), wteSchema, setWteError);

  const handleRecalculate = (e: FormEvent) => {
    e.preventDefault();
    console.log("Recalculate clicked");
  };

  return (
    <form onSubmit={handleRecalculate}>
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
          <SummaryList noBorder>
            <h3 className={style.panelSubHeader}>Linked Programme</h3>
            <SummaryList.Row>
              <SummaryList.Key>Programme name</SummaryList.Key>
              <SummaryList.Value>{programmeMembership.name}</SummaryList.Value>
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
            <h3 className={style.panelSubHeader}>Current WTE percentage</h3>
            <SummaryList.Row>
              <SummaryList.Key>WTE</SummaryList.Key>
              <SummaryList.Value>
                {programmeMembership.wte && programmeMembership.wte * 100}%
              </SummaryList.Value>
            </SummaryList.Row>
            <h3 className={style.panelSubHeader}>Proposed changes</h3>

            <SummaryList.Row>
              <SummaryList.Key>Change type</SummaryList.Key>
              <SummaryList.Value>
                {changes[0].type === "LTFT" && "Changing hours (LTFT)"}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Change date</SummaryList.Key>
              <SummaryList.Value>
                <InputField
                  isEditable={canEditChangeDate}
                  type="date"
                  value={changeDateValue}
                  formattedValue={dayjs(changes[0].startDate).format(
                    "DD/MM/YYYY"
                  )}
                  onChange={setChangeDateValue}
                  validate={validateChangeDate}
                  error={changeDateError}
                  inputClassName="date-field"
                  dataCy="change-date-input"
                />
              </SummaryList.Value>
              {ltftFormStatus === "UNSUBMITTED" && (
                <SummaryList.Actions>
                  <BtnAmplify
                    type="button"
                    size="small"
                    style={{ minWidth: "9em" }}
                    onClick={() => setCanEditChangeDate(!canEditChangeDate)}
                  >
                    {canEditChangeDate ? "Revert" : "Edit"}
                  </BtnAmplify>
                </SummaryList.Actions>
              )}
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Proposed WTE</SummaryList.Key>
              <SummaryList.Value data-cy="cct-view-new-wte">
                <InputField
                  isEditable={canEditWte}
                  type="text"
                  value={wteValue}
                  formattedValue={`${changes[0].wte && changes[0].wte * 100} %`}
                  onChange={setWteValue}
                  validate={validateWte}
                  error={wteError}
                  inputClassName="nhsuk-input--width-2"
                  dataCy="wte-input"
                  suffix="%"
                />
              </SummaryList.Value>
              {ltftFormStatus === "UNSUBMITTED" && (
                <SummaryList.Actions>
                  <BtnAmplify
                    type="button"
                    size="small"
                    style={{ minWidth: "9em" }}
                    onClick={() => setCanEditWte(!canEditWte)}
                  >
                    {canEditWte ? "Revert" : "Edit"}
                  </BtnAmplify>
                </SummaryList.Actions>
              )}
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
                    onClick={() => console.log("Recalculate")}
                    isDisabled={!!changeDateError || !!wteError}
                  >
                    Recalculate
                  </BtnAmplify>
                </SummaryList.Actions>
              )}
            </SummaryList.Row>
          </SummaryList>
          {name && created && lastModified && (
            <CalcDetails
              created={created}
              lastModified={lastModified}
              name={name}
            />
          )}
        </Card.Content>
      </Card>
    </form>
  );
}
