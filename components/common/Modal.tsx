import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "nhsuk-react-components";

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  cancelBtnText?: string;
};

export const Modal = ({
  children,
  isOpen,
  onClose,
  cancelBtnText = "Cancel"
}: ModalProps) => {
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

  useEffect(() => {
    const modalElement = modalRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (modalElement && event.target === modalElement) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      modalElement?.addEventListener("click", handleClickOutside);
    } else {
      modalElement?.removeEventListener("click", handleClickOutside);
    }

    return () => {
      modalElement?.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen, handleCloseModal]);

  return (
    <dialog ref={modalRef} aria-modal="true" data-cy="dialogModal">
      <div className="dialog-contents-wrapper">
        {children}
        <Button
          data-cy="modal-cancel-btn"
          type="button"
          reverse
          onClick={handleCloseModal}
        >
          {cancelBtnText}
        </Button>
      </div>
    </dialog>
  );
};
