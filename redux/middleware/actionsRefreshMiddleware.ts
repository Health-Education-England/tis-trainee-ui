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
    // this bit is for FormR because API is update for both (auto)save and submit
    if (action.payload?.isSubmit) {
      listenerApi.dispatch(setActionsRefreshNeeded(true));
    }
  }
});
