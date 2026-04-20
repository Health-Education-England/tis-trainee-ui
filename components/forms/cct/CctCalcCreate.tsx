import { Fragment, useState } from "react";
import {
  Button,
  Card,
  Checkboxes,
  Col,
  Container,
  Row,
  Table
} from "nhsuk-react-components";
import ScrollToTop from "../../common/ScrollToTop";
import { FieldArray, Form, Formik } from "formik";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../../redux/slices/traineeProfileSlice";
import { AutocompleteSelect } from "../../common/AutocompleteSelect";
import style from "../../Common.module.scss";
import {
  calculateAllChanges,
  findLinkedProgramme,
  getCalculationTypeConfig,
  getCalculationTypeOptions,
  hasWteChangeField,
  makeProgrammeOptions,
  setDefaultProgrammeOption
} from "../../../utilities/CctUtilities";
import { cctValidationSchema } from "./cctCalcValidationSchema";
import { Modal } from "../../common/Modal";
import dayjs from "dayjs";
import TextInputField from "../TextInputField";
import history from "../../navigation/history";
import {
  CalculationType,
  CctCalculation,
  CctChangeType,
  defaultCctCalc,
  defaultCctChange,
  updatedCctCalc,
  updatedNewCalcMade
} from "../../../redux/slices/cctSlice";

import { Link } from "react-router-dom";
import FieldWarningMsg from "../FieldWarningMsg";
import SelectInputField from "../SelectInputField";
import { TraineeProfileName } from "../../../models/TraineeProfile";
import { getProfilePanelFutureWarningText } from "../../../utilities/Constants";
import { cctCalcWarningsMsgs } from "../../../utilities/CctConstants";
import { ProfilePanels } from "../../profile/ProfilePanels";
import { isPastIt } from "../../../utilities/DateUtilities";
import { isDateWithin16WeeksOfFirstDate } from "../../../utilities/FormBuilderUtilities";
import { ExpanderMsg } from "../../common/ExpanderMsg";
import FormBackLink from "../../common/FormBackLink";

type CalculationResult = {
  changes: CctChangeType[];
  finalCctDate: string;
};

function getChangeWarnings(
  change: CctChangeType,
  wteOptions: { value: number; label: string }[],
  wteCustomMsg: string,
  shortNoticeMsg: string,
  pastDateMsg: string
): string[] {
  const warnings: string[] = [];
  if (
    change.type &&
    hasWteChangeField(change.type) &&
    change.wte &&
    !wteOptions.some(option => option.value === (change.wte as number) * 100)
  ) {
    warnings.push(wteCustomMsg);
  }
  if (change.startDate && isPastIt(change.startDate)) {
    warnings.push(pastDateMsg);
  } else if (
    change.type &&
    hasWteChangeField(change.type) &&
    change.startDate &&
    isDateWithin16WeeksOfFirstDate(change.startDate)
  ) {
    warnings.push(shortNoticeMsg);
  }
  return warnings;
}

export function CctCalcCreate() {
  const dispatch = useAppDispatch();
  const progsArrNotPast = useAppSelector(
    selectTraineeProfile
  ).programmeMemberships.filter(prog => !isPastIt(prog.endDate));
  const programmeOptions = makeProgrammeOptions(progsArrNotPast);
  const [showProgModal, setShowProgModal] = useState(false);
  const handleProgModalClose = () => {
    setShowProgModal(false);
  };
  const initialFormData: CctCalculation = useAppSelector(
    state => state.cct.cctCalc
  );
  const { name, created, lastModified } = initialFormData;
  const { noActiveProgsMsg, shortNoticeMsg, wteCustomMsg, pastDateMsg } =
    cctCalcWarningsMsgs;

  const wteOptions = [
    { value: 80, label: "80%" },
    { value: 70, label: "70%" },
    { value: 60, label: "60%" },
    { value: 50, label: "50%" }
  ];
  const isValidWte = (val: number): boolean =>
    Number.isInteger(val) && val >= 1 && val <= 99;

  const changeTypeOptions = getCalculationTypeOptions();

  const [calculationResult, setCalculationResult] =
    useState<CalculationResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const clearCalculation = () => {
    setCalculationResult(null);
    setValidationErrors({});
  };

  const getFieldError = (
    changeIndex: number,
    field: string
  ): string | undefined => validationErrors[`changes[${changeIndex}].${field}`];

  const handleCalculate = async (values: CctCalculation) => {
    try {
      await cctValidationSchema.validate(values, {
        abortEarly: false,
        context: values
      });
    } catch (yupError: any) {
      if (yupError.inner) {
        const errors: Record<string, string> = {};
        for (const err of yupError.inner) {
          if (err.path && !errors[err.path]) {
            errors[err.path] = err.message;
          }
        }
        setValidationErrors(errors);
      }
      setCalculationResult(null);
      return;
    }
    setValidationErrors({});
    const programmeEndDate = values.programmeMembership.endDate as string;
    const updatedChanges = calculateAllChanges(
      values.changes,
      programmeEndDate
    );
    const finalCctDate =
      updatedChanges.at(-1)?.resultingCctDate ?? programmeEndDate;
    setCalculationResult({ changes: updatedChanges, finalCctDate });
  };

  const handleViewSummary = (values: CctCalculation) => {
    if (!calculationResult) return;
    dispatch(
      updatedCctCalc({
        ...values,
        changes: calculationResult.changes,
        cctDate: calculationResult.finalCctDate
      })
    );
    dispatch(updatedNewCalcMade(true));
    history.push(values.id ? `/cct/view/${values.id}` : "/cct/view");
  };

  return (
    <>
      <ScrollToTop />
      <FormBackLink text="Back to CCT Home" />
      <Card>
        <Card.Content>
          <Card.Heading data-cy="cct-calc-header">CCT Calculator</Card.Heading>
          <ExpanderMsg expanderName="cctInfo" />
          <ExpanderMsg expanderName="skilledVisaWorker" />
          {progsArrNotPast.length > 0 ? (
            <div style={{ paddingTop: "1em" }}>
              <ProgrammesModal
                isOpen={showProgModal}
                onClose={handleProgModalClose}
              />
              <Formik
                initialValues={initialFormData}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={() => {}}
              >
                {({ values, setFieldValue, resetForm }) => (
                  <Form data-cy="cct-calc-form">
                    <Container>
                      <h3
                        className={style.panelSubHeader}
                        data-cy="linked-prog-header"
                      >
                        Link your programme
                      </h3>
                      <Row>
                        <Col width="full">
                          <p>
                            If your programme is not listed, please{" "}
                            <Link to="/support" target="_blank">
                              contact your Local Office support
                            </Link>
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col width="one-half">
                          <AutocompleteSelect
                            value={values.programmeMembership.id}
                            onChange={(field, value: string) => {
                              setFieldValue(field, value);
                              if (value) {
                                const selectedProgramme = findLinkedProgramme(
                                  value,
                                  progsArrNotPast
                                );
                                if (selectedProgramme) {
                                  setFieldValue(
                                    "programmeMembership.name",
                                    selectedProgramme.programmeName,
                                    false
                                  );
                                  setFieldValue(
                                    "programmeMembership.startDate",
                                    selectedProgramme.startDate,
                                    true
                                  );
                                  setFieldValue(
                                    "programmeMembership.endDate",
                                    selectedProgramme.endDate,
                                    false
                                  );
                                  setFieldValue(
                                    "programmeMembership.designatedBodyCode",
                                    selectedProgramme.designatedBodyCode,
                                    false
                                  );
                                  setFieldValue(
                                    "programmeMembership.managingDeanery",
                                    selectedProgramme.managingDeanery,
                                    false
                                  );
                                }
                              } else {
                                clearCalculation();
                                resetForm({ values: defaultCctCalc });
                              }
                            }}
                            error=""
                            options={programmeOptions}
                            name="programmeMembership.id"
                            label=""
                            isMulti={false}
                            closeMenuOnSelect={true}
                            defaultOption={setDefaultProgrammeOption(
                              values.programmeMembership.id,
                              progsArrNotPast
                            )}
                          />
                        </Col>
                        <Col width="one-half">
                          <Button
                            type="button"
                            secondary
                            onClick={() => setShowProgModal(true)}
                            data-cy="show-prog-modal-btn"
                          >
                            View your programmes
                          </Button>
                        </Col>
                      </Row>
                      {values.programmeMembership.id && (
                        <>
                          <h3
                            className={style.panelSubHeader}
                            data-cy="proposed-changes-header"
                          >
                            Add your change(s)
                          </h3>
                          <FieldArray
                            name="changes"
                            render={arrayHelpers => (
                              <div>
                                {values.changes.map(
                                  (change: CctChangeType, index: number) => (
                                    <Fragment key={index}>
                                      <div
                                        className="cct-calc-container"
                                        data-cy={`change-row-${index}`}
                                      >
                                        <div className="cct-change-row">
                                          <div className="cct-field-type">
                                            <div
                                              className={
                                                getFieldError(index, "type")
                                                  ? "nhsuk-form-group nhsuk-form-group--error"
                                                  : "nhsuk-form-group"
                                              }
                                            >
                                              <SelectInputField
                                                name={`changes[${index}].type`}
                                                label="Change type"
                                                options={changeTypeOptions}
                                                onChange={(
                                                  e: React.ChangeEvent<HTMLSelectElement>
                                                ) => {
                                                  const newType =
                                                    e.target.value;
                                                  setFieldValue(
                                                    `changes[${index}].type`,
                                                    newType || null
                                                  );
                                                  if (
                                                    !hasWteChangeField(
                                                      newType as CalculationType
                                                    )
                                                  ) {
                                                    setFieldValue(
                                                      `changes[${index}].wte`,
                                                      null
                                                    );
                                                  }
                                                  clearCalculation();
                                                }}
                                              />
                                            </div>
                                          </div>
                                          {change.type &&
                                            hasWteChangeField(change.type) && (
                                              <div className="cct-field-wte">
                                                <div
                                                  className={
                                                    getFieldError(index, "wte")
                                                      ? "nhsuk-form-group nhsuk-form-group--error"
                                                      : "nhsuk-form-group"
                                                  }
                                                >
                                                  <AutocompleteSelect
                                                    value={change.wte ?? null}
                                                    onChange={(
                                                      field,
                                                      value
                                                    ) => {
                                                      if (
                                                        value === null ||
                                                        value === undefined
                                                      ) {
                                                        setFieldValue(
                                                          field,
                                                          null
                                                        );
                                                        clearCalculation();
                                                        return;
                                                      }
                                                      const parsed =
                                                        typeof value ===
                                                        "string"
                                                          ? Number.parseInt(
                                                              value.replace(
                                                                "%",
                                                                ""
                                                              ),
                                                              10
                                                            )
                                                          : Number(value);
                                                      if (
                                                        !Number.isNaN(parsed) &&
                                                        isValidWte(parsed)
                                                      ) {
                                                        setFieldValue(
                                                          field,
                                                          parsed / 100
                                                        );
                                                      } else {
                                                        setFieldValue(
                                                          field,
                                                          null
                                                        );
                                                      }
                                                      clearCalculation();
                                                    }}
                                                    error={
                                                      getFieldError(
                                                        index,
                                                        "wte"
                                                      ) ?? ""
                                                    }
                                                    options={wteOptions}
                                                    name={`changes[${index}].wte`}
                                                    label="LTFT %"
                                                    isMulti={false}
                                                    closeMenuOnSelect={true}
                                                    isCreatable={true}
                                                    defaultOption={
                                                      change.wte
                                                        ? {
                                                            value:
                                                              change.wte * 100,
                                                            label: `${
                                                              change.wte * 100
                                                            }%`
                                                          }
                                                        : null
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            )}
                                          <div className="cct-field-date">
                                            <div
                                              className={
                                                getFieldError(
                                                  index,
                                                  "startDate"
                                                )
                                                  ? "nhsuk-form-group nhsuk-form-group--error"
                                                  : "nhsuk-form-group"
                                              }
                                            >
                                              <TextInputField
                                                name={`changes[${index}].startDate`}
                                                label="Start date"
                                                type="date"
                                                data-cy={`change-start-date-${index}`}
                                              />
                                            </div>
                                          </div>
                                          <div className="cct-field-end-date">
                                            <div
                                              className={
                                                getFieldError(index, "endDate")
                                                  ? "nhsuk-form-group nhsuk-form-group--error"
                                                  : "nhsuk-form-group"
                                              }
                                            >
                                              <span className="nhsuk-label">
                                                End date
                                              </span>
                                              {!dayjs(change.endDate).isSame(
                                                dayjs(
                                                  values.programmeMembership
                                                    .endDate
                                                ),
                                                "day"
                                              ) && (
                                                <TextInputField
                                                  name={`changes[${index}].endDate`}
                                                  label=""
                                                  hidelabel
                                                  type="date"
                                                  data-cy={`change-end-date-${index}`}
                                                />
                                              )}
                                              <Checkboxes>
                                                <Checkboxes.Box
                                                  checked={dayjs(
                                                    change.endDate
                                                  ).isSame(
                                                    dayjs(
                                                      values.programmeMembership
                                                        .endDate
                                                    ),
                                                    "day"
                                                  )}
                                                  onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                  ) => {
                                                    const checked =
                                                      e.target.checked;
                                                    setFieldValue(
                                                      `changes[${index}].endDate`,
                                                      checked
                                                        ? values
                                                            .programmeMembership
                                                            .endDate
                                                        : ""
                                                    );
                                                    clearCalculation();
                                                  }}
                                                  data-cy={`until-end-of-programme-${index}`}
                                                >
                                                  Until end of programme
                                                </Checkboxes.Box>
                                              </Checkboxes>
                                            </div>
                                          </div>
                                          {values.changes.length > 1 && (
                                            <div className="cct-field-remove">
                                              <Button
                                                type="button"
                                                secondary
                                                data-cy={`remove-change-btn-${index}`}
                                                onClick={() => {
                                                  arrayHelpers.remove(index);
                                                  clearCalculation();
                                                }}
                                              >
                                                Remove
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                        <ChangeWarnings
                                          change={change}
                                          index={index}
                                          wteOptions={wteOptions}
                                          wteCustomMsg={wteCustomMsg}
                                          shortNoticeMsg={shortNoticeMsg}
                                          pastDateMsg={pastDateMsg}
                                        />
                                      </div>
                                    </Fragment>
                                  )
                                )}
                                <Row>
                                  <Col width="full">
                                    <Button
                                      type="button"
                                      reverse
                                      data-cy="add-another-change-btn"
                                      onClick={() => {
                                        arrayHelpers.push({
                                          ...defaultCctChange
                                        });
                                        clearCalculation();
                                      }}
                                    >
                                      Add new change
                                    </Button>
                                  </Col>
                                </Row>
                              </div>
                            )}
                          />

                          <Row>
                            <Col width="full">
                              <Button
                                type="button"
                                data-cy="cct-calc-btn"
                                onClick={() => handleCalculate(values)}
                              >
                                Calculate new CCT date
                              </Button>
                            </Col>
                          </Row>

                          {Object.keys(validationErrors).length > 0 && (
                            <Row>
                              <Col width="full">
                                <div
                                  className="nhsuk-error-summary"
                                  data-cy="cct-calc-error"
                                >
                                  <h3 className="nhsuk-error-summary__title">
                                    There is a problem
                                  </h3>
                                  <ul className="nhsuk-list nhsuk-error-summary__list">
                                    {Object.values(validationErrors).map(
                                      (msg, i) => (
                                        <li key={i}>
                                          <span className="nhsuk-error-message">
                                            {msg}
                                          </span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </Col>
                            </Row>
                          )}

                          {calculationResult && (
                            <>
                              <h3
                                className={style.panelSubHeader}
                                data-cy="cct-results-header"
                              >
                                Calculation Results
                              </h3>
                              <Table
                                responsive
                                className="cct-results-table"
                                data-cy="cct-results-table"
                              >
                                <Table.Head>
                                  <Table.Row>
                                    <Table.Cell>Change</Table.Cell>
                                    <Table.Cell>Type</Table.Cell>
                                    <Table.Cell>Start date</Table.Cell>
                                    <Table.Cell>End date</Table.Cell>
                                    <Table.Cell>Days added</Table.Cell>
                                    <Table.Cell>
                                      Resulting completion date
                                    </Table.Cell>
                                  </Table.Row>
                                </Table.Head>
                                <Table.Body>
                                  {calculationResult.changes.map(
                                    (change, index) => {
                                      const typeConfig = change.type
                                        ? getCalculationTypeConfig(change.type)
                                        : null;
                                      return (
                                        <Table.Row
                                          key={`result-${index}`}
                                          data-cy={`result-row-${index}`}
                                        >
                                          <Table.Cell>{index + 1}</Table.Cell>
                                          <Table.Cell>
                                            {typeConfig?.shortLabel ??
                                              change.type}
                                            {change.type &&
                                              hasWteChangeField(change.type) &&
                                              change.wte &&
                                              ` (${change.wte * 100}%)`}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {dayjs(change.startDate).format(
                                              "DD/MM/YYYY"
                                            )}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {dayjs(change.endDate).isSame(
                                              dayjs(
                                                values.programmeMembership
                                                  .endDate
                                              ),
                                              "day"
                                            )
                                              ? "End of programme"
                                              : dayjs(change.endDate).format(
                                                  "DD/MM/YYYY"
                                                )}
                                          </Table.Cell>
                                          <Table.Cell
                                            data-cy={`days-added-${index}`}
                                          >
                                            {change.daysAdded}
                                          </Table.Cell>
                                          <Table.Cell
                                            data-cy={`resulting-cct-date-${index}`}
                                            style={{
                                              color: "teal",
                                              fontWeight: "bold"
                                            }}
                                          >
                                            {dayjs(
                                              change.resultingCctDate
                                            ).format("DD/MM/YYYY")}
                                          </Table.Cell>
                                        </Table.Row>
                                      );
                                    }
                                  )}
                                </Table.Body>
                              </Table>
                              <Row>
                                <Col width="full">
                                  <p
                                    style={{
                                      fontSize: "1.2em",
                                      fontWeight: "bold",
                                      marginTop: "2em"
                                    }}
                                  >
                                    Projected completion date (all changes):{" "}
                                    <span
                                      style={{ color: "teal" }}
                                      data-cy="final-cct-date"
                                    >
                                      {dayjs(
                                        calculationResult.finalCctDate
                                      ).format("DD/MM/YYYY")}
                                    </span>
                                  </p>
                                </Col>
                              </Row>
                              <Row>
                                <Col width="one-third">
                                  <Button
                                    data-cy="cct-view-summary-btn"
                                    onClick={() => handleViewSummary(values)}
                                  >
                                    View calculation summary
                                  </Button>
                                </Col>
                              </Row>
                            </>
                          )}
                        </>
                      )}
                    </Container>
                  </Form>
                )}
              </Formik>
              {name && created && lastModified && (
                <CalcDetails
                  created={created}
                  lastModified={lastModified}
                  name={name}
                />
              )}
            </div>
          ) : (
            <p data-cy="cct-only-past-progs-msg">{noActiveProgsMsg}</p>
          )}
        </Card.Content>
      </Card>
    </>
  );
}

type ChangeWarningsProps = {
  change: CctChangeType;
  index: number;
  wteOptions: { value: number; label: string }[];
  wteCustomMsg: string;
  shortNoticeMsg: string;
  pastDateMsg: string;
};

function ChangeWarnings({
  change,
  index,
  wteOptions,
  wteCustomMsg,
  shortNoticeMsg,
  pastDateMsg
}: Readonly<ChangeWarningsProps>) {
  const warnings = getChangeWarnings(
    change,
    wteOptions,
    wteCustomMsg,
    shortNoticeMsg,
    pastDateMsg
  );
  if (warnings.length === 0) return null;
  return (
    <div className="cct-change-warnings" data-cy={`change-warnings-${index}`}>
      <FieldWarningMsg warningMsgs={warnings} />
    </div>
  );
}

type ProgrammesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ProgrammesModal({ isOpen, onClose }: Readonly<ProgrammesModalProps>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} cancelBtnText="Close">
      <ProfilePanels
        profileName={TraineeProfileName.Programmes}
        title="Programmes"
        warningText={getProfilePanelFutureWarningText("programmes")}
      />
      <ProfilePanels
        profileName={TraineeProfileName.Placements}
        title="Placements"
        warningText={getProfilePanelFutureWarningText("placements")}
      />
    </Modal>
  );
}

type CalcDetailsProps = {
  name: string;
  created: Date | string;
  lastModified: Date | string;
};

export function CalcDetails({
  name,
  created,
  lastModified
}: Readonly<CalcDetailsProps>) {
  return (
    <section data-cy="saved-cct-details">
      <div>{`Name: ${name}`}</div>
      <div>{`Created: ${dayjs(created).toString()}`}</div>
      <div>{`Last saved: ${dayjs(lastModified).toString()}`}</div>
    </section>
  );
}
