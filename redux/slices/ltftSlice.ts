import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormsService } from "../../services/FormsService";

type CctType = {
  currentWte: number | string;
  newWte: number | string;
  startDate: Date | string;
  endDate: Date | string;
  linkedProgEndDate: Date | string;
};

export type LtftType = {
  id?: string;
  traineeTisId?: string;
  programmeMembershipId: string | null;
  cct: CctType;
};

type LtftState = {
  ltftList: LtftType[] | [];
  ltftApplicationData: LtftType;
  status: string;
  error: any;
};

const initialState: LtftState = {
  ltftList: [],
  ltftApplicationData: {
    programmeMembershipId: null,
    cct: {
      currentWte: "",
      newWte: "",
      startDate: "",
      endDate: "",
      linkedProgEndDate: ""
    }
  },
  status: "idle",
  error: ""
};

// export const loadLtftList = createAsyncThunk(
//     "ltft/fetchLtftList",
//     async () => {
//         const formsService = new FormsService();
//         const response = await formsService.getLtftList();
//         return response.data;
//     }
// );

// export const saveLtft = createAsyncThunk(
//     "ltft/saveLtft",
//     async (ltft: LtftType) => {
//         const formsService = new FormsService();
//         return formsService.saveLtft(ltft);
//     }
// );

// export const updateLtft = createAsyncThunk(
//     "ltft/updateLtft",
//     async (ltft: LtftType) => {
//         const formsService = new FormsService();
//         return formsService.updateLtft(ltft);
//     }
// );

// export const deleteLtft = createAsyncThunk(
//     "ltft/deleteLtft",
//     async (id: string) => {
//         const formsService = new FormsService();
//         return formsService.deleteLtft(id);
//     }
// );

const ltftSlice = createSlice({
  name: "ltft",
  initialState,
  reducers: {
    updatedLtftData(state, action: PayloadAction<LtftType>) {
      return { ...state, ltftApplicationData: action.payload };
    }
  },
  extraReducers: (builder): void => {
    //TODO add cases for the async thunks
  }
});

export default ltftSlice.reducer;

export const { updatedLtftData } = ltftSlice.actions;
