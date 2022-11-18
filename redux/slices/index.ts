import { combineReducers } from "redux";
import traineeProfileReducer from "./traineeProfileSlice";

const rootReducer = combineReducers({
  traineeProfile: traineeProfileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
