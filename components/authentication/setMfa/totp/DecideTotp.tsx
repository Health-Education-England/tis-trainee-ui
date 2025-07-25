import { Formik } from "formik";
import { Button, Card, Form } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedTotpSection } from "../../../../redux/slices/userSlice";
import { YES_NO_OPTIONS } from "../../../../utilities/Constants";
import MultiChoiceInputField from "../../../forms/MultiChoiceInputField";
import ThreeMinMsg from "./ThreeMinMsg";
interface IDecideTotp {
  handleSectionSubmit: () => void;
}

const DecideTotp = ({ handleSectionSubmit }: IDecideTotp) => {
  const dispatch = useAppDispatch();
  return (
    <Formik
      initialValues={{
        appInstalledAlready: null
      }}
      onSubmit={async values => {
        if (values.appInstalledAlready === "true") {
          dispatch(updatedTotpSection(3));
        } else handleSectionSubmit();
      }}
    >
      {({ values, handleSubmit, isSubmitting }) => (
        <Form>
          <Card feature data-cy="appInstalledAlreadyChoose">
            <Card.Content>
              <Card.Heading>
                I&#39;ve already installed an Authenticator App
              </Card.Heading>
              <MultiChoiceInputField
                type="radios"
                id="appInstalledAlready"
                name="appInstalledAlready"
                items={YES_NO_OPTIONS}
              ></MultiChoiceInputField>
            </Card.Content>
          </Card>
          {values.appInstalledAlready === "true" && <ThreeMinMsg />}
          {values.appInstalledAlready !== null && (
            <Button
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={isSubmitting}
            >
              {values.appInstalledAlready === "true"
                ? "Add 'NHS TIS Self-Service' to your Authenticator App"
                : "Install your Authenticator App"}
            </Button>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default DecideTotp;
