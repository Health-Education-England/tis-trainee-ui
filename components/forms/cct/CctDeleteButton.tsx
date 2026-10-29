import { ReactNode, useState } from "react";
import { Button } from "nhsuk-react-components";
import history from "../../navigation/history";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { deleteCctCalculation } from "../../../redux/slices/cctSlice";
import { ActionModal } from "../../common/ActionModal";

type CctDeleteButtonProps = {
  id: string;
  name: string;
  small?: boolean;
  children: ReactNode;
};

export function CctDeleteButton({
  id,
  name,
  small,
  children
}: Readonly<CctDeleteButtonProps>) {
  const dispatch = useAppDispatch();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const close = () => {
    setIsConfirming(false);
    setHasFailed(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const action = await dispatch(deleteCctCalculation(id));
    if (deleteCctCalculation.fulfilled.match(action)) {
      history.replace("/cct", { deletedCalculation: { name } });
      return;
    }
    setIsDeleting(false);
    setHasFailed(true);
  };

  return (
    <>
      <Button
        warning
        small={small}
        type="button"
        onClick={() => setIsConfirming(true)}
        data-cy="cct-delete"
      >
        {children}
      </Button>
      {isConfirming && (
        <ActionModal
          onSubmit={handleDelete}
          isOpen={isConfirming}
          onClose={close}
          cancelBtnText="Cancel"
          warningLabel="Delete"
          warningText={`Are you sure you want to delete '${name}'? You cannot undo this.`}
          submittingBtnText="Deleting"
          actionType="Delete"
          isSubmitting={isDeleting}
          errorText={
            hasFailed
              ? "We could not delete your calculation. Try again."
              : undefined
          }
        />
      )}
    </>
  );
}
