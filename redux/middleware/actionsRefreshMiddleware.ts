import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { completeTraineeAction } from "../slices/traineeActionsSlice";
import { saveFormA, updateFormA } from "../slices/formASlice";
import { saveFormB, updateFormB } from "../slices/formBSlice";
import { signCoj } from "../slices/traineeProfileSlice";
import { setActionsRefreshNeeded } from "../slices/traineeActionsSlice";

export const actionsRefreshMiddleware = createListenerMiddleware();

actionsRefreshMiddleware.startListening({
  matcher: isAnyOf(
    saveFormA.fulfilled,
    updateFormA.fulfilled,
    saveFormB.fulfilled,
    updateFormB.fulfilled,
    signCoj.fulfilled,
    completeTraineeAction.fulfilled // PM/PL checks
  ),
  effect: async (action, listenerApi) => {
    const isFormAction = [
      saveFormA.fulfilled.type,
      updateFormA.fulfilled.type,
      saveFormB.fulfilled.type,
      updateFormB.fulfilled.type
    ].includes(action.type);

    if (isFormAction) {
      // this bit is for FormR because API is update for both (auto)save and submit
      if (action.payload?.isSubmit) {
        listenerApi.dispatch(setActionsRefreshNeeded(true));
      }
    } else {
      // For Coj and PM/PL actions
      listenerApi.dispatch(setActionsRefreshNeeded(true));
    }
  }
});
