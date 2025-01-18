import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CctCalculation } from "./cctSlice";
import { ProfileSType } from "../../utilities/ProfileUtilities";

type LtftFormStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNSUBMITTED"
  | "WITHDRAWN"
  | "APPROVED"
  | "REJECTED";

type LtftCctChange = {
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
  forename: ProfileSType;
  telephoneNumber: ProfileSType;
  mobileNumber: ProfileSType;
  email: ProfileSType;
  gmcNumber: ProfileSType;
  skilledWorkerVisaHolder: boolean | null;
};

type LtftPm = {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  wte: number;
};

export type LtftObj = {
  id?: string;
  name?: string;
  change: LtftCctChange;
  declarations: LtftDeclarations;
  discussions: LtftDiscussion[] | null;
  personalDetails: LtftPd;
  programmeMembership: LtftPm;
  reasons: string[] | null;
  status: {
    current: LtftFormStatus;
    history:
      | {
          status: LtftFormStatus;
          timestamp: string;
        }[]
      | null;
  };
  created?: Date | string;
  lastModified?: Date | string;
};

type LtftState = {
  formData: LtftObj;
  LtftCctSnapshot: CctCalculation | null;
  status: string;
  error: any;
  canEdit: boolean;
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
  discussions: null,
  personalDetails: {
    title: "",
    surname: "",
    forename: "",
    telephoneNumber: "",
    mobileNumber: "",
    email: "",
    gmcNumber: "",
    skilledWorkerVisaHolder: null
  },
  programmeMembership: {
    id: "",
    name: "",
    startDate: "",
    endDate: "",
    wte: 0
  },
  reasons: null,
  status: {
    current: "DRAFT",
    history: null
  }
};

const initialState: LtftState = {
  formData: initialLtftObj,
  LtftCctSnapshot: null,
  status: "idle",
  error: "",
  canEdit: false
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
    }
  }
});

export const { resetToInit, setLtftCctSnapshot, updatedLtft } =
  ltftSlice.actions;

export default ltftSlice.reducer;
