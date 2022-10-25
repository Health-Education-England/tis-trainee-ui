import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { TraineeProfile } from "../../models/TraineeProfile";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import { initialPersonalDetails } from "../../models/PersonalDetails";
import { Placement } from "../../models/Placement";

interface IProfile {
  traineeProfileData: TraineeProfile;
  status: string;
  error: any;
  parRes: any;
}

export const initialState: IProfile = {
  traineeProfileData: {
    traineeTisId: "",
    personalDetails: initialPersonalDetails,
    programmeMemberships: [],
    placements: []
  },
  status: "idle",
  error: "",
  parRes: null
};

export const fetchTraineeProfileData = createAsyncThunk(
  "traineeProfile/fetchTraineeProfileData",
  async () => {
    const traineeProfileService = new TraineeProfileService();
    const response: AxiosResponse<TraineeProfile> =
      await traineeProfileService.getTraineeProfile();
    return response.data;
  }
);

// TODO CORS error if addCredential made via localhost

// const addCredential = createAsyncThunk(
//   "traineeProfile/issueCredential",
//   async (reqUri: string) => {
//     const response = await axios.get(
//       "https://nhsappdevdidgw.azurewebsites.net/issuing/authorize",
//       {
//         params: {
//           client_id: "4973e006-9f07-4a95-a1bf-d4fca61eef73",
//           request_uri: reqUri
//         }
//       }
//     );
//     return response.data;
//   }
// );

// export const issueDspPlacementCredential = createAsyncThunk(
//   "traineeProfile/makeParRequest",
//   async (pl: Placement, { dispatch }) => {
//     const traineeProfileService = new TraineeProfileService();
//     const response: AxiosResponse<any> =
//       await traineeProfileService.makeDspPlacementParRequest(pl);
//     const finalRes = dispatch(addCredential(response.data.request_uri));
//     console.log("par req final response: ", finalRes);
//     return finalRes;
//   }
// );

// Placeholder thunk to test the PAR request
export const makeParRequest = createAsyncThunk(
  "traineeProfile/makeParRequest",
  async (pl: Placement) => {
    const traineeProfileService = new TraineeProfileService();
    const response: AxiosResponse<any> =
      await traineeProfileService.makeDspPlacementParRequest(pl);
    console.log("makeParRequest res: ", response.data);
    return response.data;
  }
);

const traineeProfileSlice = createSlice({
  name: "traineeProfile",
  initialState,
  reducers: {
    resetToInit() {
      return initialState;
    },
    updatedTraineeProfileData(state, action: PayloadAction<TraineeProfile>) {
      return { ...state, traineeProfileData: action.payload };
    },
    updatedTraineeProfileStatus(state, action: PayloadAction<string>) {
      return { ...state, status: action.payload };
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTraineeProfileData.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchTraineeProfileData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.traineeProfileData = action.payload;
      })
      .addCase(fetchTraineeProfileData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(makeParRequest.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(makeParRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parRes = action.payload;
      })
      .addCase(makeParRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default traineeProfileSlice.reducer;

export const {
  resetToInit,
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} = traineeProfileSlice.actions;

export const selectTraineeProfile = (state: { traineeProfile: IProfile }) =>
  state.traineeProfile.traineeProfileData;
