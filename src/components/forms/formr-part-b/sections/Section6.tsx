import TextInputField from "../../TextInputField";
import ScrollTo from "../../ScrollTo";
import { Fieldset, Panel } from "nhsuk-react-components";
import { Form, Formik } from "formik";
import FormRPartBPagination from "../FormRPartBPagination";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  incrementFormBSection,
  selectSavedFormB,
  updatedFormB
} from "../../../../redux/slices/formBSlice";
import { FormRPartB } from "../../../../models/FormRPartB";

interface ISection6 {
  prevSectionLabel: string;
  nextSectionLabel: string;
  saveDraft: (formData: FormRPartB) => Promise<void>;
  history: any;
}

const Section6 = ({
  prevSectionLabel,
  nextSectionLabel,
  saveDraft,
  history
}: ISection6) => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSavedFormB);
  return (
    formData && (
      <Formik
        initialValues={formData}
        onSubmit={values => {
          dispatch(updatedFormB(values));
          dispatch(incrementFormBSection());
        }}
      >
        {({ values, handleSubmit }) => (
          <Form>
            <ScrollTo />
            <Fieldset
              disableErrorLine={true}
              name="currentDeclarations"
              data-jest="mainFieldset6"
            >
              <Fieldset.Legend
                headingLevel="H2"
                size="l"
                data-cy="legendFieldset6"
              >
                Section 6: Compliments
              </Fieldset.Legend>
              <Panel label="Compliments" data-cy="complimentsPanel">
                <TextInputField
                  name="compliments"
                  rows={15}
                  label=""
                  data-cy="compliments"
                  data-jest="compliments"
                  hint={
                    <span>
                      Compliments are another important piece of feedback. You
                      may wish to detail here any compliments that you have
                      received which are not already recorded in your portfolio,
                      to help give a better picture of your practice as a whole.
                      <strong>This section is not compulsory.</strong>
                    </span>
                  }
                />
              </Panel>
            </Fieldset>

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

export default Section6;
