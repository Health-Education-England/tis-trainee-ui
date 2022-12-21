import TextInputField from "../../TextInputField";
import ScrollTo from "../../ScrollTo";
import { Card, Fieldset } from "nhsuk-react-components";
import { Form, Formik } from "formik";
import FormRPartBPagination from "../FormRPartBPagination";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { selectSavedFormB } from "../../../../redux/slices/formBSlice";
import { IFormRPartBSection } from "../../../../models/IFormRPartBSection";

const Section6 = ({
  prevSectionLabel,
  nextSectionLabel,
  saveDraft,
  previousSection,
  handleSectionSubmit
}: IFormRPartBSection) => {
  const formData = useAppSelector(selectSavedFormB);

  return (
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
            <Card feature data-cy="complimentsPanel">
              <Card.Content>
                <Card.Heading>Compliments</Card.Heading>
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
              </Card.Content>
            </Card>
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
};

export default Section6;
