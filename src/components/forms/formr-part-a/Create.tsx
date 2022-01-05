import { Form, Formik } from "formik";
import {
  BackLink,
  Button,
  ErrorMessage,
  ErrorSummary,
  Panel,
  WarningCallout
} from "nhsuk-react-components";
import { KeyValue } from "../../../models/KeyValue";
import Autocomplete from "../Autocomplete";
import MultiChoiceInputField from "../MultiChoiceInputField";
import SelectInputField from "../SelectInputField";
import SubmitButton from "../SubmitButton";
import TextInputField from "../TextInputField";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/hooks";
import {
  saveForm,
  selectSavedForm,
  updatedFormA,
  updateForm
} from "../../../redux/slices/formASlice";
import { ValidationSchema } from "./ValidationSchema";
import { ReferenceDataUtilities } from "../../../utilities/ReferenceDataUtilities";
import { FormRPartA } from "../../../models/FormRPartA";
import {
  CCT_DECLARATION,
  FORMR_PARTA_DECLARATIONS,
  IMMIGRATION_STATUS_OTHER_TISIDS
} from "../../../utilities/Constants";
import { selectAllReference } from "../../../redux/slices/referenceSlice";
import { LifeCycleState } from "../../../models/LifeCycleState";
import store from "../../../redux/store/store";
import { fetchForms } from "../../../redux/slices/formsSlice";

const Create = ({ history }: { history: string[] }) => {
  const dispatch = useAppDispatch();
  const formRAData = useAppSelector(selectSavedForm);
  const combinedReferenceData = useAppSelector(selectAllReference);

  const handleSubmit = async (finalFormA: FormRPartA) => {
    dispatch(updatedFormA(finalFormA));
    history.push("/formr-a/confirm");
  };

  const saveDraft = async (draftFormA: FormRPartA) => {
    if (draftFormA.lifecycleState !== LifeCycleState.Unsubmitted) {
      draftFormA.submissionDate = null;
      draftFormA.lifecycleState = LifeCycleState.Draft;
    }
    // TODO Date type store warning https://github.com/reduxjs/redux-toolkit/issues/456
    // https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
    draftFormA.lastModifiedDate = new Date();
    dispatch(updatedFormA(draftFormA));
    const updatedFormAData = store.getState().formA.formAData;
    if (draftFormA.id) {
      await dispatch(updateForm(updatedFormAData));
    } else await dispatch(saveForm(updatedFormAData));
    dispatch(fetchForms());
    history.push("/formr-a");
  };

  // TODO redirect to forms list if no data via direct url
  // and sort better backlink
  return (
    <>
      <BackLink href="/formr-a">Go back</BackLink>
      <Formik
        initialValues={formRAData}
        validationSchema={ValidationSchema}
        onSubmit={values => handleSubmit(values)}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <WarningCallout label="Important">
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
            <Panel label="Personal Details">
              <TextInputField label="Forename" name="forename" />
              <TextInputField label="GMC-Registered Surname" name="surname" />
              <TextInputField label="GMC Number" name="gmcNumber" />
              <SelectInputField
                label="Deanery / HEE Local Office"
                options={combinedReferenceData[3]}
                name="localOfficeName"
              />
              <TextInputField
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
              />
              <SelectInputField
                label="Gender"
                options={combinedReferenceData[0]}
                name="gender"
              />
              <SelectInputField
                label="Immigration Status"
                name="immigrationStatus"
                options={combinedReferenceData[5]}
              />
              {ReferenceDataUtilities.isMatchInReferenceData(
                IMMIGRATION_STATUS_OTHER_TISIDS,
                values.immigrationStatus,
                combinedReferenceData[5]
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
            </Panel>

            <Panel label="Declarations">
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
                options={combinedReferenceData[6].filter(
                  (c: { curriculumSubType: string }) =>
                    c.curriculumSubType === "MEDICAL_CURRICULUM"
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
                    options={combinedReferenceData[6]}
                    dataCy="cctSpecialty1"
                    width="75%"
                  />
                  <Autocomplete
                    label="Specialty 2 for Award of CCT"
                    name="cctSpecialty2"
                    id="DeclarationSpeciality2"
                    options={combinedReferenceData[6]}
                    dataCy="cctSpecialty2"
                    width="75%"
                  />
                </>
              )}
              <SelectInputField
                label="Royal College / Faculty Assessing Training for the Award of
                    CCT"
                name="college"
                options={combinedReferenceData[1]}
              />
              <TextInputField
                label="Anticipated Completion Date of Current Programme (if known)"
                type="date"
                name="completionDate"
              />
            </Panel>

            <Panel label="Programme">
              <SelectInputField
                label="Training Grade"
                name="trainingGrade"
                options={combinedReferenceData[4]}
              />
              <TextInputField label="Start Date" type="date" name="startDate" />
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
            </Panel>

            {[...Object.values(errors)].length > 0 ? (
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
                    <SubmitButton
                      label="Save & Exit"
                      clickHandler={() => saveDraft(values)}
                      data-cy="BtnSaveDraft"
                    />
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
