import { useState } from "react";
import { ActionType } from "../../components/common/ActionModal";
import { ACTION_CONFIG } from "../Constants";
import { FormName } from "../../components/forms/form-builder/FormBuilder";

export type ActionState = {
  type: ActionType | null;
  warningText: string;
  submittingText: string;
  id: string;
  formName: FormName | null;
};

const defaultActionState: ActionState = {
  type: null,
  warningText: "",
  submittingText: "",
  id: "",
  formName: null
};

export function useActionState() {
  const [currentAction, setCurrentAction] =
    useState<ActionState>(defaultActionState);

  const setAction = (label: ActionType, id: string, formName: FormName) => {
    const actionType = label.toLowerCase();
    const actionConfig = ACTION_CONFIG[actionType] || {
      warning: "",
      submitting: ""
    };

    setCurrentAction({
      type: label,
      warningText: actionConfig.warning,
      submittingText: actionConfig.submitting,
      id,
      formName
    });
  };

  const resetAction = () => {
    setCurrentAction(defaultActionState);
  };

  return {
    currentAction,
    setAction,
    resetAction
  };
}
