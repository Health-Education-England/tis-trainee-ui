import { Form, Formik } from "formik";
import {
  Card,
  ErrorMessage,
  ErrorSummary,
  Fieldset,
  WarningCallout
} from "nhsuk-react-components";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { selectSavedFormB } from "../../../../redux/slices/formBSlice";
import { selectAllReference } from "../../../../redux/slices/referenceSlice";
import ScrollTo from "../../ScrollTo";
import SelectInputField from "../../SelectInputField";
import TextInputField from "../../TextInputField";
import { Section1ValidationSchema } from "../ValidationSchema";
import FormRPartBPagination from "../FormRPartBPagination";
import { CombinedReferenceData } from "../../../../models/CombinedReferenceData";
import DataSourceMsg from "../../../../components/common/DataSourceMsg";
import { IFormRPartBSection } from "../../../../models/IFormRPartBSection";
import { DesignatedBodyKeyValue } from "../../../../models/DesignatedBodyKeyValue";
import { AutocompleteSelect } from "../../../common/AutocompleteSelect";

const Section1 = ({
  prevSectionLabel,
  nextSectionLabel,
  saveDraft,
  previousSection,
  handleSectionSubmit
}: IFormRPartBSection) => {
  const formRBData = useAppSelector(selectSavedFormB);
  const combinedReferenceData: CombinedReferenceData =
    useAppSelector(selectAllReference);

  return (
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
              Section 1: Doctor&#39;s details
            </Fieldset.Legend>
          </Fieldset>
          <WarningCallout data-cy="mainWarning1">
            <WarningCallout.Label visuallyHiddenText={false}>
              Important
            </WarningCallout.Label>
            <p>
              This form has been pre-populated using the information available
              against your records within the Trainee Information System (TIS).
              Please check all details and amend where necessary. Amendments
              made to your details on this form will not update other systems
              that you may have access to. By submitting this document you are
              confirming that ALL DETAILS (pre-populated or entered/amended by
              you) are correct.
              <br />
              <br /> It remains your own responsibility to keep your Designated
              Body and the GMC informed as soon as possible of any changes to
              your contact details. Your HEE Local team remains your Designated
              Body throughout your time in training. You can update your
              Designated Body on your GMC Online account under &#34;My
              Revalidation&#34;.
              <br />
              <br /> Failure to appropriately complete a Form R Part B when
              requested may result in an Outcome 5 at ARCP{" "}
              <b>(Please refer to latest edition of the Gold Guide)</b>.
            </p>
          </WarningCallout>
          <DataSourceMsg />
          <Card feature>
            <Card.Content>
              <Card.Heading>Personal details</Card.Heading>
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
                options={[...combinedReferenceData.localOffice]}
                name="localOfficeName"
              />

              <SelectInputField
                label="Previous Designated Body for Revalidation (if applicable)"
                options={[
                  ...combinedReferenceData.dbc.filter(
                    (db: DesignatedBodyKeyValue) => db.internal
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
                <AutocompleteSelect
                  value={values.prevRevalBodyOther}
                  onChange={setFieldValue}
                  error={errors.prevRevalBodyOther}
                  options={[...combinedReferenceData.dbc].filter(
                    (db: DesignatedBodyKeyValue) => !db.internal
                  )}
                  name="prevRevalBodyOther"
                  label="Please Specify 'Other'"
                  isMulti={false}
                  closeMenuOnSelect={true}
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
                options={combinedReferenceData.curriculum}
              />
              <SelectInputField
                label="Dual Specialty (if applicable)"
                name="dualSpecialty"
                options={combinedReferenceData.curriculum}
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
};

export default Section1;
