import TextInputField from "../../TextInputField";
import ScrollTo from "../../ScrollTo";
import {
  Card,
  Fieldset,
  WarningCallout,
  InsetText,
  Button,
  ErrorSummary,
  ErrorMessage,
  Row,
  Col,
  Label
} from "nhsuk-react-components";
import { Form, Formik, FieldArray } from "formik";
import WorkPanel from "./WorkPanel";
import { Section2ValidationSchema } from "../ValidationSchema";
import classes from "../FormRPartB.module.scss";
import FormRPartBPagination from "../FormRPartBPagination";
import { NEW_WORK } from "../../../../utilities/Constants";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { selectSavedFormB } from "../../../../redux/slices/formBSlice";
import DataSourceMsg from "../../../../components/common/DataSourceMsg";
import { IFormRPartBSection } from "../../../../models/IFormRPartBSection";
import { FormRPartB } from "../../../../models/FormRPartB";
import { ProfileUtilities } from "../../../../utilities/ProfileUtilities";
import { StringUtilities } from "../../../../utilities/StringUtilities";
import { ReferenceDataUtilities } from "../../../../utilities/ReferenceDataUtilities";
import { useMemo } from "react";
import { DateUtilities } from "../../../../utilities/DateUtilities";

const Section2 = ({
  prevSectionLabel,
  nextSectionLabel,
  saveDraft,
  previousSection,
  handleSectionSubmit
}: IFormRPartBSection) => {
  let formData = useAppSelector(selectSavedFormB);
  // TODO - replace this with value from select box
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const firstWednesdayInAugust = useMemo(
    () => ReferenceDataUtilities.firstWednesdayInAugust(currentYear),
    [currentYear]
  );
  const tueBeforeFirstWedNextAugust = useMemo(
    () =>
      new Date(
        ReferenceDataUtilities.firstWednesdayInAugust(currentYear + 1).setDate(
          ReferenceDataUtilities.firstWednesdayInAugust(
            currentYear + 1
          ).getDate() - 1
        )
      ),
    [currentYear]
  );

  // WIP calculate full year select options. We need the following:
  const fullYearSelectOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 3; i++) {
      options.push(currentYear - i);
    }
    return options;
  }, []);

  return (
    <Formik
      initialValues={formData}
      validationSchema={Section2ValidationSchema}
      onSubmit={values => {
        const payload: FormRPartB = ProfileUtilities.updateVals(values);
        handleSectionSubmit(payload);
      }}
    >
      {({ values, errors, handleSubmit, setFieldValue }) => (
        <Form>
          <ScrollTo />
          <Fieldset disableErrorLine={true} name="scopeOfPractice">
            <Fieldset.Legend
              headingLevel="H2"
              size="l"
              data-cy="legendFieldset2"
            >
              Section 2: Whole Scope of Practice
            </Fieldset.Legend>
          </Fieldset>
          <WarningCallout data-cy="mainWarning2">
            <WarningCallout.Label visuallyHiddenText={false}>
              Important
            </WarningCallout.Label>
            <p>
              Read these instructions carefully. Please list all placements in
              your capacity as a registered medical practitioner since last ARCP
              (or since initial registration to programme if more recent). This
              includes: (1) each of your training posts if you are or were in a
              training programme; (2) any time out of programme, e.g. OOP, mat
              leave, career break, etc.;{" "}
              <b>(3) any voluntary or advisory work</b>, work in non-NHS bodies,
              or self-employment; (4) any work as a locum. For locum work,
              please group shifts with one employer within an unbroken period as
              one employer-entry. Include the dates and number of shifts worked
              in each locum employer-entry. Please add a new Work panel if
              required.
            </p>
            <p>
              If applicable, only your next upcoming placement is listed below.
              It is not necessary to include any future placements beyond that.
            </p>
          </WarningCallout>
          <DataSourceMsg />
          <Card feature>
            <Card.Content>
              <Card.Heading>Type of work</Card.Heading>
              <WarningCallout data-cy="arcpWarning">
                <WarningCallout.Label visuallyHiddenText={false}>
                  ARCP Period definition
                </WarningCallout.Label>
                <p>
                  <b>
                    An ARCP period is defined as the First Wednesday in August
                    in the current year to the Tuesday before first Wednesday in
                    August the following year.
                  </b>
                </p>
                <p>
                  The Work placements that fall outside this ARCP period will
                  have an orange warning label.
                </p>
                <p>
                  You can still check the box to include an
                  'Outside-current-ARCP-period' Work placement.
                </p>
                <p>
                  If you have lots of 'Outside-current-ARCP-period' placements
                  you can change the ARCP year by selecting a different one from
                  the drop down below.
                </p>
                <p>
                  <b>
                    {/* // TODO - select box to choose year */}
                    {`The ARCP period for ${new Date().getFullYear()} is ${DateUtilities.ToLocalDate(
                      firstWednesdayInAugust
                    )} to ${DateUtilities.ToLocalDate(
                      tueBeforeFirstWedNextAugust
                    )}.`}
                  </b>
                </p>{" "}
                <select
                //   onChange={(e) => setFieldValue("<new field name>", e.target.value)}
                >
                  {fullYearSelectOptions.map((year, i) => (
                    <option key={i} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </WarningCallout>
              <Row>
                <FieldArray
                  name="work"
                  render={ps => (
                    <>
                      {values.work.map((work, i: number) => (
                        <Col width="full" key={i}>
                          <WorkPanel
                            value={work}
                            key={i}
                            index={i}
                            data-jest="workPanel"
                          ></WorkPanel>
                        </Col>
                      ))}
                      <Col width="one-half">
                        <button
                          className="plus-button"
                          data-cy="BtnAddWorkType"
                          type="button"
                          // TODO I don't want the button to be disabled if the values.work.length is 0

                          disabled={!!errors.work && values.work.length >= 1}
                          data-jest="addMore"
                          onClick={() => ps.push(NEW_WORK)}
                        >
                          <span className="plus-icon"></span>
                          <span className="plus-text">
                            {values.work.length >= 1
                              ? "Add a new Work Type"
                              : "Add Work Type"}
                          </span>
                        </button>
                      </Col>
                      <Col width="one-half">
                        <Button
                          disabled={values.work.length < 1}
                          type="button"
                          secondary
                          data-cy="BtnUpdateWorkList"
                          onClick={() => {
                            const updatedWork =
                              ProfileUtilities.filterCurrentArcpWork(
                                values.work
                              );
                            setFieldValue("work", updatedWork);
                            window.scrollTo({ top: 1500, behavior: "smooth" });
                          }}
                          title="This will remove any unchecked work placements from the list."
                        >
                          Update Work list
                        </Button>
                      </Col>
                    </>
                  )}
                ></FieldArray>
                <Col width="full">
                  <div className="nhsuk-form-group nhsuk-form-group--error">
                    {errors.work && !Array.isArray(errors.work) && errors.work}
                  </div>
                </Col>
              </Row>
            </Card.Content>
          </Card>
          <Card feature>
            <Card.Content>
              <Card.Heading>
                Reasons for TIME OUT OF TRAINING (TOOT)
              </Card.Heading>
              <InsetText className={classes.tootInsetText}>
                <p>
                  <b>TIME OUT OF TRAINING (TOOT)</b> Self-reported absence
                  whilst part of a training programme since last ARCP (or, if no
                  ARCP, since initial registration to programme). Time out of
                  training should reflect days absent from the training
                  programme and is considered by the ARCP panel/Deanery/HEE in
                  recalculation of the date you should end your current training
                  programme.
                </p>
                <p>
                  <b>
                    Enter 0 (zero) where you have not had Time Out Of Training.
                    Partial days must be rounded up.
                  </b>
                </p>
              </InsetText>
              <TextInputField
                label="Short and Long-term sickness absence"
                name="sicknessAbsence"
                validate={StringUtilities.validateInteger}
              />
              <TextInputField
                label="Parental leave (incl Maternity / Paternity leave)"
                name="parentalLeave"
                validate={StringUtilities.validateInteger}
              />
              <TextInputField
                label="Career breaks within a Programme (OOPC) and non-training placements for experience (OOPE)"
                name="careerBreaks"
                validate={StringUtilities.validateInteger}
              />
              <TextInputField
                label="Paid / unpaid leave (e.g. compassionate, jury service)"
                name="paidLeave"
                validate={StringUtilities.validateInteger}
              />
              <TextInputField
                label="Unpaid/unauthorised leave including industrial action"
                name="unauthorisedLeave"
                validate={StringUtilities.validateInteger}
              />
              <TextInputField
                label="Other"
                name="otherLeave"
                hint="TOOT does not include study leave, paid annual leave, prospectively approved Out of Programme Training/Research (OOPT/OOPR) or periods of time between training programmes (e.g. between core and higher training)."
                validate={StringUtilities.validateInteger}
              />
              <TextInputField
                label="Total"
                name="totalLeave"
                value={ProfileUtilities.getTotal(values)}
                readOnly
              />
            </Card.Content>
          </Card>
          {[...Object.values(errors)].length > 0 ? (
            <ErrorSummary
              aria-labelledby="errorSummaryTitle"
              role="alert"
              tabIndex={-1}
            >
              <ErrorMessage>Please check highlighted fields</ErrorMessage>
            </ErrorSummary>
          ) : null}

          <FormRPartBPagination
            values={ProfileUtilities.updateVals(values)}
            saveDraft={saveDraft}
            prevSectionLabel={prevSectionLabel}
            nextSectionLabel={nextSectionLabel}
            handleSubmit={handleSubmit}
            previousSection={previousSection}
          />
        </Form>
      )}
    </Formik>
  );
};
export default Section2;
