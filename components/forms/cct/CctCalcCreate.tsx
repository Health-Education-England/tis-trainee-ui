import { Fragment, useState } from "react";
import {
  BackLink,
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
  WarningCallout
} from "nhsuk-react-components";
import ScrollToTop from "../../common/ScrollToTop";
import { FieldArray, Form, Formik } from "formik";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../../redux/slices/traineeProfileSlice";
import { AutocompleteSelect } from "../../common/AutocompleteSelect";
import style from "../../Common.module.scss";
import {
  calcLtftChange,
  findLinkedProgramme,
  makeProgrammeOptions,
  setDefaultProgrammeOption
} from "../../../utilities/CctUtilities";
import { Modal } from "../../common/Modal";
import dayjs from "dayjs";
import TextInputField from "../TextInputField";
import history from "../../navigation/history";
import {
  CctCalculation,
  defaultCctCalc,
  updatedCctCalc,
  updatedNewCalcMade
} from "../../../redux/slices/cctSlice";
import { cctValidationSchema } from "./cctCalcValidationSchema";
import { Link } from "react-router-dom";
import FieldWarningMsg from "../FieldWarningMsg";
import SelectInputField from "../SelectInputField";
import { TraineeProfileName } from "../../../models/TraineeProfile";
import {
  cctCalcWarningsMsgs,
  fteOptions,
  getProfilePanelFutureWarningText
} from "../../../utilities/Constants";
import { ProfilePanels } from "../../profile/ProfilePanels";
import { isPastIt } from "../../../utilities/DateUtilities";

type CctCalculationErrors = {
  programmeMembership?: {
    id?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    wte?: string;
  };
  changes?: {
    type?: string;
    startDate?: string;
    wte?: string;
  }[];
};

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
  const { noActiveProgsMsg, shortNoticeMsg, wteCustomMsg, wteIncreaseMsg } =
    cctCalcWarningsMsgs;

  return (
    <>
      <ScrollToTop />
      <BackLink
        className="back-link"
        data-cy="backLink-to-cct-home"
        onClick={() => history.push("/cct")}
      >
        Back to CCT Home
      </BackLink>

      <Card>
        <Card.Content>
          <Card.Heading data-cy="cct-calc-header">
            CCT Calculator - Changing hours (LTFT)
          </Card.Heading>
          <WarningCallout data-cy="cct-calc-warning">
            <WarningCallout.Label visuallyHiddenText={false}>
              Please note
            </WarningCallout.Label>
            <p>
              This calculator is designed to show you the effect a change of
              working hours (e.g. going Less Than Full Time) would have on your
              programme completion date. Your formal CCT date will be confirmed
              at ARCP.
            </p>
            <p>
              {`We plan to expand the calculator's functionality in future
              releases to allow for other types of change (e.g. Out of
              Programme, Parental Leave) to be added to the calculation.`}
            </p>
            <p>
              If your programme is not listed, please{" "}
              <Link to="/support">contact your Local Office support</Link>
            </p>
          </WarningCallout>
          {progsArrNotPast.length > 0 ? (
            <>
              <ProgrammesModal
                isOpen={showProgModal}
                onClose={handleProgModalClose}
              />
              <Formik
                initialValues={initialFormData}
                validationSchema={cctValidationSchema}
                onSubmit={(values: CctCalculation) => {
                  const newCctEndDate = calcLtftChange(
                    values.programmeMembership.endDate,
                    values.programmeMembership.wte as number,
                    values.changes[0]
                  );
                  dispatch(
                    updatedCctCalc({ ...values, cctDate: newCctEndDate })
                  );
                  dispatch(updatedNewCalcMade(true));
                  history.push(
                    values.id ? `/cct/view/${values.id}` : "/cct/view"
                  );
                }}
              >
                {({
                  values,
                  errors,
                  setFieldValue,
                  isValid,
                  handleSubmit,
                  resetForm,
                  dirty
                }) => (
                  <Form data-cy="cct-calc-form">
                    <Row>
                      <Col width="two-thirds">
                        <Button
                          type="button"
                          reverse
                          onClick={() => setShowProgModal(true)}
                          data-cy="show-prog-modal-btn"
                        >
                          View your programmes & placements
                        </Button>
                      </Col>
                    </Row>
                    <Container>
                      <h3
                        className={style.panelSubHeader}
                        data-cy="linked-prog-header"
                      >
                        Linked Programme
                      </h3>
                      <Row>
                        <Col width="two-thirds">
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
                                }
                              } else {
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
                      </Row>
                      {values.programmeMembership.id && (
                        <>
                          <Row>
                            <Col width="three-quarters">
                              <Table responsive data-cy="linked-prog-table">
                                <Table.Head>
                                  <Table.Row>
                                    <Table.Cell data-cy="table-header-linked-prog-name">
                                      Linked Programme
                                    </Table.Cell>
                                    <Table.Cell>Start date</Table.Cell>
                                    <Table.Cell>
                                      Current Completion date (on TIS)
                                    </Table.Cell>
                                  </Table.Row>
                                </Table.Head>
                                <Table.Body>
                                  <Table.Row>
                                    <Table.Cell data-cy="table-data-linked-prog-name">
                                      {values.programmeMembership.name}
                                    </Table.Cell>
                                    <Table.Cell>
                                      {dayjs(
                                        values.programmeMembership.startDate
                                      ).format("DD/MM/YYYY")}
                                    </Table.Cell>
                                    <Table.Cell>
                                      {dayjs(
                                        values.programmeMembership.endDate
                                      ).format("DD/MM/YYYY")}
                                    </Table.Cell>
                                  </Table.Row>
                                </Table.Body>
                              </Table>
                            </Col>
                          </Row>
                          <h3
                            className={style.panelSubHeader}
                            data-cy="currentWte-header"
                          >
                            Current WTE percentage
                          </h3>
                          <Row>
                            <Col width="one-half">
                              <AutocompleteSelect
                                value={values.programmeMembership.wte}
                                onChange={(field, value) => {
                                  const parsedValue =
                                    typeof value === "string" &&
                                    value.endsWith("%")
                                      ? Number(value.slice(0, -1))
                                      : value;
                                  if (parsedValue) {
                                    setFieldValue(field, parsedValue / 100);
                                  } else {
                                    setFieldValue(field, null);
                                  }
                                }}
                                error={
                                  (
                                    errors.programmeMembership as CctCalculationErrors["programmeMembership"]
                                  )?.wte
                                }
                                options={fteOptions}
                                name="programmeMembership.wte"
                                label=""
                                isMulti={false}
                                closeMenuOnSelect={true}
                                isCreatable={true}
                                defaultOption={
                                  values.programmeMembership.wte && {
                                    value: values.programmeMembership.wte,
                                    label: `${
                                      values.programmeMembership.wte * 100
                                    }%`
                                  }
                                }
                              />
                            </Col>
                          </Row>
                        </>
                      )}
                      {values.programmeMembership.id &&
                      values.programmeMembership.wte ? (
                        <>
                          <h3
                            className={style.panelSubHeader}
                            data-cy="proposed-changes-header"
                          >
                            Proposed changes
                          </h3>
                          <FieldArray
                            name="changes"
                            render={_ => (
                              <div>
                                {values.changes.map((_, index: number) => (
                                  <Fragment key={index}>
                                    <div
                                      style={{
                                        background: "#D8DDE0",
                                        border: "solid grey 4px",
                                        padding: "16px",
                                        marginBottom: "16px"
                                      }}
                                    >
                                      <Row>
                                        <Col width="one-quarter">
                                          <SelectInputField
                                            name={`changes[${index}].type`}
                                            label="Change type"
                                            options={[
                                              {
                                                value: "LTFT",
                                                label: "WTE (e.g. LTFT)"
                                              }
                                            ]}
                                            disabled={true}
                                          />
                                        </Col>
                                        <Col width="one-quarter">
                                          <TextInputField
                                            name={`changes[${index}].startDate`}
                                            label="Start date"
                                            type="date"
                                            data-cy="change-start-date"
                                          />
                                          {!(
                                            errors.changes as CctCalculationErrors["changes"]
                                          )?.[index]?.startDate &&
                                            dayjs(
                                              values.changes[index].startDate
                                            ) <
                                              dayjs()
                                                .add(16, "week")
                                                .subtract(1, "day") && (
                                              <span data-cy="start-short-notice-warn">
                                                <FieldWarningMsg
                                                  warningMsg={shortNoticeMsg}
                                                />
                                              </span>
                                            )}
                                        </Col>
                                        <Col width="one-quarter">
                                          {values.changes[index].type !==
                                            "LTFT" ||
                                            (!values.changes[index].type && (
                                              <TextInputField
                                                name={`changes[${index}].endDate`}
                                                label="End date"
                                                type="date"
                                                data-cy="change-date"
                                              />
                                            ))}
                                        </Col>
                                        <Col width="one-quarter">
                                          {values.changes[index].type ===
                                            "LTFT" && (
                                            <AutocompleteSelect
                                              value={
                                                values.changes[index].wte ??
                                                null
                                              }
                                              onChange={(field, value) => {
                                                const parsedValue =
                                                  typeof value === "string" &&
                                                  value.endsWith("%")
                                                    ? Number(value.slice(0, -1))
                                                    : value;
                                                if (parsedValue) {
                                                  setFieldValue(
                                                    field,
                                                    parsedValue / 100
                                                  );
                                                } else {
                                                  setFieldValue(field, null);
                                                }
                                              }}
                                              error={
                                                errors.changes &&
                                                (
                                                  errors.changes as CctCalculationErrors["changes"]
                                                )?.[index]?.wte
                                              }
                                              options={fteOptions}
                                              name={`changes[${index}].wte`}
                                              label="Proposed WTE (%)"
                                              isMulti={false}
                                              closeMenuOnSelect={true}
                                              isCreatable={true}
                                              defaultOption={
                                                values.changes[index].wte
                                                  ? {
                                                      value:
                                                        values.changes[index]
                                                          .wte,
                                                      label: `${
                                                        (values.changes[index]
                                                          .wte as number) * 100
                                                      }%`
                                                    }
                                                  : null
                                              }
                                            />
                                          )}
                                          {!(
                                            errors.changes as CctCalculationErrors["changes"]
                                          )?.[index]?.wte &&
                                            (values.changes[index]
                                              ?.wte as number) >
                                              (values.programmeMembership
                                                .wte as number) && (
                                              <span data-cy="wte-increase-return-warn">
                                                <FieldWarningMsg
                                                  warningMsg={wteIncreaseMsg}
                                                />
                                              </span>
                                            )}
                                          {!(
                                            errors.changes as CctCalculationErrors["changes"]
                                          )?.[index]?.wte &&
                                            values.changes[index].wte &&
                                            !fteOptions.some(
                                              option =>
                                                option.value ===
                                                (values.changes[index]
                                                  .wte as number) *
                                                  100
                                            ) && (
                                              <span data-cy="wte-custom-warn">
                                                <FieldWarningMsg
                                                  warningMsg={wteCustomMsg}
                                                />
                                              </span>
                                            )}
                                        </Col>
                                      </Row>
                                    </div>
                                  </Fragment>
                                ))}
                              </div>
                            )}
                          />
                        </>
                      ) : null}
                      <br />
                      {values.programmeMembership.id && isValid && dirty && (
                        <Row>
                          <Col width="full">
                            <Button
                              data-cy="cct-calc-btn"
                              onClick={() => handleSubmit}
                            >
                              Calculate new completion date
                            </Button>
                          </Col>
                        </Row>
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
            </>
          ) : (
            <p data-cy="cct-only-past-progs-msg">{noActiveProgsMsg}</p>
          )}
        </Card.Content>
      </Card>
    </>
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
        dataSelector={selectTraineeProfile}
        title="Programmes"
        warningText={getProfilePanelFutureWarningText("programmes")}
      />
      <ProfilePanels
        profileName={TraineeProfileName.Placements}
        dataSelector={selectTraineeProfile}
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
