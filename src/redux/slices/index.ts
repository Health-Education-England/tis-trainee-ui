import { combineReducers } from "redux";
import traineeProfileReducer from "./traineeProfileSlice";
import referenceReducer from "./referenceSlice";
import formsReducer from "./formsSlice";
import formAReducer from "./formASlice";

const rootReducer = combineReducers({
  traineeProfile: traineeProfileReducer,
  reference: referenceReducer,
  forms: formsReducer,
  formA: formAReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
