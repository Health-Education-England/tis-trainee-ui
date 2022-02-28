import { combineReducers } from "redux";
import traineeProfileReducer from "./traineeProfileSlice";
import referenceReducer from "./referenceSlice";
import formsReducer from "./formsSlice";
import formAReducer from "./formASlice";
import formBReducer from "./formBSlice";
import featureFlagsReducer from "./featureFlagsSlice";
import notificationsReducer from "./notificationsSlice";

const rootReducer = combineReducers({
  traineeProfile: traineeProfileReducer,
  reference: referenceReducer,
  forms: formsReducer,
  formA: formAReducer,
  formB: formBReducer,
  featureFlags: featureFlagsReducer,
  notifications: notificationsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
