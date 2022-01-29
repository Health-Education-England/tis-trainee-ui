import TextInputField from "../../TextInputField";
import ScrollTo from "../../ScrollTo";
import { Fieldset, Panel } from "nhsuk-react-components";
import { Form, Formik } from "formik";
import FormRPartBPagination from "../FormRPartBPagination";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { selectSavedFormB } from "../../../../redux/slices/formBSlice";
import ErrorPage from "../../../common/ErrorPage";
import { IFormRPartBSection } from "../../../../models/IFormRPartBSection";

const Section6 = ({
  prevSectionLabel,
  nextSectionLabel,
  saveDraft,
  previousSection,
  handleSectionSubmit
}: IFormRPartBSection) => {
  const formData = useAppSelector(selectSavedFormB);
  let content;
  if (!formData.traineeTisId)
    content = <ErrorPage error={"No Trainee Id found"}></ErrorPage>;
  else
    content = (
      <Formik
        initialValues={formData}
        onSubmit={values => {
          handleSectionSubmit(values);
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
              previousSection={previousSection}
            />
          </Form>
        )}
      </Formik>
    );
  return <div>{content}</div>;
};

export default Section6;
