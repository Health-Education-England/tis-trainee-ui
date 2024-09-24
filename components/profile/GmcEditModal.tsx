import { Modal } from "../common/Modal";
import { GmcEditForm, GmcDataType } from "./GmcEditForm";

export type GmcEditModalProps = {
  onSubmit: (data: GmcDataType) => void;
  isOpen: boolean;
  onClose: () => void;
  warningText: null | string;
  gmcData: GmcDataType;
};

export const GmcEditModal = ({
  onSubmit,
  isOpen,
  onClose,
  warningText,
  gmcData
}: GmcEditModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <GmcEditForm
        onSubmit={onSubmit}
        warningText={warningText}
        gmcData={gmcData}
      />
    </Modal>
  );
};
