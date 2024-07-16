import { Button } from "nhsuk-react-components";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement>(null);
  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
    setIsModalOpen(false);
  };

  // Note: Needed to add handleKeyDown because without it the modal would not reopen after closing via esc key (but sonarlint doesn't like it!).
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  return (
    <dialog
      ref={modalRef}
      className="modal"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      {children}
      <Button type="button" reverse onClick={handleCloseModal}>
        Cancel
      </Button>
    </dialog>
  );
};
