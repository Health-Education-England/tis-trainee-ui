import { Modal } from "../common/Modal";
import { EmailEditForm, EmailDataType } from "./EmailEditForm";

export type EmailEditModalProps = {
  onSubmit: (data: EmailDataType) => void;
  isOpen: boolean;
  onClose: () => void;
};

export const EmailEditModal = ({
  onSubmit,
  isOpen,
  onClose
}: EmailEditModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <EmailEditForm onSubmit={onSubmit} />
    </Modal>
  );
};
