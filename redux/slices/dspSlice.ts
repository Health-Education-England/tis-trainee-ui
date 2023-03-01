import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileType } from "../../models/TraineeProfile";

interface IDsp {
  dspPanelObj: ProfileType | null;
}
// todo
// thunk to issue cred

export const initialState: IDsp = {
  dspPanelObj: null
};

const dspSlice = createSlice({
  name: "dsp",
  initialState,
  reducers: {
    updatedDspPanelObj(state, action: PayloadAction<ProfileType>) {
      return { ...state, dspPanelObj: action.payload };
    }
  }
});

export default dspSlice.reducer;

export const { updatedDspPanelObj } = dspSlice.actions;
