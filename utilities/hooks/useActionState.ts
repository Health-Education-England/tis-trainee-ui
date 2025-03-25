import { useState } from "react";
import { ActionType } from "../../components/common/ActionModal";
import { ACTION_CONFIG } from "../Constants";

type ActionState = {
  type: ActionType | "";
  warningText: string;
  submittingText: string;
};

export function useActionState() {
  const [currentAction, setCurrentAction] = useState<ActionState>({
    type: "",
    warningText: "",
    submittingText: ""
  });

  const setAction = (label: ActionType) => {
    const actionType = label.toLowerCase() as keyof typeof ACTION_CONFIG;
    const actionConfig = ACTION_CONFIG[actionType] || {
      warning: "",
      submitting: ""
    };

    setCurrentAction({
      type: label,
      warningText: actionConfig.warning,
      submittingText: actionConfig.submitting
    });
  };

  const resetAction = () => {
    setCurrentAction({
      type: "",
      warningText: "",
      submittingText: ""
    });
  };

  return {
    currentAction,
    setAction,
    resetAction
  };
}
