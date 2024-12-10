import { Form, Formik } from "formik";
import { Modal } from "../../common/Modal";
import TextInputField from "../TextInputField";
import { Button } from "nhsuk-react-components";
import { CctCalculation } from "../../../redux/slices/cctSlice";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import { handleCctSubmit } from "../../../utilities/CctUtilities";
import { useAppSelector } from "../../../redux/hooks/hooks";
import ErrorPage from "../../common/ErrorPage";

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
  const formSaveStatus = useAppSelector(state => state.cct.formSaveStatus);
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
              {formSaveStatus === "failed" && (
                <ErrorPage message="There was a problem saving your calculation. Please try again." />
              )}
              <TextInputField
                name="name"
                id="cctName"
                label="Give your calculation a name"
                placeholder="Type name here..."
              />
              <Button
                type="submit"
                disabled={!values.name || isSubmitting}
                data-cy="cct-modal-save-btn"
              >
                {isSubmitting ? "Saving..." : "Save calculation"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}
