import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewEndDatesTypes } from "../../utilities/CctUtilities";

type CctCalcState = {
  modalOpen: boolean;
  progName: string;
  currentProgEndDate: string;
  currentWte: number | null;
  newEndDates: NewEndDatesTypes[];
  propStartDate: string;
  propEndDate: string;
  dialogYPosition: number;
};

const initialState: CctCalcState = {
  modalOpen: false,
  progName: "",
  currentProgEndDate: "",
  currentWte: null,
  newEndDates: [],
  propStartDate: "",
  propEndDate: "",
  dialogYPosition: 0
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
    setCurrentWte(state, action: PayloadAction<number>) {
      return { ...state, currentWte: action.payload };
    },
    setPropStartDate(state, action: PayloadAction<string>) {
      return { ...state, propStartDate: action.payload };
    },
    setPropEndDate(state, action: PayloadAction<string>) {
      return { ...state, propEndDate: action.payload };
    },
    setNewEndDates(state, action: PayloadAction<NewEndDatesTypes[]>) {
      return { ...state, newEndDates: action.payload };
    },
    setDialogYPosition(state, action: PayloadAction<number>) {
      return { ...state, dialogYPosition: action.payload };
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
  setCurrentWte,
  setPropStartDate,
  setPropEndDate,
  setNewEndDates,
  setDialogYPosition,
  resetCctCalc
} = cctCalcSlice.actions;
