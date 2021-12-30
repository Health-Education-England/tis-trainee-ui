import { combineReducers } from "redux";
import traineeProfileReducer from "./traineeProfileSlice";
import formsReducer from "./formsSlice";
import formAReducer from "./formASlice";

const rootReducer = combineReducers({
  traineeProfile: traineeProfileReducer,
  forms: formsReducer,
  formA: formAReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
