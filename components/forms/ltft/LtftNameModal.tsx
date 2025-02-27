import { Form, Formik } from "formik";
import { Modal } from "../../common/Modal";
import TextInputField from "../TextInputField";
import { Button, WarningCallout } from "nhsuk-react-components";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";

type LtftNameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LtftNameModal({
  isOpen,
  onClose
}: Readonly<LtftNameModalProps>) {
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();
  return (
    <Modal isOpen={isOpen} onClose={onClose} cancelBtnText="Cancel">
      <Formik
        initialValues={{ name: "" }}
        onSubmit={({ name }) => {
          // Note: to handle submit
        }}
      >
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
                  label="Give your LTFT a name"
                  placeholder="Type name here..."
                />
                <Button
                  type="submit"
                  disabled={!values.name || isSubmitting}
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
