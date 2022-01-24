import { combineReducers } from "redux";
import traineeProfileReducer from "./traineeProfileSlice";
import referenceReducer from "./referenceSlice";
import formsReducer from "./formsSlice";
import formAReducer from "./formASlice";
import formBReducer from "./formBSlice";
import featureFlagsReducer from "./featureFlagsSlice";

const rootReducer = combineReducers({
  traineeProfile: traineeProfileReducer,
  reference: referenceReducer,
  forms: formsReducer,
  formA: formAReducer,
  formB: formBReducer,
  featureFlags: featureFlagsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
