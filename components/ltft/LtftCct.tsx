import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import * as Yup from "yup";
import history from "../navigation/history";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { ProfileUtilities } from "../../utilities/ProfileUtilities";
import {
  Button,
  Card,
  Col,
  Container,
  Details,
  Row,
  WarningCallout
} from "nhsuk-react-components";
import {
  PanelsCreator,
  prepareProfilePanelsData
} from "../common/PanelsCreator";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { PANEL_KEYS } from "../../utilities/Constants";
import { Modal } from "../common/Modal";
import { LtftType, updatedLtftData } from "../../redux/slices/ltftSlice";
import { Form, Formik } from "formik";
import { AutocompleteSelect } from "../common/AutocompleteSelect";
import dayjs from "dayjs";
import TextInputField from "../forms/TextInputField";
import ScrollToTop from "../common/ScrollToTop";
import {
  findLinkedProgramme,
  makeProgrammeOptions,
  setDefaultProgrammeOption,
  standardWtePercents
} from "../../utilities/CctUtilities";

export function LtftCct() {
  const dispatch = useAppDispatch();
  const [showProgModal, setShowProgModal] = useState(false);
  const handleProgModalClose = () => {
    setShowProgModal(false);
  };
  const progsArr = useAppSelector(selectTraineeProfile).programmeMemberships;

  const programmeOptions = makeProgrammeOptions(progsArr);
  const percentOptions = standardWtePercents;

  const initialFormData = useAppSelector(
    state => state.ltft.ltftApplicationData
  );

  // const sixteenWkCriteria = dayjs().add(16, "weeks");

  const validationSchema = Yup.object().shape({
    programmeMembershipId: Yup.string()
      .nullable()
      .required("Programme is required"),
    cct: Yup.object({
      linkedProgEndDate: Yup.date(),
      currentWte: Yup.string()
        .nullable()
        .required("WTE percentage (before change) is required.")
        .test(
          "is-percent",
          "WTE must be a number between 1 and 100.",
          value => {
            if (value && value !== null && value !== "") {
              const numValue = Number(value.split("%")[0]);
              return numValue >= 1 && numValue <= 100;
            }
            return false;
          }
        ),
      newWte: Yup.string()
        .nullable()
        .required("Proposed WTE percentage is required.")
        .test(
          "is-percent",
          "WTE must be a number between 1 and 100.",
          value => {
            if (value && value !== null && value !== "") {
              const numValue = Number(value.split("%")[0]);
              return numValue >= 1 && numValue <= 100;
            }
            return false;
          }
        ),
      newWteReason: Yup.array().min(1, "At least one reason is required."),
      startDate: Yup.date()
        .min(dayjs().format("YYYY-MM-DD"), "Start date cannot be before today.")
        .required("Start date is required."),
      endDate: Yup.date()
        .when("linkedProgEndDate", (linkedProgEndDate, schema) => {
          return linkedProgEndDate
            ? schema.max(
                linkedProgEndDate,
                "End date cannot be after the end date of the chosen programme."
              )
            : schema;
        })
        .when("startDate", (startDate, schema) => {
          return startDate
            ? schema.min(startDate, "End date cannot be before the start date.")
            : schema;
        })
    })
  });

  return (
    <>
      <ScrollToTop />
      <Card>
        <Card.Content>
          <Card.Heading style={{ color: "#005eb8" }}>
            CCT Calculation
          </Card.Heading>
          <ProgrammesModal
            isOpen={showProgModal}
            onClose={handleProgModalClose}
          />
          <Formik
            initialValues={initialFormData}
            validationSchema={validationSchema}
            onSubmit={(values: LtftType) => {
              if (values.cct.endDate === "" && values.cct.linkedProgEndDate) {
                values.cct.endDate = values.cct.linkedProgEndDate;
              }
              dispatch(updatedLtftData(values));
              history.push("/ltft/cct-summary");
            }}
          >
            {({ values, errors, setFieldValue, isValid, handleSubmit }) => (
              <Form>
                <Row>
                  <Col width="two-thirds">
                    <Button
                      type="button"
                      reverse
                      onClick={() => setShowProgModal(true)}
                      data-cy="showProgrammesBtn"
                    >
                      View Programmes & Placements
                    </Button>
                  </Col>
                </Row>
                <Container>
                  <h3 style={{ color: "#005eb8", margin: "12px 0" }}>
                    Linked Programme
                  </h3>
                  <Row>
                    <Col width="one-half">
                      <AutocompleteSelect
                        value={values.programmeMembershipId}
                        onChange={(field, value: string) => {
                          setFieldValue(field, value);
                          const selectedProgramme = findLinkedProgramme(
                            value,
                            progsArr
                          );
                          if (selectedProgramme) {
                            setFieldValue(
                              "cct.linkedProgEndDate",
                              selectedProgramme.endDate,
                              false
                            );
                          }
                        }}
                        error={errors.programmeMembershipId}
                        options={programmeOptions}
                        name="programmeMembershipId"
                        label="You propose to make the WTE change in what Programme?"
                        isMulti={false}
                        closeMenuOnSelect={true}
                        data-cy="linked-pm-id-btn"
                        defaultOption={setDefaultProgrammeOption(
                          values.programmeMembershipId,
                          progsArr
                        )}
                      />
                    </Col>
                  </Row>
                  <h3 style={{ color: "#005eb8", margin: "12px 0" }}>
                    WTE change percentages
                  </h3>
                  <Row>
                    <Col width="one-half">
                      <AutocompleteSelect
                        value={values.cct.currentWte}
                        onChange={setFieldValue}
                        error={errors.cct?.currentWte}
                        options={percentOptions}
                        name="cct.currentWte"
                        label="WTE percentage (before change)"
                        isMulti={false}
                        closeMenuOnSelect={true}
                        isCreatable={true}
                        data-cy="current-wte-btn"
                        defaultOption={{
                          label: values.cct.currentWte,
                          value: values.cct.currentWte
                        }}
                      />
                    </Col>
                    <Col width="one-third">
                      <AutocompleteSelect
                        value={values.cct.newWte}
                        onChange={setFieldValue}
                        error={errors.cct?.newWte}
                        options={percentOptions}
                        name="cct.newWte"
                        label="Proposed WTE percentage?"
                        isMulti={false}
                        isCreatable={true}
                        closeMenuOnSelect={true}
                        data-cy="new-wte-btn"
                        defaultOption={{
                          label: values.cct.newWte,
                          value: values.cct.newWte
                        }}
                      />
                    </Col>
                  </Row>
                  <h3 style={{ color: "#005eb8", margin: "12px 0" }}>
                    WTE change date(s)
                  </h3>
                  <Row>
                    <Col width="one-half">
                      <TextInputField
                        label="Proposed start date?"
                        type="date"
                        name="cct.startDate"
                        width={10}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col width="full">
                      {values.cct.startDate &&
                        !errors.programmeMembershipId &&
                        !errors.cct?.startDate && (
                          <TextInputField
                            label="Proposed end date?"
                            type="date"
                            name="cct.endDate"
                            width={10}
                            hint={`Leaving this blank will default to your Linked Programme end date: ${dayjs(
                              findLinkedProgramme(
                                values.programmeMembershipId,
                                progsArr
                              )?.endDate
                            ).format("DD/MM/YYYY")}.`}
                          />
                        )}
                    </Col>
                  </Row>

                  <Row>
                    <Col width="one-half">
                      <Button
                        data-cy="cct-calc-btn"
                        onClick={() => handleSubmit}
                        disabled={!isValid}
                      >
                        Calculate
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Form>
            )}
          </Formik>
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
      <ProgrammesForViewing />
      <PlacementsForViewing />
    </Modal>
  );
}

function ProgrammesForViewing() {
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships;
  const groupedProgrammes = useMemo(() => {
    return ProfileUtilities.groupDateBoxedByDate(programmesArr);
  }, [programmesArr]);

  return (
    <>
      <h2>Programmes</h2>
      <Details.ExpanderGroup>
        <Details expander data-cy="currentExpand">
          <Details.Summary>Your current programme memberships</Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedProgrammes.current,
                TraineeProfileName.Programmes
              )}
              panelsName={TraineeProfileName.Programmes}
              panelsTitle={PANEL_KEYS.programmeMemberships}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="upcomingExpand">
          <Details.Summary>
            Upcoming programme memberships (within 12 weeks)
          </Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedProgrammes.upcoming,
                TraineeProfileName.Programmes
              )}
              panelsName={TraineeProfileName.Programmes}
              panelsTitle={PANEL_KEYS.programmeMemberships}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="futureExpand">
          <Details.Summary>
            Future programme memberships (&gt;12 weeks from today)
          </Details.Summary>
          <Details.Text>
            <WarningCallout>
              <WarningCallout.Label visuallyHiddenText={false}>
                Please note
              </WarningCallout.Label>
              <p data-cy="futureWarningText">
                The information we have for future programme memberships with a
                start date more than 12 weeks from today is not yet finalised
                and may be subject to change.
              </p>
            </WarningCallout>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedProgrammes.future,
                TraineeProfileName.Programmes
              )}
              panelsName={TraineeProfileName.Programmes}
              panelsTitle={PANEL_KEYS.programmeMemberships}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
      </Details.ExpanderGroup>
    </>
  );
}

function PlacementsForViewing() {
  const placementsArr = useAppSelector(selectTraineeProfile).placements;
  const groupedPlacements = useMemo(() => {
    return ProfileUtilities.groupDateBoxedByDate(placementsArr);
  }, [placementsArr]);

  return (
    <>
      <h2>Placements</h2>
      <Details.ExpanderGroup>
        <Details expander data-cy="currentExpand">
          <Details.Summary>Your current placements</Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedPlacements.current,
                TraineeProfileName.Placements
              )}
              panelsName={TraineeProfileName.Placements}
              panelsTitle={PANEL_KEYS.placements}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="upcomingExpand">
          <Details.Summary>
            Upcoming placements (within 12 weeks)
          </Details.Summary>
          <Details.Text>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedPlacements.upcoming,
                TraineeProfileName.Placements
              )}
              panelsName={TraineeProfileName.Placements}
              panelsTitle={PANEL_KEYS.placements}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
        <Details expander data-cy="futureExpand">
          <Details.Summary>
            Future placements (&gt;12 weeks from today)
          </Details.Summary>
          <Details.Text>
            <WarningCallout>
              <WarningCallout.Label visuallyHiddenText={false}>
                Please note
              </WarningCallout.Label>
              <p data-cy="futureWarningText">
                The information we have for future placements with a start date
                more than 12 weeks from today is not yet finalised and may be
                subject to change.
              </p>
            </WarningCallout>
            <PanelsCreator
              panelsArr={prepareProfilePanelsData(
                groupedPlacements.future,
                TraineeProfileName.Placements
              )}
              panelsName={TraineeProfileName.Placements}
              panelsTitle={PANEL_KEYS.placements}
              panelKeys={PANEL_KEYS}
            />
          </Details.Text>
        </Details>
      </Details.ExpanderGroup>
    </>
  );
}
