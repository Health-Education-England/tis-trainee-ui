import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewEndDatesTypes } from "../../utilities/CctUtilities";

type CctCalcState = {
  modalOpen: boolean;
  progName: string;
  currentProgEndDate: string;
  newEndDates: NewEndDatesTypes[];
  propStartDate: string;
};

const initialState: CctCalcState = {
  modalOpen: false,
  progName: "",
  currentProgEndDate: "",
  newEndDates: [],
  propStartDate: ""
};

const cctCalcSlice = createSlice({
  name: "cctCalc",
  initialState,
  reducers: {
    openCctModal(state) {
      return { ...state, modalOpen: true };
    },
    setProgName(state, action: PayloadAction<string>) {
      return { ...state, progName: action.payload };
    },
    setCurrentProgEndDate(state, action: PayloadAction<string>) {
      return { ...state, currentProgEndDate: action.payload };
    },
    setPropStartDate(state, action: PayloadAction<string>) {
      return { ...state, propStartDate: action.payload };
    },
    setNewEndDates(state, action: PayloadAction<NewEndDatesTypes[]>) {
      return { ...state, newEndDates: action.payload };
    },
    resetCctCalc() {
      return initialState;
    }
  }
});

export default cctCalcSlice.reducer;

export const {
  openCctModal,
  setProgName,
  setCurrentProgEndDate,
  setPropStartDate,
  setNewEndDates,
  resetCctCalc
} = cctCalcSlice.actions;
