import { Fieldset } from "nhsuk-react-components";
import { Form, Formik } from "formik";
import MultiChoiceInputField from "../../MultiChoiceInputField";
import { Section7ValidationSchema } from "../ValidationSchema";
import {
  dialogBoxWarnings,
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
  updateFormB,
  updatesaveBtnActive
} from "../../../../redux/slices/formBSlice";
import FormRPartBPagination from "../FormRPartBPagination";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import store from "../../../../redux/store/store";
import { IProgSection } from "../../../../models/IProgressSection";
import { useConfirm } from "material-ui-confirm";
import { Panel } from "nhsuk-react-components/dist/deprecated";
interface IDeclarations {
  prevSectionLabel: string;
  saveDraft: (formData: FormRPartB) => Promise<void>;
  history: any;
  finalSections: IProgSection[];
}

const Declarations = ({
  prevSectionLabel,
  saveDraft,
  history,
  finalSections
}: IDeclarations) => {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSavedFormB);
  const saveBtnActive = useAppSelector(selectSaveBtnActive);

  const handleFormBSubmit = async (formDataSubmit: FormRPartB) => {
    if (!saveBtnActive) {
      dispatch(updatesaveBtnActive());
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
      const formBStatus = store.getState().formB.status;
      if (formBStatus === "succeeded") {
        history.push("/formr-b");
        dispatch(resetToInitFormB());
      }
    }
  };

  const handleSubClick = (
    vals: FormRPartB,
    setSubmitting: (arg: boolean) => void
  ) => {
    setSubmitting(false);
    confirm({
      description: dialogBoxWarnings.formSubMsg
    })
      .then(() => handleFormBSubmit(vals))
      .catch(() => {
        console.log("form b sub cancelled");
      });
  };

  return (
    <Formik
      initialValues={formData}
      validationSchema={Section7ValidationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        handleSubClick(values, setSubmitting);
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
  );
};

export default Declarations;
