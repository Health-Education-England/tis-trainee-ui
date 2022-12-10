import { Form, Formik } from "formik";
import {
  BackLink,
  Button,
  Card,
  ErrorMessage,
  ErrorSummary,
  WarningCallout
} from "nhsuk-react-components";
import { KeyValue } from "../../../models/KeyValue";
import Autocomplete from "../Autocomplete";
import MultiChoiceInputField from "../MultiChoiceInputField";
import SelectInputField from "../SelectInputField";
import TextInputField from "../TextInputField";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/hooks";
import {
  selectSavedFormA,
  updatedFormA
} from "../../../redux/slices/formASlice";
import { ValidationSchema } from "./ValidationSchema";
import { ReferenceDataUtilities } from "../../../utilities/ReferenceDataUtilities";
import { FormRPartA } from "../../../models/FormRPartA";
import {
  CCT_DECLARATION,
  FORMR_PARTA_DECLARATIONS,
  IMMIGRATION_STATUS_OTHER_TISIDS,
  MEDICAL_CURRICULUM,
  CHECK_POSTCODE_REGEX
} from "../../../utilities/Constants";
import { selectAllReference } from "../../../redux/slices/referenceSlice";
import { Redirect } from "react-router-dom";
import { CombinedReferenceData } from "../../../models/CombinedReferenceData";
import { CurriculumKeyValue } from "../../../models/CurriculumKeyValue";
import DataSourceMsg from "../../common/DataSourceMsg";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
import { DatepickerField } from "../../common/DatepickerField";

const Create = ({ history }: { history: string[] }) => {
  const dispatch = useAppDispatch();
  const formRAData: FormRPartA = useAppSelector(selectSavedFormA);
  const combinedReferenceData: CombinedReferenceData =
    useAppSelector(selectAllReference);

  if (!formRAData.traineeTisId) {
    return <Redirect to="/formr-a" />;
  }
  return (
    <>
      <BackLink
        data-cy="backLink"
        style={{ cursor: "pointer" }}
        onClick={() => FormRUtilities.historyPush(history, "/formr-a")}
      >
        Go back to forms list
      </BackLink>
      <Formik
        initialValues={formRAData}
        validationSchema={ValidationSchema}
        onSubmit={values => {
          dispatch(updatedFormA(values));
          FormRUtilities.historyPush(history, "/formr-a/confirm");
        }}
      >
        {({ values, errors, setFieldValue, isSubmitting }) => (
          <Form>
            <WarningCallout>
              <WarningCallout.Label visuallyHiddenText={false}>
                Important
              </WarningCallout.Label>
              <p>
                This form has been pre-populated using the information available
                against your records within the Trainee Information System
                (TIS). Please check all details and amend where necessary.
                Amendments made to your details on this form will not update
                other systems that you may have access to. By submitting this
                document you are confirming that ALL DETAILS (pre-populated or
                entered/amended by you) are correct. <br />
                <br />
                It remains your own responsibility to keep your Designated Body
                and the GMC informed as soon as possible of any changes to your
                contact details. Your HEE Local team remains your Designated
                Body throughout your time in training. You can update your
                Designated Body on your GMC Online account under "My
                Revalidation".
              </p>
            </WarningCallout>
            <DataSourceMsg />
            <Card feature>
              <Card.Content>
                <Card.Heading>Personal Details</Card.Heading>
                <TextInputField label="Forename" name="forename" />
                <TextInputField label="GMC-Registered Surname" name="surname" />
                <TextInputField label="GMC Number" name="gmcNumber" />
                <SelectInputField
                  label="Deanery / HEE Local Office"
                  options={combinedReferenceData.localOffice}
                  name="localOfficeName"
                />
                <DatepickerField name="dateOfBirth" />
                <SelectInputField
                  label="Gender"
                  options={combinedReferenceData.gender}
                  name="gender"
                />
                <SelectInputField
                  label="Immigration Status"
                  name="immigrationStatus"
                  options={combinedReferenceData.immigrationStatus}
                />
                {ReferenceDataUtilities.isMatchInReferenceData(
                  IMMIGRATION_STATUS_OTHER_TISIDS,
                  values.immigrationStatus,
                  combinedReferenceData.immigrationStatus
                ) ? (
                  <TextInputField
                    name="otherImmigrationStatus"
                    label="Immigration Status (Other)"
                  />
                ) : null}
                <TextInputField
                  label="Primary Qualification"
                  name="qualification"
                />
                <TextInputField
                  label="Date Awarded"
                  type="date"
                  name="dateAttained"
                />
                <TextInputField
                  label="Medical School Awarding Primary Qualification (name and
                    country)"
                  name="medicalSchool"
                />

                <TextInputField
                  label="Home Address"
                  placeholder="Address Line 1"
                  name="address1"
                />
                <TextInputField
                  label="Address Line 2"
                  hidelabel={true}
                  name="address2"
                  placeholder="Address Line 2"
                />
                <TextInputField
                  hidelabel={true}
                  label="Address Line 3"
                  name="address3"
                  placeholder="Address Line 3"
                />
                <TextInputField
                  label="Postcode"
                  name="postCode"
                  placeholder="postcode"
                />
                {FormRUtilities.showFieldMatchWarning(
                  values?.postCode,
                  CHECK_POSTCODE_REGEX,
                  "Warning: Non-UK postcode detected. Please continue if valid."
                )}
                <TextInputField
                  label="Contact Telephone"
                  name="telephoneNumber"
                  hint="Spaces are allowed between the numbers (e.g. 0xxx xxx xxxx, +447xxx xxx xxx) but no dashes or brackets please."
                />
                <TextInputField
                  label="Contact Mobile"
                  name="mobileNumber"
                  hint="Spaces are allowed between the numbers (e.g. 07xxx xx xx xx, +447xxx xxx xxx) but no dashes or brackets please."
                />
                <TextInputField label="Email Address" name="email" />
              </Card.Content>
            </Card>
            <Card feature>
              <Card.Content>
                <Card.Heading>Declarations</Card.Heading>
                <MultiChoiceInputField
                  label="I confirm that"
                  id="declarationType"
                  type="radios"
                  name="declarationType"
                  hint=""
                  items={FORMR_PARTA_DECLARATIONS.map<KeyValue>(d => {
                    return {
                      label: d,
                      value: d
                    };
                  })}
                  onChange={() => {
                    setFieldValue("cctSpecialty1", "", false);
                  }}
                />
                <Autocomplete
                  label="Programme Specialty"
                  name="programmeSpecialty"
                  id="programmeSpecialty"
                  options={combinedReferenceData.curriculum.filter(
                    (c: CurriculumKeyValue) =>
                      c.curriculumSubType === MEDICAL_CURRICULUM
                  )}
                  dataCy="programmeSpecialty"
                  width="75%"
                />
                {values.declarationType === CCT_DECLARATION && (
                  <>
                    <Autocomplete
                      label="Specialty 1 for Award of CCT"
                      name="cctSpecialty1"
                      id="DeclarationSpeciality1"
                      options={combinedReferenceData.curriculum}
                      dataCy="cctSpecialty1"
                      width="75%"
                    />
                    <Autocomplete
                      label="Specialty 2 for Award of CCT"
                      name="cctSpecialty2"
                      id="DeclarationSpeciality2"
                      options={combinedReferenceData.curriculum}
                      dataCy="cctSpecialty2"
                      width="75%"
                    />
                  </>
                )}
                <SelectInputField
                  label="Royal College / Faculty Assessing Training for the Award of
                    CCT"
                  name="college"
                  options={combinedReferenceData.college}
                />
                <TextInputField
                  label="Anticipated Completion Date of Current Programme (if known)"
                  type="date"
                  name="completionDate"
                />
              </Card.Content>
            </Card>
            <Card feature>
              <Card.Content>
                <Card.Heading>Programme</Card.Heading>
                <SelectInputField
                  label="Training Grade"
                  name="trainingGrade"
                  options={combinedReferenceData.grade}
                />
                <TextInputField
                  label="Start Date"
                  type="date"
                  name="startDate"
                />
                <TextInputField
                  label="Post type or Appointment"
                  name="programmeMembershipType"
                  placeholder="programmeMembership type"
                />
                <TextInputField
                  label="Full Time or % of Full Time Training"
                  name="wholeTimeEquivalent"
                  placeholder="e.g. 0.1 for 10%, 0.25 for 25% etc."
                />
              </Card.Content>
            </Card>

            {[...Object.values(errors)].length ? (
              <ErrorSummary
                aria-labelledby="errorSummaryTitle"
                role="alert"
                tabIndex={-1}
              >
                <ErrorMessage>Please check highlighted fields</ErrorMessage>
              </ErrorSummary>
            ) : null}
            <div className="nhsuk-grid-row">
              <div className="nhsuk-grid-column-two-thirds">
                <div className="nhsuk-grid-row">
                  <div className="nhsuk-grid-column-one-third">
                    <Button
                      secondary
                      onClick={() => {
                        FormRUtilities.saveDraftA(values, history);
                      }}
                      disabled={isSubmitting}
                      data-cy="BtnSaveDraft"
                    >
                      Save for later
                    </Button>
                  </div>
                  <div className="nhsuk-grid-column-two-thirds">
                    <Button type="submit" data-cy="BtnContinue">
                      Continue to submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Create;
