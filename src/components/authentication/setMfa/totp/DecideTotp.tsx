import { CognitoUser } from "@aws-amplify/auth";
import { Formik } from "formik";
import { Button, Form, Panel } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import {
  updatedTotpSection,
  updateTotpCode
} from "../../../../redux/slices/userSlice";
import { YES_NO_OPTIONS } from "../../../../utilities/Constants";
import MultiChoiceInputField from "../../../forms/MultiChoiceInputField";
import ThreeMinMsg from "./ThreeMinMsg";

interface IDecideTotp {
  user: CognitoUser | any;
  handleSectionSubmit: () => void;
}

const DecideTotp = ({ user, handleSectionSubmit }: IDecideTotp) => {
  const dispatch = useAppDispatch();
  return (
    <Formik
      initialValues={{
        appInstalledAlready: null
      }}
      onSubmit={values => {
        if (values.appInstalledAlready === "true") {
          dispatch(updateTotpCode(user));
          dispatch(updatedTotpSection(3));
        } else handleSectionSubmit();
      }}
    >
      {({ values, handleSubmit, isSubmitting }) => (
        <Form>
          <Panel label="I've already installed an Authenticator App">
            <MultiChoiceInputField
              type="radios"
              id="appInstalledAlready"
              name="appInstalledAlready"
              items={YES_NO_OPTIONS}
            ></MultiChoiceInputField>
          </Panel>
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
                ? "Add TIS Self-Service to your Auth App"
                : "Install your Authenticator App"}
            </Button>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default DecideTotp;
