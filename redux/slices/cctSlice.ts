import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import { toastErrText, toastSuccessText } from "../../utilities/Constants";
import { showToast, ToastType } from "../../components/common/ToastMessage";

export type CctType = "LTFT";

export type CctChangeType = {
  id?: string;
  type: CctType | null;
  startDate: Date | string;
  endDate?: Date | string;
  wte: number | null;
};

export type PmType = {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  wte: number | null;
  designatedBodyCode: string | null;
  managingDeanery: string | null;
};

export type CctCalculation = {
  id?: string;
  traineeTisId?: string;
  name?: string;
  cctDate?: Date | string;
  programmeMembership: PmType;
  changes: CctChangeType[];
  created?: Date | string;
  lastModified?: Date | string;
};

export const defaultCctCalc: CctCalculation = {
  programmeMembership: {
    id: "",
    name: "",
    startDate: "",
    endDate: "",
    wte: null,
    designatedBodyCode: null,
    managingDeanery: null
  },
  changes: [
    {
      type: "LTFT",
      startDate: "",
      endDate: "",
      wte: null
    }
  ]
};

type CctState = {
  cctCalc: CctCalculation;
  status: string;
  error: any;
  newCalcMade: boolean;
  formSaveStatus: string | number;
  formSaveError: any;
  formDeleteStatus: string | number;
  formDeleteError: any;
};

const initialState: CctState = {
  cctCalc: defaultCctCalc,
  status: "idle",
  error: "",
  newCalcMade: false,
  formSaveStatus: "idle",
  formSaveError: "",
  formDeleteStatus: "idle",
  formDeleteError: ""
};

export const loadSavedCctCalc = createAsyncThunk(
  "cct/loadSavedCctCalc",
  async (cctId: string) => {
    const traineeProfileService = new TraineeProfileService();
    const response = await traineeProfileService.getCctCalculation(cctId);
    return response.data;
  }
);

export const saveCctCalc = createAsyncThunk(
  "cct/saveCctCalc",
  async (cctCalc: CctCalculation) => {
    const traineeProfileService = new TraineeProfileService();
    const response = await traineeProfileService.saveCctCalculation(cctCalc);
    return response.data;
  }
);

export const updateCctCalc = createAsyncThunk(
  "cct/updateCctCalc",
  async (cctCalc: CctCalculation) => {
    const traineeProfileService = new TraineeProfileService();
    const response = await traineeProfileService.updateCctCalculation(cctCalc);
    return response.data;
  }
);

export const deleteCctCalc = createAsyncThunk(
  "cct/deleteCctCalc",
  async (cctId: string) => {
    const traineeProfileService = new TraineeProfileService();
    return await traineeProfileService.deleteCctCalculation(cctId);
  }
);

const cctSlice = createSlice({
  name: "cct",
  initialState,
  reducers: {
    resetCctCalc() {
      return initialState;
    },
    updatedCctCalc(state, action: PayloadAction<CctCalculation>) {
      state.cctCalc = action.payload;
    },
    updatedNewCalcMade(state, action: PayloadAction<boolean>) {
      state.newCalcMade = action.payload;
    },
    updatedCctStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    updatedFormSaveStatus(state, action: PayloadAction<string>) {
      state.formSaveStatus = action.payload;
    },
    updatedFormSaveError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    }
  },

  extraReducers(builder) {
    builder
      .addCase(loadSavedCctCalc.pending, state => {
        state.status = "loading";
      })
      .addCase(loadSavedCctCalc.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.cctCalc = payload;
      })
      .addCase(loadSavedCctCalc.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.loadSavedCctCalcMessage,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(saveCctCalc.pending, state => {
        state.formSaveStatus = "loading";
      })
      .addCase(saveCctCalc.fulfilled, (state, { payload }) => {
        state.formSaveStatus = "succeeded";
        state.cctCalc = payload;
        state.newCalcMade = false;
        showToast(toastSuccessText.saveCctCalcMessage, ToastType.SUCCESS);
      })
      .addCase(saveCctCalc.rejected, (state, { error }) => {
        state.formSaveStatus = "failed";
        state.formSaveError = error.message;
        showToast(
          toastErrText.saveCctCalcMessage,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(updateCctCalc.pending, state => {
        state.formSaveStatus = "loading";
      })
      .addCase(updateCctCalc.fulfilled, (state, { payload }) => {
        state.formSaveStatus = "succeeded";
        state.cctCalc = payload;
        state.newCalcMade = false;
        showToast(toastSuccessText.updateCctCalcMessage, ToastType.SUCCESS);
      })
      .addCase(updateCctCalc.rejected, (state, { error }) => {
        state.formSaveStatus = "failed";
        state.formSaveError = error.message;
        showToast(
          toastErrText.updateCctCalcMessage,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(deleteCctCalc.pending, state => {
        state.formDeleteStatus = "loading";
      })
      .addCase(deleteCctCalc.fulfilled, state => {
        state.formDeleteStatus = "succeeded";
        showToast(toastSuccessText.deleteCct, ToastType.SUCCESS);
      })
      .addCase(deleteCctCalc.rejected, (state, { error }) => {
        state.formDeleteStatus = "failed";
        state.formDeleteError = error.message;
        showToast(
          toastErrText.deleteCct,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default cctSlice.reducer;

export const {
  resetCctCalc,
  updatedCctCalc,
  updatedCctStatus,
  updatedNewCalcMade,
  updatedFormSaveStatus,
  updatedFormSaveError
} = cctSlice.actions;
