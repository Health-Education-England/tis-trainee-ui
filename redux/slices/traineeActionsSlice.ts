import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeActionsService } from "../../services/TraineeActionsService";
import { TraineeAction } from "../../models/TraineeAction";
import { DateUtilities } from "../../utilities/DateUtilities";
import { toastErrText } from "../../utilities/Constants";
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
      await actionsService.getTraineeActions();
    return response.data;
  }
);

const traineeActionsSlice = createSlice({
  name: "traineeActions",
  initialState,
  reducers: {
    resetToInit() {
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
        state.traineeActionsData = DateUtilities.genericSort(
          action.payload,
          "due",
          false
        );
      })
      .addCase(fetchTraineeActionsData.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.fetchTraineeActionsData,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default traineeActionsSlice.reducer;

export const { updatedActionsData } = traineeActionsSlice.actions;

export const selectTraineeActions = (state: { traineeActions: IAction }) =>
  state.traineeActions.traineeActionsData;
