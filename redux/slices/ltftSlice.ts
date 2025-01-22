import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CctCalculation } from "./cctSlice";

type LtftState = {
  ltftForm: null;
  LtftCctSnapshot: CctCalculation | null;
  status: string;
  error: any;
};

const initialState: LtftState = {
  ltftForm: null,
  LtftCctSnapshot: null,
  status: "idle",
  error: null
};

const ltftSlice = createSlice({
  name: "ltft",
  initialState,
  reducers: {
    setLtftCctSnapshot(state, action: PayloadAction<CctCalculation>) {
      state.LtftCctSnapshot = action.payload;
    }
  }
});

export const { setLtftCctSnapshot } = ltftSlice.actions;

export default ltftSlice.reducer;
