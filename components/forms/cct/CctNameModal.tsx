import { Form, Formik } from "formik";
import { Modal } from "../../common/Modal";
import TextInputField from "../TextInputField";
import { Button } from "nhsuk-react-components";
import { CctCalculation } from "../../../redux/slices/cctSlice";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import { handleCctSubmit } from "../../../utilities/CctUtilities";

type CctNameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  viewedCalc: CctCalculation;
};

export function CctNameModal({
  isOpen,
  onClose,
  viewedCalc
}: Readonly<CctNameModalProps>) {
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();
  return (
    <Modal isOpen={isOpen} onClose={onClose} cancelBtnText="Close">
      <Formik
        initialValues={{ name: "" }}
        onSubmit={({ name }) => {
          handleCctSubmit(startSubmitting, stopSubmitting, viewedCalc, name);
        }}
      >
        {({ values }) => {
          return (
            <Form>
              <TextInputField
                name="name"
                id="cctName"
                label="Give your calculation a name"
                placeholder="Type name here..."
              />
              <Button type="submit" disabled={!values.name || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save calculation"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}
