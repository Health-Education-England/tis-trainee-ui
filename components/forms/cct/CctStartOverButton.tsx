import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "nhsuk-react-components";
import history from "../../navigation/history";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { ActionModal } from "../../common/ActionModal";

type CctStartOverButtonProps = {
  hasUnsavedChanges: boolean;
};

export function CctStartOverButton({
  hasUnsavedChanges
}: Readonly<CctStartOverButtonProps>) {
  const saveStatus = useAppSelector(state => state.cct.saveStatus);
  const [isConfirming, setIsConfirming] = useState(false);
  const startOverButtonRef = useRef<HTMLButtonElement>(null);

  const startOver = () => {
    history.push("/cct/create");
    window.scrollTo({ top: 0 });
  };

  const handleClick = () => {
    if (saveStatus === "loading") return;
    if (hasUnsavedChanges) setIsConfirming(true);
    else startOver();
  };

  const close = () => {
    flushSync(() => setIsConfirming(false));
    startOverButtonRef.current?.focus();
  };

  return (
    <>
      <Button
        ref={startOverButtonRef}
        secondary
        type="button"
        onClick={handleClick}
        data-cy="cct-start-over"
      >
        Start over
      </Button>
      {isConfirming && (
        <ActionModal
          onSubmit={startOver}
          isOpen={isConfirming}
          onClose={close}
          cancelBtnText="Cancel"
          warningLabel="Start over"
          warningText="If you start over, everything you have entered will be cleared."
          submittingBtnText=""
          isSubmitting={false}
          confirmBtnText="Start over"
        />
      )}
    </>
  );
}
