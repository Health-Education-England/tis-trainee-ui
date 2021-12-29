import { combineReducers } from "redux";
import traineeProfileReducer from "./traineeProfileSlice";
import formsReducer from "./formsSlice";

const rootReducer = combineReducers({
  traineeProfile: traineeProfileReducer,
  forms: formsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
