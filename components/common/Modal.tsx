import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "nhsuk-react-components";

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement>(null);
  const handleCloseModal = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setIsModalOpen(false);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCloseModal]);

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
      data-cy="formLinkerModal"
    >
      {children}
      <Button
        data-cy="modal-cancel-btn"
        type="button"
        reverse
        onClick={handleCloseModal}
      >
        Cancel
      </Button>
    </dialog>
  );
};
