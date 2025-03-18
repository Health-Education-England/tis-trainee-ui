import { Form, Formik, FormikHelpers } from "formik";
import { Modal } from "../../common/Modal";
import TextInputField from "../TextInputField";
import { Button, WarningCallout } from "nhsuk-react-components";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";

type LtftNameModalProps = {
  onSubmit: (values: { name: string }) => void;
  isOpen: boolean;
  onClose: () => void;
};

export function LtftNameModal({
  onSubmit,
  isOpen,
  onClose
}: Readonly<LtftNameModalProps>) {
  const { isSubmitting } = useSubmitting();
  return (
    <Modal isOpen={isOpen} onClose={onClose} cancelBtnText="Cancel">
      <Formik initialValues={{ name: "" }} onSubmit={onSubmit}>
        {({ values }) => {
          return (
            <>
              <WarningCallout data-cy="ltftModalWarning">
                <WarningCallout.Label visuallyHiddenText={false}>
                  Important
                </WarningCallout.Label>
                <p>
                  Please check the details of the form carefully before
                  submission. Are you sure you want to submit it?
                </p>
              </WarningCallout>
              <Form>
                <TextInputField
                  name="name"
                  id="ltftName"
                  label="Please give your Changing hours (LTFT) application a name"
                  placeholder="Type name here..."
                  width="300px"
                />
                <Button
                  type="submit"
                  disabled={!values.name.trim() || isSubmitting}
                  data-cy="ltft-modal-save-btn"
                >
                  {isSubmitting ? "Saving..." : "Confirm & Continue"}
                </Button>
              </Form>
            </>
          );
        }}
      </Formik>
    </Modal>
  );
}
