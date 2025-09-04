import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { saveFormA, updateFormA } from "../slices/formASlice";
import { signCoj } from "../slices/traineeProfileSlice";
import { setActionsRefreshNeeded } from "../slices/traineeActionsSlice";
import { completeTraineeAction } from "../slices/traineeActionsSlice";

export const actionsRefreshMiddleware = createListenerMiddleware();

actionsRefreshMiddleware.startListening({
  matcher: isAnyOf(
    saveFormA.fulfilled,
    updateFormA.fulfilled,
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
