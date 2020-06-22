import React, { FunctionComponent } from "react";
import TextInputField from "../../TextInputField";
import MultiChoiceInputField from "../../MultiChoiceInputField";
import ScrollTo from "../../ScrollTo";
import {
  Fieldset,
  WarningCallout,
  Pagination,
  Panel,
  Button,
  ErrorSummary,
  ErrorMessage
} from "nhsuk-react-components";
import { Form, Formik, FieldArray } from "formik";
import DeclarationPanel from "./DeclarationPanel";
import { Declaration, FormRPartB } from "../../../../models/FormRPartB";
import { Section4ValidationSchema } from "../ValidationSchema";
import { DeclarationPanelUtilities } from "../../../../utilities/DeclarationPanelUtilities";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";
import { YES_NO } from "../../../../utilities/Constants";

interface Section4Props {
  formData: FormRPartB;
  previousSection: (formData: FormRPartB) => void;
  nextSection: (formData: FormRPartB) => void;
  history: any;
  section: number;
}

const Section4: FunctionComponent<Section4Props> = (props: Section4Props) => {
  const { formData, previousSection, nextSection, section } = props;

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
        validationSchema={Section4ValidationSchema}
        onSubmit={values => {
          nextSection(values);
        }}
      >
        {({ values, errors }) => (
          <Form>
            <ScrollTo />
            <Fieldset
              disableErrorLine={true}
              name="previousDeclarations"
              data-jest="mainFieldset4"
            >
              <Fieldset.Legend
                headingLevel="H2"
                size="l"
                data-cy="legendFieldset4"
              >
                Section 4: Update to your previous Form R Part B
              </Fieldset.Legend>
              <WarningCallout label="Important" data-cy="mainWarning4">
                <div>
                  <p>
                    If you have previously declared any Significant Events,
                    Complaints, or Other Investigations on your previous Form R
                    Part B, then please provide updates to these declarations
                    below. Please add more rows as required using the 'Add More'
                    button.
                  </p>
                </div>
                <div>
                  <p>
                    Please <b>do not</b> use this space for new declarations.
                    These should be added in <b>Section 5</b> (New Declarations
                    since your previous Form R Part B).
                  </p>
                </div>
              </WarningCallout>

              <Panel label="Previous Declarations" data-cy="declarations4">
                <MultiChoiceInputField
                  label="Do you have any Significant Events, Complaints, Other investigations on your previous Form R Part B?"
                  id="havePreviousDeclarations"
                  name="havePreviousDeclarations"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    DeclarationPanelUtilities.changeDeclarationsArray(
                      e.target.value,
                      values.previousDeclarations,
                      newDeclaration
                    );
                  }}
                  type="radios"
                  items={YES_NO}
                  footer="If you wish to make any such declarations in relation to your current Form R Part B then please do this in Section 5"
                />
              </Panel>

              {BooleanUtilities.ToBoolean(values.havePreviousDeclarations) ? (
                <>
                  <Panel label="Declarations">
                    <FieldArray
                      name="previousDeclarations"
                      render={p => (
                        <div>
                          {values.previousDeclarations.map((_, i: number) => (
                            <DeclarationPanel
                              section={section}
                              key={i}
                              index={i}
                              removeDeclaration={(index: number) =>
                                p.remove(index)
                              }
                              data-jest="declarationPanel4"
                            ></DeclarationPanel>
                          ))}
                          <Button
                            data-cy={`btnAddDeclaration`}
                            type="button"
                            secondary
                            data-jest="btnAddDeclaration"
                            onClick={() => p.push(newDeclaration)}
                          >
                            Add more...
                          </Button>
                        </div>
                      )}
                    ></FieldArray>
                  </Panel>
                  <Panel
                    label="Summary of previous unresolved declarations"
                    data-cy="previousDeclarationsSummary"
                  >
                    <TextInputField
                      name="previousDeclarationsSummary"
                      rows={15}
                      label=""
                      data-cy="previousDeclarationsSummaryTextInput"
                      data-jest="previousDeclarationsSummaryTextInput"
                      hint={
                        <span>
                          If any <strong>previously declared</strong>{" "}
                          Significant Events, Complaints, Other investigations
                          remain unresolved, please provide a brief summary
                          below, including where you were working, the date of
                          the event, and your reflection where appropriate. If
                          known, please identify what investigations are pending
                          relating to the event and which organisation is
                          undertaking the investigation.
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

            <Pagination>
              <Pagination.Link
                previous
                onClick={() => previousSection(values)}
                data-cy="BacklinkToSection3"
                data-jest="BacklinkToSection3"
              >
                Section 3
              </Pagination.Link>

              <Pagination.Link
                next
                onClick={() => nextSection(values)}
                data-cy="linkToSection5"
                data-jest="linkToSection5"
              >
                Continue to Section 5
              </Pagination.Link>
            </Pagination>
          </Form>
        )}
      </Formik>
    )
  );
};

export default Section4;
