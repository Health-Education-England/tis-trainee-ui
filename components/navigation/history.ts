import { createBrowserHistory } from "history";

type LeaveConfirmation = (confirm: (ok: boolean) => void) => void;

let leaveConfirmation: LeaveConfirmation | undefined;

export const listenForLeaveConfirmation = (listener: LeaveConfirmation) => {
  leaveConfirmation = listener;
  return () => {
    if (leaveConfirmation === listener) leaveConfirmation = undefined;
  };
};

let history: any;
if (typeof document !== "undefined") {
  history = createBrowserHistory({
    getUserConfirmation: (message, confirm) => {
      if (leaveConfirmation) leaveConfirmation(confirm);
      else confirm(window.confirm(message));
    }
  });
}

export default history;
