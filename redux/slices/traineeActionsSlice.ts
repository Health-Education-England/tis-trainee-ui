import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeActionsService } from "../../services/TraineeActionsService";
import { TraineeAction } from "../../models/TraineeAction";
import { DateUtilities } from "../../utilities/DateUtilities";
import { toastErrText, toastSuccessText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";

interface IAction {
  traineeActionsData: TraineeAction[];
  status: string;
  error: any;
}

export const initialState: IAction = {
  traineeActionsData: [],
  status: "idle",
  error: ""
};

export const fetchTraineeActionsData = createAsyncThunk(
  "traineeActions/fetchTraineeActionsData",
  async () => {
    const actionsService = new TraineeActionsService();
    const response: AxiosResponse<TraineeAction[]> =
      await actionsService.getIncompleteTraineeActions();
    return response.data;
  }
);

export const completeTraineeAction = createAsyncThunk(
  "traineeActions/completeTraineeAction",
  async (actionId: string) => {
    const actionService = new TraineeActionsService();
    const response: AxiosResponse<TraineeAction> =
      await actionService.completeTraineeAction(actionId);
    return response.data;
  }
);

const traineeActionsSlice = createSlice({
  name: "traineeActions",
  initialState,
  reducers: {
    resetTraineeAction() {
      return initialState;
    },
    updatedActionsData(state, action: PayloadAction<TraineeAction[]>) {
      return {
        ...state,
        traineeActionsData: action.payload
      };
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTraineeActionsData.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchTraineeActionsData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.traineeActionsData = action.payload;
      })
      .addCase(fetchTraineeActionsData.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.fetchTraineeActionsData,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(completeTraineeAction.pending, state => {
        state.status = "saving";
      })
      .addCase(completeTraineeAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        showToast(toastSuccessText.completeTraineeAction, ToastType.SUCCESS);
      })
      .addCase(completeTraineeAction.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.completeTraineeAction,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default traineeActionsSlice.reducer;

export const { updatedActionsData, resetTraineeAction } =
  traineeActionsSlice.actions;

export const selectTraineeActions = (state: { traineeActions: IAction }) =>
  state.traineeActions.traineeActionsData;
