import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type GmcEditState = {
  modalOpen: boolean;
  currentGmcNumber: string;
  dialogYPosition: number;
};

const initialState: GmcEditState = {
  modalOpen: false,
  currentGmcNumber: "xxx",
  dialogYPosition: 0
};

const gmcEditSlice = createSlice({
  name: "gmcEdit",
  initialState,
  reducers: {
    openGmcModal(state) {
      return { ...state, modalOpen: true };
    },
    setCurrentGmcNumber(state, action: PayloadAction<string>) {
      return { ...state, currentGmcNumber: action.payload };
    },
    setDialogYPosition(state, action: PayloadAction<number>) {
      return { ...state, dialogYPosition: action.payload };
    },
    resetGmcEdit() {
      return initialState;
    }
  }
});

export default gmcEditSlice.reducer;

export const {
  openGmcModal,
  setCurrentGmcNumber,
  setDialogYPosition,
  resetGmcEdit
} = gmcEditSlice.actions;
