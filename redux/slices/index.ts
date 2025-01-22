import { combineReducers } from "redux";
import traineeProfileReducer from "./traineeProfileSlice";
import traineeActionsReducer from "./traineeActionsSlice";
import referenceReducer from "./referenceSlice";
import formsReducer from "./formsSlice";
import formAReducer from "./formASlice";
import formBReducer from "./formBSlice";
import featureFlagsReducer from "./featureFlagsSlice";
import userReducer from "./userSlice";
import tssUpdatesReducer from "./tssUpdatesSlice";
import notificationsReducer from "./notificationsSlice";
import cctReducer from "./cctSlice";
import cctListReducer from "./cctListSlice";
import ltftReducer from "./ltftSlice";
import ltftSummaryListReducer from "./ltftSummaryListSlice";

const rootReducer = combineReducers({
  traineeProfile: traineeProfileReducer,
  traineeActions: traineeActionsReducer,
  reference: referenceReducer,
  forms: formsReducer,
  formA: formAReducer,
  formB: formBReducer,
  featureFlags: featureFlagsReducer,
  user: userReducer,
  tssUpdates: tssUpdatesReducer,
  notifications: notificationsReducer,
  cct: cctReducer,
  cctSummaryList: cctListReducer,
  ltft: ltftReducer,
  ltftSummaryList: ltftSummaryListReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
