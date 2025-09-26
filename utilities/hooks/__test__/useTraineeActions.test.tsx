import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useTraineeActions } from "../useTraineeActions";
import userReducer from "../../../redux/slices/userSlice";
import traineeActionsReducer, {
  IAction
} from "../../../redux/slices/traineeActionsSlice";
import traineeProfileReducer, {
  IProfile
} from "../../../redux/slices/traineeProfileSlice";
import { mockActionsTestData } from "../../../mock-data/mock-trainee-actions-data";
import { mockProfileDataToTestPlacementActions } from "../../../mock-data/trainee-profile";

const mockTraineeProfile: IProfile = {
  traineeProfileData: mockProfileDataToTestPlacementActions,
  status: "Succeeded",
  gmcStatus: "idle",
  error: ""
};

const mockTraineeActions: IAction = {
  traineeActionsData: mockActionsTestData,
  status: "Succeeded",
  error: "",
  refreshNeeded: false
};

const createWrapper =
  (store: any) =>
  ({ children }: { children: React.ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

describe("useTraineeActions", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
        traineeActions: traineeActionsReducer,
        traineeProfile: traineeProfileReducer
      },
      preloadedState: {
        traineeProfile: mockTraineeProfile,
        traineeActions: mockTraineeActions
      }
    });
  });

  test("returns grouped outstanding actions", () => {
    const { result } = renderHook(() => useTraineeActions(), {
      wrapper: createWrapper(store)
    });

    expect(result.current.groupedOutstandingActions).toBeDefined();
    expect(result.current.hasOutstandingActions).toBe(true);
  });
});
