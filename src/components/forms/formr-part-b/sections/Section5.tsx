import TextInputField from "../../TextInputField";
import MultiChoiceInputField from "../../MultiChoiceInputField";
import ScrollTo from "../../ScrollTo";
import {
  Fieldset,
  WarningCallout,
  Panel,
  Button,
  ErrorSummary,
  ErrorMessage
} from "nhsuk-react-components";
import { Form, Formik, FieldArray } from "formik";
import DeclarationPanel from "./DeclarationPanel";
import { Declaration, FormRPartB } from "../../../../models/FormRPartB";
import { Section5ValidationSchema } from "../ValidationSchema";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";
import { DeclarationPanelUtilities } from "../../../../utilities/DeclarationPanelUtilities";
import { YES_NO_OPTIONS } from "../../../../utilities/Constants";
import FormRPartBPagination from "../FormRPartBPagination";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  incrementFormBSection,
  selectSavedFormB,
  updateFormB
} from "../../../../redux/slices/formBSlice";

interface ISection5 {
  prevSectionLabel: string;
  nextSectionLabel: string;
  saveDraft: (formData: FormRPartB) => Promise<void>;
}

const Section5 = ({
  prevSectionLabel,
  nextSectionLabel,
  saveDraft
}: ISection5) => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSavedFormB);

  const newDeclaration: Declaration = {
    declarationType: undefined,
    dateOfEntry: undefined,
    title: "",
    locationOfEntry: ""
  };

  return (
    formData && (
      <Formik
        initialValues={formData}
        validationSchema={Section5ValidationSchema}
        onSubmit={values => {
          // dispatch(updateFormB(values));
          dispatch(incrementFormBSection());
        }}
      >
        {({ values, errors, handleSubmit, setFieldValue }) => (
          <Form>
            <ScrollTo />
            <Fieldset
              disableErrorLine={true}
              name="currentDeclarations"
              data-jest="mainFieldset5"
            >
              <Fieldset.Legend
                headingLevel="H2"
                size="l"
                data-cy="legendFieldset5"
              >
                Section 5: New declarations since your previous Form R Part B
              </Fieldset.Legend>
              <WarningCallout label="Important" data-cy="mainWarning5">
                <div>
                  <p>
                    <b>Significant Event:</b> The GMC states that a significant
                    event (also known as an untoward or critical incident) is
                    any unintended or unexpected event, which could or did lead
                    to harm of one or more patients. This includes incidents
                    which did not cause harm but could have done, or where the
                    event should have been prevented. All doctors as part of
                    revalidation are required to record and reflect on
                    Significant events in their work with the focus on what you
                    have learnt as a result of those event/s. Use
                    non-identifiable patient data only.
                  </p>
                </div>
                <div>
                  <p>
                    <b>Complaints:</b> A complaint is a formal expression of
                    dissatisfaction or grievance. It can be about an individual
                    doctor, the team or about the care of patients where a
                    doctor could be expected to have had influence or
                    responsibility. As a matter of honesty & integrity you are
                    obliged to include all complaints, even when you are the
                    only person aware of them. All doctors should reflect on how
                    complaints influence their practice. Use non-identifiable
                    patient data only.
                  </p>
                </div>
                <div>
                  <p>
                    <b>Other investigations:</b> Any on-going investigations,
                    such as honesty, integrity, conduct, or any other matters
                    that you feel the ARCP panel or Responsible Officer should
                    be made aware of. Use non-identifiable patient data only.
                  </p>
                  <p>
                    <strong>
                      REMINDER: DO NOT INCLUDE ANY PATIENT-IDENTIFIABLE
                      INFORMATION ON THIS FORM
                    </strong>
                  </p>
                </div>
              </WarningCallout>

              <Panel label="New Declarations" data-cy="declarations5">
                <MultiChoiceInputField
                  label="Do you have any new Significant Events, Complaints, Other investigations to declare since your previous ARCP/RITA/Appraisal?"
                  id="haveCurrentDeclarations"
                  name="haveCurrentDeclarations"
                  type="radios"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // TODO dispatch to update declarations array
                    // DeclarationPanelUtilities.changeDeclarationsArray(
                    //   e.target.value,
                    //   values.currentDeclarations,
                    //   newDeclaration
                    // );
                    console.log("TODO update declarations array");
                    setFieldValue("currentDeclarationSummary", null, false);
                  }}
                  items={YES_NO_OPTIONS}
                  footer="If you wish to make any such declarations in relation to your previous Form R Part B then please do this in Section 4"
                />
              </Panel>

              {BooleanUtilities.ToBoolean(values.haveCurrentDeclarations) ? (
                <>
                  <Panel label="Resolved Declarations">
                    <p>
                      If you know of any <strong>RESOLVED</strong> significant
                      events/complaints/other investigations since your last
                      ARCP/RITA/Appraisal, you are required to have written a
                      reflection on these in your Portfolio. Please identify
                      where in your Portfolio the reflection(s) can be found.
                    </p>
                    <FieldArray
                      name="currentDeclarations"
                      render={c => (
                        <div>
                          {values.currentDeclarations.map((_, i: number) => (
                            <DeclarationPanel
                              section={5}
                              key={i}
                              index={i}
                              removeDeclaration={(index: number) =>
                                c.remove(index)
                              }
                              data-jest="declarationPanel"
                            ></DeclarationPanel>
                          ))}
                          <Button
                            data-cy="btnAddDeclaration"
                            type="button"
                            secondary
                            data-jest="btnAddDeclaration"
                            onClick={() => c.push(newDeclaration)}
                          >
                            Add more...
                          </Button>
                        </div>
                      )}
                    ></FieldArray>
                  </Panel>
                  <Panel
                    label="Summary of new unresolved declarations"
                    data-cy="currentDeclarationSummary"
                  >
                    <TextInputField
                      name="currentDeclarationSummary"
                      rows={15}
                      label=""
                      data-cy="currentDeclarationSummaryTextInput"
                      hint={
                        <span>
                          If you know of any <strong>UNRESOLVED</strong>{" "}
                          Significant Events, Complaints, Other investigations
                          since your last ARCP/RITA/Appraisal, please provide a
                          brief summary, including where you were working, the
                          date of the event, and your reflection where
                          appropriate. If known, please identify what
                          investigations are pending relating to the event and
                          which organisation is undertaking the investigation.
                        </span>
                      }
                    />
                  </Panel>
                </>
              ) : null}
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
              values={values}
              saveDraft={saveDraft}
              prevSectionLabel={prevSectionLabel}
              nextSectionLabel={nextSectionLabel}
              handleSubmit={handleSubmit}
            />
          </Form>
        )}
      </Formik>
    )
  );
};

export default Section5;
