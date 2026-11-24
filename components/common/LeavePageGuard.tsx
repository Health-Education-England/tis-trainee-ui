import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ActionModal } from "./ActionModal";
import { listenForLeaveConfirmation } from "../navigation/history";

type LeavePageGuardProps = {
  hasUnsavedChanges: boolean;
};

const leaveWarning = "If you leave this page, your changes will be lost.";

const warnBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();

export function LeavePageGuard({
  hasUnsavedChanges
}: Readonly<LeavePageGuardProps>) {
  const history = useHistory();
  const confirmRef = useRef<(ok: boolean) => void>();
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const unblock = history.block((location, action) => {
      if (
        !confirmRef.current &&
        (action === "REPLACE" ||
          location.pathname === history.location.pathname)
      )
        return undefined;
      return leaveWarning;
    });
    const stopListening = listenForLeaveConfirmation(confirm => {
      confirmRef.current = confirm;
      setIsAsking(true);
    });
    return () => {
      unblock();
      stopListening();
    };
  }, [hasUnsavedChanges, history]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [hasUnsavedChanges]);

  if (!isAsking) return null;

  const answer = (ok: boolean) => {
    const confirm = confirmRef.current;
    confirmRef.current = undefined;
    setIsAsking(false);
    confirm?.(ok);
  };

  return (
    <ActionModal
      onSubmit={() => answer(true)}
      isOpen={true}
      onClose={() => answer(false)}
      cancelBtnText="Stay on this page"
      warningLabel="You have unsaved changes"
      warningText={leaveWarning}
      submittingBtnText=""
      isSubmitting={false}
      confirmBtnText="Leave without saving"
    />
  );
}
