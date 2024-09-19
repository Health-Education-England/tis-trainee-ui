import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {openGmcModal, setCurrentGmcNumber, setDialogYPosition} from "../../redux/slices/gmcEditSlice";
import { ActionLink } from "nhsuk-react-components";

type GmcLinkProps = {
  gmcNumber: string;
};

export function GmcLink({
  gmcNumber
}: Readonly<GmcLinkProps>) {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector(state => state.gmcEdit.modalOpen);

  const handleClick = () => {
    dispatch(setDialogYPosition(window.scrollY));
    dispatch(openGmcModal());
    //alert(gmcNumber);
    dispatch(setCurrentGmcNumber(gmcNumber));
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
        disabled={modalState}
        title="Edit GMC number"
      >
        <span>{"Change "}</span>
      </ActionLink>
    </>
  );
}
