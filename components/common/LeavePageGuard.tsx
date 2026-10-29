import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Action, Location } from "history";
import { ActionModal } from "./ActionModal";

type LeavePageGuardProps = {
  hasUnsavedChanges: boolean;
};

type BlockedNavigation = {
  location: Location;
  action: Action;
};

export function LeavePageGuard({
  hasUnsavedChanges
}: Readonly<LeavePageGuardProps>) {
  const history = useHistory();
  const [blockedNavigation, setBlockedNavigation] =
    useState<BlockedNavigation | null>(null);
  const unblockRef = useRef<() => void>();

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const unblock = history.block((location, action) => {
      if (
        action === "REPLACE" ||
        location.pathname === history.location.pathname
      )
        return undefined;
      setBlockedNavigation({ location, action });
      return false;
    });
    unblockRef.current = unblock;
    return unblock;
  }, [hasUnsavedChanges, history]);

  if (!blockedNavigation) return null;

  const leave = () => {
    unblockRef.current?.();
    if (blockedNavigation.action === "POP") history.goBack();
    else history.push(blockedNavigation.location);
  };

  return (
    <ActionModal
      onSubmit={leave}
      isOpen={true}
      onClose={() => setBlockedNavigation(null)}
      cancelBtnText="Stay on this page"
      warningLabel="You have unsaved changes"
      warningText="If you leave this page, your changes will be lost."
      submittingBtnText=""
      isSubmitting={false}
      confirmBtnText="Leave without saving"
    />
  );
}
