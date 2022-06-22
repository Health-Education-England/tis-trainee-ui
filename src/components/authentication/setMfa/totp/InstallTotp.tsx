import { CognitoUser } from "@aws-amplify/auth";
import { Formik } from "formik";
import { Button, Form } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updateTotpCode } from "../../../../redux/slices/userSlice";
import ThreeMinMsg from "./ThreeMinMsg";
import TotpInstructions from "./TotpInstructions";

interface IInstallTotp {
  user: CognitoUser | any;
  handleSectionSubmit: () => void;
}

const InstallTotp = ({ user, handleSectionSubmit }: IInstallTotp) => {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={{
        mfaChoice: "",
        appInstalledNow: null
      }}
      onSubmit={_values => {
        dispatch(updateTotpCode(user));
        handleSectionSubmit();
      }}
    >
      {({ values, handleSubmit, isSubmitting }) => (
        <Form>
          <TotpInstructions />
          {values.appInstalledNow !== null && (
            <>
              <ThreeMinMsg />
              <Button
                onClick={(e: { preventDefault: () => void }) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                disabled={isSubmitting}
              >
                Add 'NHS TIS Self-Service' to your Authenticator App
              </Button>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default InstallTotp;
