import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { ActionLink } from "nhsuk-react-components";
import { GmcEditModal } from "./GmcEditModal";
import { truncate } from "fs/promises";

type GmcLinkProps = {
  gmcNumber: string;
};

export function GmcLink({ gmcNumber }: Readonly<GmcLinkProps>) {
  let modalOpen = false;

  const handleClick = () => {
    alert("here");
    modalOpen = true;
    return (
      <>
        <GmcEditModal
          isOpen={true}
          onClose={() => (modalOpen = false)}
          onSubmit={() => alert("set GMC number")}
          gmcData={{ gmcNumber: gmcNumber }}
          warningText={"potato"}
        ></GmcEditModal>
      </>
    );
  };
  return (
    <>
      <ActionLink
        id="gmc-link"
        data-cy="editGmcLink"
        as="a"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        disabled={modalOpen}
        title="Edit GMC number"
      >
        <span>{"Change "}</span>
      </ActionLink>
    </>
  );
}
