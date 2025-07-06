import { Formik } from "formik";
import { Button, Form } from "nhsuk-react-components";
import ThreeMinMsg from "./ThreeMinMsg";
import TotpInstructions from "./TotpInstructions";
interface IInstallTotp {
  handleSectionSubmit: () => void;
}

const InstallTotp = ({ handleSectionSubmit }: IInstallTotp) => {
  return (
    <Formik
      initialValues={{
        mfaChoice: "",
        appInstalledNow: null
      }}
      onSubmit={async _values => {
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
                Add &#39;NHS TIS Self-Service&#39; to your Authenticator App
              </Button>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default InstallTotp;
