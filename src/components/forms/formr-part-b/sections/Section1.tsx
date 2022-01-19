import { Form, Formik } from "formik";
import {
  ErrorMessage,
  ErrorSummary,
  Fieldset,
  Panel,
  WarningCallout
} from "nhsuk-react-components";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { selectSavedFormB } from "../../../../redux/slices/formBSlice";
import { selectAllReference } from "../../../../redux/slices/referenceSlice";
import Autocomplete from "../../Autocomplete";
import ScrollTo from "../../ScrollTo";
import SelectInputField from "../../SelectInputField";
import TextInputField from "../../TextInputField";
import { Section1ValidationSchema } from "../ValidationSchema";
import FormRPartBPagination from "../FormRPartBPagination";
import { FormRPartB } from "../../../../models/FormRPartB";
import ErrorPage from "../../../common/ErrorPage";

interface ISection1 {
  prevSectionLabel: string;
  nextSectionLabel: string;
  saveDraft: (formData: FormRPartB) => Promise<void>;
  previousSection: number | null;
  handleSectionSubmit: (formData: FormRPartB) => void;
}

const Section1 = ({
  prevSectionLabel,
  nextSectionLabel,
  saveDraft,
  previousSection,
  handleSectionSubmit
}: ISection1) => {
  const formRBData = useAppSelector(selectSavedFormB);
  const combinedReferenceData = useAppSelector(selectAllReference);

  let content;
  if (!formRBData.traineeTisId)
    content = <ErrorPage error={"No Trainee Id found"}></ErrorPage>;
  else
    content = (
      <Formik
        initialValues={formRBData}
        validationSchema={Section1ValidationSchema}
        onSubmit={values => {
          handleSectionSubmit(values);
        }}
      >
        {({ values, errors, handleSubmit, setFieldValue }) => (
          <Form>
            <ScrollTo />
            <Fieldset disableErrorLine={true} name="doctorsDetails">
              <Fieldset.Legend
                headingLevel="H2"
                size="l"
                data-cy="legendFieldset1"
              >
                Section 1: Doctor's details
              </Fieldset.Legend>

              <WarningCallout label="Important" data-cy="mainWarning1">
                <p>
                  This form has been pre-populated using the information
                  available against your records within the Trainee Information
                  System (TIS). Please check all details and amend where
                  necessary. Amendments made to your details on this form will
                  not update other systems that you may have access to. By
                  submitting this document you are confirming that ALL DETAILS
                  (pre-populated or entered/amended by you) are correct.
                  <br />
                  <br /> It remains your own responsibility to keep your
                  Designated Body and the GMC informed as soon as possible of
                  any changes to your contact details. Your HEE Local team
                  remains your Designated Body throughout your time in training.
                  You can update your Designated Body on your GMC Online account
                  under "My Revalidation".
                  <br />
                  <br /> Failure to appropriately complete a Form R Part B when
                  requested may result in an Outcome 5 at ARCP{" "}
                  <b>(Please refer to latest edition of the Gold Guide)</b>.
                </p>
              </WarningCallout>

              <Panel label="Personal details">
                <TextInputField label="Forename" name="forename" />
                <TextInputField label="GMC-Registered Surname" name="surname" />
                <TextInputField label="GMC Number" name="gmcNumber" />
                <TextInputField
                  label="Primary contact email address"
                  name="email"
                  hint="For reasons of security and due to frequent system failures with internet email accounts, you are strongly advised to provide an NHS.net email address."
                />
                <SelectInputField
                  label="Deanery / HEE Local Team"
                  options={combinedReferenceData[3]}
                  name="localOfficeName"
                />

                <SelectInputField
                  label="Previous Designated Body for Revalidation (if applicable)"
                  options={[
                    ...combinedReferenceData[2].filter(
                      (db: { internal: boolean }) => db.internal
                    ),
                    { label: "other", value: "other" }
                  ]}
                  name="prevRevalBody"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("prevRevalBody", e.target.value, false);
                    setFieldValue("prevRevalBodyOther", "", false);
                  }}
                />
                {values.prevRevalBody === "other" && (
                  <Autocomplete
                    label="Please Specify 'Other'"
                    name="prevRevalBodyOther"
                    id="prevRevalBodyOther"
                    options={[...combinedReferenceData[2]].filter(
                      (db: { internal: boolean }) => !db.internal
                    )}
                    dataCy="prevRevalBodyOther"
                    width="75%"
                  />
                )}
                <TextInputField
                  label="Current Revalidation Date"
                  type="date"
                  name="currRevalDate"
                />
                <TextInputField
                  label="Date of Previous Revalidation (if applicable)"
                  type="date"
                  name="prevRevalDate"
                />
                <SelectInputField
                  label="Programme / Training Specialty"
                  name="programmeSpecialty"
                  options={combinedReferenceData[6]}
                />
                <SelectInputField
                  label="Dual Specialty (if applicable)"
                  name="dualSpecialty"
                  options={combinedReferenceData[6]}
                />
              </Panel>
            </Fieldset>

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
              prevSectionLabel={prevSectionLabel}
              nextSectionLabel={nextSectionLabel}
              values={values}
              saveDraft={saveDraft}
              handleSubmit={handleSubmit}
              previousSection={previousSection}
            />
          </Form>
        )}
      </Formik>
    );

  return <div>{content}</div>;
};

export default Section1;
