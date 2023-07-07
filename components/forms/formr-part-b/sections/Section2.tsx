import TextInputField from "../../TextInputField";
import ScrollTo from "../../ScrollTo";
import {
  Card,
  Fieldset,
  WarningCallout,
  InsetText,
  Button,
  ErrorSummary,
  ErrorMessage
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
import { FormRPartB, Work } from "../../../../models/FormRPartB";
import { ProfileUtilities } from "../../../../utilities/ProfileUtilities";
import { StringUtilities } from "../../../../utilities/StringUtilities";
import { ReferenceDataUtilities } from "../../../../utilities/ReferenceDataUtilities";
import { DateUtilities } from "../../../../utilities/DateUtilities";
import { useEffect, useMemo, useState } from "react";
import { useConfirm } from "material-ui-confirm";
import Select, { SingleValue } from "react-select";
import { colourStyles } from "../../../../utilities/FormBuilderUtilities";

const Section2 = ({
  prevSectionLabel,
  nextSectionLabel,
  saveDraft,
  previousSection,
  handleSectionSubmit
}: IFormRPartBSection) => {
  const confirm = useConfirm();
  const traineeProfileData = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );
  let formData = useAppSelector(selectSavedFormB);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [fullYearSelectOptions, setFullYearSelectOptions] = useState<number[]>(
    []
  );
  const [allWork, setAllWork] = useState<Work[]>([]);
  const defaultWork = useMemo(() => {
    const workArr = traineeProfileData.placements.map<Work>(placement =>
      ProfileUtilities.mappedPltoWork(placement)
    );
    return ProfileUtilities.sortedTrimmedWork(workArr);
  }, [traineeProfileData]);
  const defaultYear = useMemo(() => {
    return new Date().getFullYear();
  }, []);
  const getPreviousYears = (year: number, numberOfYears: number) => {
    const years = [];
    for (let i = 0; i < numberOfYears + 1; i++) {
      years.push(year - i);
    }
    return years;
  };
  const firstWednesdayInAugust = useMemo(() => {
    return ReferenceDataUtilities.firstWednesdayInAugust(currentYear as number);
  }, [currentYear]);

  const tueBeforeFirstWedNextAugust = useMemo(() => {
    return ReferenceDataUtilities.tueBeforeFirstWedNextAugust(
      currentYear as number
    );
  }, [currentYear]);

  const selectOptions = useMemo(() => {
    return [
      { value: null, label: "All years" },
      ...fullYearSelectOptions.map(year => ({
        value: year,
        label: year.toString()
      }))
    ];
  }, [fullYearSelectOptions]);

  useEffect(() => {
    setAllWork(defaultWork);
  }, [traineeProfileData, defaultWork]);

  useEffect(() => {
    setCurrentYear(formData?.arcpYear ? formData.arcpYear : null);
  }, [formData]);

  useEffect(() => {
    setFullYearSelectOptions(getPreviousYears(defaultYear, 2));
  }, [defaultYear]);

  return (
    <Formik
      initialValues={formData}
      validationSchema={Section2ValidationSchema}
      onSubmit={values => {
        const payload: FormRPartB = ProfileUtilities.updateVals(values);
        handleSectionSubmit(payload);
      }}
    >
      {({ values, errors, handleSubmit, setFieldValue }) => {
        const selectValue = values.arcpYear
          ? {
              value: values.arcpYear,
              label: values.arcpYear?.toString()
            }
          : { value: null, label: "All years" };
        return (
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
                Read these instructions carefully! Please list all placements in
                your capacity as a registered medical practitioner since last
                ARCP (or since initial registration to programme if more
                recent). This includes: (1) each of your training posts if you
                are or were in a training programme; (2) any time out of
                programme, e.g. OOP, mat leave, career break, etc.;{" "}
                <b>(3) any voluntary or advisory work</b>, work in non-NHS
                bodies, or self-employment; (4) any work as a locum. For locum
                work, please group shifts with one employer within an unbroken
                period as one employer-entry. Include the dates and number of
                shifts worked in each locum employer-entry. Please add a new
                Work panel if required.
              </p>
              <p>
                If applicable, only your next upcoming placement is listed
                below. It is not necessary to include any future placements
                beyond that.
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
                      in the current year to the Tuesday before first Wednesday
                      in August the following year.
                    </b>
                  </p>
                  <p>
                    The default view is to show all the Type of Work placements
                    that we hold for you.
                  </p>
                  <p>
                    You can filter Your Type of Work by selecting a year from
                    the drop-down list below - which will show only those that
                    fall within that year&apos;s ARCP period as defined above.
                  </p>
                  <p>
                    <b>
                      PLEASE NOTE: Choosing a filter option from the list below
                      will overwrite any other changes you have made, so best to
                      filter first before editing your Type of Work.
                    </b>
                  </p>
                  <p>
                    <b data-cy="arcpPeriodTxt">
                      {currentYear
                        ? `The ARCP period for ${currentYear} is ${DateUtilities.ToLocalDate(
                            firstWednesdayInAugust
                          )} to ${DateUtilities.ToLocalDate(
                            tueBeforeFirstWedNextAugust
                          )}.`
                        : null}
                    </b>
                  </p>
                  <div data-cy="arcpYYear">
                    <label htmlFor="arcpYear" className="select-label">
                      {"To filter Type of Work please select a year: "}
                    </label>
                    <Select
                      options={selectOptions}
                      value={selectValue}
                      defaultValue={selectValue}
                      onChange={(
                        selectedOption: SingleValue<{
                          value: number | null;
                          label: string;
                        }>
                      ) => {
                        const selectedValue = selectedOption?.value
                          ? selectedOption.value
                          : null;
                        confirm({
                          description:
                            "Choosing another Year option will overwrite any changes you have made to the Work panels. Do you want to continue?"
                        })
                          .then(() => {
                            setCurrentYear(selectedValue);
                            setFieldValue("arcpYear", selectedValue);
                            setFieldValue(
                              "work",
                              selectedValue === null
                                ? allWork
                                : ReferenceDataUtilities.filterArcpWorkPlacements(
                                    allWork,
                                    selectedValue
                                  )
                            );
                          })
                          .catch(() => {
                            setFieldValue("arcpYear", values.arcpYear);
                          });
                      }}
                      className="year-select"
                      classNamePrefix="react-select"
                      theme={theme => ({
                        ...theme,
                        borderRadius: 0
                      })}
                      styles={colourStyles}
                    />
                  </div>
                </WarningCallout>
                <FieldArray
                  name="work"
                  render={ps => (
                    <div>
                      {values.work.map((_, i: number) => (
                        <WorkPanel
                          key={i}
                          index={i}
                          removeWork={(index: number) => ps.remove(index)}
                          data-jest="workPanel"
                        ></WorkPanel>
                      ))}
                      <div className="nhsuk-form-group nhsuk-form-group--error">
                        <p className="nhsuk-error-message">
                          {errors.work &&
                            Array.isArray(errors.work) &&
                            "Please check the highlighted fields before proceeding."}
                        </p>
                      </div>
                      <Button
                        title="Add a Work Type"
                        data-cy={`BtnAddWorkType`}
                        type="button"
                        secondary
                        disabled={!!errors.work && values.work.length >= 1}
                        data-jest="addMore"
                        onClick={() => ps.push(NEW_WORK)}
                      >
                        Add more...
                      </Button>
                    </div>
                  )}
                ></FieldArray>
                <div className="nhsuk-form-group nhsuk-form-group--error">
                  <p className="nhsuk-error-message">
                    {errors.work && !Array.isArray(errors.work) && errors.work}
                  </p>
                </div>
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
                    whilst part of a training programme since last ARCP (or, if
                    no ARCP, since initial registration to programme). Time out
                    of training should reflect days absent from the training
                    programme and is considered by the ARCP panel/Deanery/HEE in
                    recalculation of the date you should end your current
                    training programme.
                  </p>
                  <p>
                    <b>
                      Enter 0 (zero) where you have not had Time Out Of
                      Training. Partial days must be rounded up.
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
        );
      }}
    </Formik>
  );
};
export default Section2;
