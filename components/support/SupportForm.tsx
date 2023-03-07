import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Button, Card, Fieldset } from "nhsuk-react-components";
import ScrollTo from "../forms/ScrollTo";
import { AutocompleteSelect } from "../common/AutocompleteSelect";

const SupportForm = () => {
  const supportCatOptions = [
    { value: "dsp", label: "DSP" },
    { value: "formRA", label: "Form R Part A" },
    { value: "formRB", label: "Form R Part B" },
    { value: "personalDetails", label: "Personal Details" },
    { value: "mfa", label: "MFA" },
    { value: "placements", label: "Placements" },
    { value: "programmes", label: "Programmes" }
  ];
  return (
    <Formik
      initialValues={{ supportCats: [] }}
      validationSchema={Yup.object({
        supportCats: Yup.array()
          .min(1, "At least 1 support category is required.")
          .required()
      }).nullable()}
      onSubmit={values => console.log(values)}
    >
      {({
        values,
        errors,
        handleSubmit,
        setFieldValue,
        isValid,
        isSubmitting
      }) => (
        <Form>
          <ScrollTo />
          <Card feature data-cy="techSupportLabel">
            <Card.Content>
              <Card.Heading>Need help?</Card.Heading>
              <Fieldset.Legend size="m" data-cy="supportText">
                Please choose the category (or categories) that best describes
                your support issue
              </Fieldset.Legend>
              <AutocompleteSelect
                value={values.supportCats}
                onChange={setFieldValue}
                error={errors.supportCats}
                options={supportCatOptions}
                name="supportCats"
                label=""
                isMulti={true}
                closeMenuOnSelect={false}
              />
              <div>{JSON.stringify(values.supportCats)}</div>
            </Card.Content>
          </Card>

          <Button
            onClick={(e: { preventDefault: () => void }) => {
              e.preventDefault();
              handleSubmit();
            }}
            disabled={!isValid || isSubmitting}
            data-cy="BtnSupportForm"
          >
            {isSubmitting
              ? "Opening your email..."
              : "Click to open support email"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SupportForm;
