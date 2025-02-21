import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CctCalculation } from "./cctSlice";
import { ProfileSType } from "../../utilities/ProfileUtilities";

export type LtftFormStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNSUBMITTED"
  | "WITHDRAWN"
  | "APPROVED"
  | "REJECTED";

export type LtftCctChange = {
  calculationId: string;
  cctDate: Date | string;
  type: string;
  startDate: Date | string;
  wte: number;
};

type LtftDeclarations = {
  discussedWithTpd: boolean | null;
  informationIsCorrect: boolean | null;
  notGuaranteed: boolean | null;
};

type LtftDiscussion = {
  name: string;
  email: string;
  role: string;
};

type LtftPd = {
  id?: string;
  title?: ProfileSType;
  surname: ProfileSType;
  forenames: ProfileSType;
  telephoneNumber: ProfileSType;
  mobileNumber: ProfileSType;
  email: ProfileSType;
  gmcNumber: ProfileSType;
  gdcNumber: ProfileSType;
  publicHealthNumber: ProfileSType;
  skilledWorkerVisaHolder: boolean | null;
};

type LtftPm = {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  wte: number;
};

type HistoryType = {
  status: LtftFormStatus;
  timestamp: string;
};

export type StatusType = {
  current: LtftFormStatus;
  history: HistoryType[] | null;
};

export type LtftObj = {
  id?: string;
  name?: string;
  change: LtftCctChange;
  declarations: LtftDeclarations;
  tpdName: string;
  tpdEmail: string;
  otherDiscussions: LtftDiscussion[] | null;
  personalDetails: LtftPd;
  programmeMembership: LtftPm;
  reasonsSelected: string[] | null;
  reasonsOtherDetail: string | null;
  status: StatusType;
  created?: Date | string;
  lastModified?: Date | string;
};

type LtftState = {
  formData: LtftObj;
  LtftCctSnapshot: CctCalculation;
  status: string;
  error: any;
  canEdit: boolean;
  editPageNumber: number;
};

const initialLtftObj: LtftObj = {
  change: {
    calculationId: "",
    cctDate: "",
    type: "",
    startDate: "",
    wte: 0
  },
  declarations: {
    discussedWithTpd: null,
    informationIsCorrect: null,
    notGuaranteed: null
  },
  tpdName: "",
  tpdEmail: "",
  otherDiscussions: null,
  personalDetails: {
    title: "",
    surname: "",
    forenames: "",
    telephoneNumber: "",
    mobileNumber: "",
    email: "",
    gmcNumber: "",
    gdcNumber: "",
    publicHealthNumber: "",
    skilledWorkerVisaHolder: null
  },
  programmeMembership: {
    id: "",
    name: "",
    startDate: "",
    endDate: "",
    wte: 0
  },
  reasonsSelected: null,
  reasonsOtherDetail: null,
  status: {
    current: "DRAFT",
    history: null
  }
};

const initialState: LtftState = {
  formData: initialLtftObj,
  LtftCctSnapshot: {} as CctCalculation,
  status: "idle",
  error: "",
  canEdit: false,
  editPageNumber: 0
};

const ltftSlice = createSlice({
  name: "ltft",
  initialState,
  reducers: {
    resetToInit() {
      return initialState;
    },
    setLtftCctSnapshot(state, action: PayloadAction<CctCalculation>) {
      state.LtftCctSnapshot = action.payload;
    },
    updatedLtft(state, action: PayloadAction<LtftObj>) {
      state.formData = action.payload;
    },
    updatedCanEditLtft(state, action: PayloadAction<boolean>) {
      state.canEdit = action.payload;
    },
    updatedEditPageNumberLtft(state, action: PayloadAction<number>) {
      state.editPageNumber = action.payload;
    }
  }
});

export const {
  resetToInit,
  setLtftCctSnapshot,
  updatedLtft,
  updatedCanEditLtft,
  updatedEditPageNumberLtft
} = ltftSlice.actions;

export default ltftSlice.reducer;
