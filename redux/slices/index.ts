import { combineReducers } from "redux";
import traineeProfileReducer from "./traineeProfileSlice";
import traineeActionsReducer from "./traineeActionsSlice";
import referenceReducer from "./referenceSlice";
import formsReducer from "./formsSlice";
import formAReducer from "./formASlice";
import formBReducer from "./formBSlice";
import featureFlagsReducer from "./featureFlagsSlice";
import userReducer from "./userSlice";
import dspReducer from "./dspSlice";
import tssUpdatesReducer from "./tssUpdatesSlice";
import notificationsReducer from "./notificationsSlice";

const rootReducer = combineReducers({
  traineeProfile: traineeProfileReducer,
  traineeActions: traineeActionsReducer,
  reference: referenceReducer,
  forms: formsReducer,
  formA: formAReducer,
  formB: formBReducer,
  featureFlags: featureFlagsReducer,
  user: userReducer,
  dsp: dspReducer,
  tssUpdates: tssUpdatesReducer,
  notifications: notificationsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
