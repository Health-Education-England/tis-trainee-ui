import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

type CctCalcState = {
  modalOpen: boolean;
  progName: string;
  currentProgEndDate: Date | string;
  newEndDates: any[];
  propStartDate: Date | string;
};

const initialState: CctCalcState = {
  modalOpen: false,
  progName: "",
  currentProgEndDate: "",
  newEndDates: [],
  propStartDate: dayjs().add(16, "weeks").format("YYYY-MM-DD")
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
    setCurrentProgEndDate(state, action: PayloadAction<Date | string>) {
      return { ...state, currentProgEndDate: action.payload };
    },
    setNewEndDates(state, action: PayloadAction<any[]>) {
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
  setNewEndDates,
  resetCctCalc
} = cctCalcSlice.actions;
