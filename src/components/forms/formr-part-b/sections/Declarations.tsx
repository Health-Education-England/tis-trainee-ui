import { Fieldset, Panel } from "nhsuk-react-components";
import { Form, Formik } from "formik";
import MultiChoiceInputField from "../../MultiChoiceInputField";
import { Section7ValidationSchema } from "../ValidationSchema";
import {
  FORMR_PARTB_ACCEPTANCE,
  FORMR_PARTB_CONSENT
} from "../../../../utilities/Constants";
import { FormRPartB } from "../../../../models/FormRPartB";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  resetToInitFormB,
  selectSaveBtnActive,
  selectSavedFormB,
  updatedFormB,
  updateFormB
} from "../../../../redux/slices/formBSlice";
import FormRPartBPagination from "../FormRPartBPagination";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import { fetchForms } from "../../../../redux/slices/formsSlice";
import store from "../../../../redux/store/store";
import { ISection } from "../Create";

interface IDeclarations {
  prevSectionLabel: string;
  saveDraft: (formData: FormRPartB) => Promise<void>;
  history: any;
  finalSections: ISection[];
}

const Declarations = ({
  prevSectionLabel,
  saveDraft,
  history,
  finalSections
}: IDeclarations) => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSavedFormB);
  const saveBtnActive = useAppSelector(selectSaveBtnActive);

  const handleFormBSubmit = async (formDataSubmit: FormRPartB) => {
    if (!saveBtnActive) {
      dispatch(
        updatedFormB({
          ...formDataSubmit,
          submissionDate: new Date(),
          lifecycleState: LifeCycleState.Submitted,
          lastModifiedDate: new Date()
        })
      );
      const updatedFormBData = store.getState().formB.formBData;
      await dispatch(updateFormB(updatedFormBData));
      dispatch(resetToInitFormB());
      dispatch(fetchForms("/formr-b"));
      history.push("/formr-b");
    }
  };

  return (
    formData && (
      <Formik
        initialValues={formData}
        validationSchema={Section7ValidationSchema}
        onSubmit={values => {
          handleFormBSubmit(values);
        }}
      >
        {({ values, handleSubmit, isValid, isSubmitting }) => (
          <Form>
            <Fieldset
              disableErrorLine={true}
              name="currentDeclarations"
              data-jest="mainFieldset7"
            >
              <Fieldset.Legend
                headingLevel="H2"
                size="l"
                data-cy="legendFieldset7"
              >
                Declaration & Consent
              </Fieldset.Legend>

              <Panel label="Declaration" data-cy="declaration">
                <MultiChoiceInputField
                  label="I confirm that,"
                  id="isDeclarationAccepted"
                  type="checkbox"
                  name="isDeclarationAccepted"
                  items={[
                    {
                      label: FORMR_PARTB_ACCEPTANCE,
                      value: true
                    }
                  ]}
                />

                <MultiChoiceInputField
                  label="I confirm that,"
                  id="isConsentAccepted"
                  type="checkbox"
                  name="isConsentAccepted"
                  items={[
                    {
                      label: FORMR_PARTB_CONSENT,
                      value: true
                    }
                  ]}
                />
              </Panel>
            </Fieldset>

            <FormRPartBPagination
              values={values}
              handleSubmit={handleSubmit}
              saveDraft={saveDraft}
              prevSectionLabel={prevSectionLabel}
              nextSectionLabel=""
              previousSection={null}
              isValid={isValid}
              isSubmitting={isSubmitting}
              finalSections={finalSections}
            />
          </Form>
        )}
      </Formik>
    )
  );
};

export default Declarations;
