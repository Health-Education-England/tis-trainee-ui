import { Modal } from "../../common/Modal";
import { FormLinkerForm, LinkedFormRDataType } from "./FormLinkerForm";

type FormLinkerModalProps = {
  onSubmit: (data: LinkedFormRDataType) => void;
  isOpen: boolean;
  onClose: () => void;
  warningText: null | string;
  linkedFormData?: LinkedFormRDataType;
};

export const FormLinkerModal = ({
  onSubmit,
  isOpen,
  onClose,
  warningText,
  linkedFormData
}: FormLinkerModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormLinkerForm
        onSubmit={onSubmit}
        warningText={warningText}
        linkedFormData={linkedFormData}
      />
    </Modal>
  );
};
