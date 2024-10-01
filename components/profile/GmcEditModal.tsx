import { Modal } from "../common/Modal";
import { GmcEditForm, GmcDataType } from "./GmcEditForm";

export type GmcEditModalProps = {
  onSubmit: (data: GmcDataType) => void;
  isOpen: boolean;
  onClose: () => void;
};

export const GmcEditModal = ({
  onSubmit,
  isOpen,
  onClose
}: GmcEditModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <GmcEditForm onSubmit={onSubmit} />
    </Modal>
  );
};
