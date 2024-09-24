import { ActionLink } from "nhsuk-react-components";
import { GmcEditModal, GmcEditModalProps } from "./GmcEditModal";
import { useEffect, useMemo, useState } from "react";
import { GmcDataType } from "./GmcEditForm";

export function GmcLink({ gmcNumber }: Readonly<GmcDataType>) {
  const [showModal, setShowModal] = useState(false);
  let modalOpen = false;

  const handleGmcEditClick = () => {
    setShowModal(true);
  };
  
  const handleModalFormSubmit = (data: GmcDataType) => {
    //update state
    setShowModal(false);
  };
  
  const handleModalFormClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <ActionLink
        id="gmc-link"
        data-cy="editGmcLink"
        as="a"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleGmcEditClick}
        disabled={!showModal}
        title="Edit GMC number"
      >
        <span>{"Change "}</span>
      </ActionLink>
      <GmcEditModal
        key={'test'}
        onSubmit={handleModalFormSubmit}
        isOpen={showModal}
        onClose={handleModalFormClose}
        warningText={'some text'}
        gmcData={{gmcNumber: gmcNumber}}
      />
    </>
  );
}
