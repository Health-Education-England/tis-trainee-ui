import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CctCalcState = {
  modalOpen: boolean;
  progName: string;
  currentProgEndDate: Date | string;
  newEndDates: any[];
};

const initialState: CctCalcState = {
  modalOpen: false,
  progName: "",
  currentProgEndDate: "",
  newEndDates: []
};

const cctCalcSlice = createSlice({
  name: "cctCalc",
  initialState,
  reducers: {
    openCctModal(state) {
      return { ...state, modalOpen: true };
    },
    closeCctModal(state) {
      return {
        ...state,
        modalOpen: false
      };
    },
    setProgName(state, action: PayloadAction<string>) {
      return { ...state, progName: action.payload };
    },
    setCurrentProgEndDate(state, action: PayloadAction<Date | string>) {
      return { ...state, currentProgEndDate: action.payload };
    },
    setNewEndDates(state, action: PayloadAction<any[]>) {
      return { ...state, newEndDates: action.payload };
    }
  }
});

export default cctCalcSlice.reducer;

export const {
  openCctModal,
  closeCctModal,
  setProgName,
  setCurrentProgEndDate,
  setNewEndDates
} = cctCalcSlice.actions;
