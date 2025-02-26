import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CctCalculation } from "./cctSlice";
import { ProfileSType } from "../../utilities/ProfileUtilities";
import {
  mapLtftDtoToObj,
  mapLtftObjToDto
} from "../../utilities/ltftUtilities";
import { FormsService } from "../../services/FormsService";
import { SaveStatusProps } from "../../components/forms/AutosaveMessage";
import { DateUtilities } from "../../utilities/DateUtilities";
import { toastErrText, toastSuccessText } from "../../utilities/Constants";
import { showToast, ToastType } from "../../components/common/ToastMessage";

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
  changeId: string;
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
  designatedBodyCode: string;
};

type HistoryType = {
  status: LtftFormStatus;
  timestamp: string;
};

export type StatusType = {
  current: LtftFormStatus;
  history: HistoryType[] | null;
};

export type StatusInfo = {
  state: LtftFormStatus;
  detail: string;
  modifiedBy: LtftDiscussion;
  timestamp: string;
  revision: number;
};

export type LtftObj = {
  traineeTisId?: string;
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
  saveStatus: SaveStatusProps;
  newFormId: string | undefined;
  saveLatestTimeStamp: string;
};

const initialState: LtftState = {
  formData: {} as LtftObj,
  LtftCctSnapshot: {} as CctCalculation,
  status: "idle",
  error: "",
  canEdit: false,
  editPageNumber: 0,
  saveStatus: "idle",
  newFormId: undefined,
  saveLatestTimeStamp: "none this session"
};

export const saveLtft = createAsyncThunk(
  "ltft/saveLtft",
  async (
    {
      formData,
      isAutoSave,
      isSubmit
    }: {
      formData: LtftObj;
      isAutoSave: boolean;
      isSubmit: boolean;
    },
    { rejectWithValue }
  ) => {
    const formsService = new FormsService();
    try {
      const mappedFormDataDto = mapLtftObjToDto(formData);
      const response = await formsService.saveLtft(mappedFormDataDto);
      const mappedResLtftObj = mapLtftDtoToObj(response.data);
      return { data: mappedResLtftObj, isAutoSave, isSubmit };
    } catch (error) {
      return rejectWithValue({ error, isAutoSave, isSubmit });
    }
  }
);

export const updateLtft = createAsyncThunk(
  "ltft/updateLtft",
  async (
    {
      formData,
      isAutoSave,
      isSubmit
    }: {
      formData: LtftObj;
      isAutoSave: boolean;
      isSubmit: boolean;
    },
    { rejectWithValue }
  ) => {
    const formsService = new FormsService();
    try {
      const mappedFormDataDto = mapLtftObjToDto(formData);
      const response = await formsService.updateLtft(mappedFormDataDto);
      const mappedResLtftObj = mapLtftDtoToObj(response.data);
      return { data: mappedResLtftObj, isAutoSave, isSubmit };
    } catch (error) {
      return rejectWithValue({ error, isAutoSave, isSubmit });
    }
  }
);

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
  },
  extraReducers(builder): void {
    builder
      .addCase(
        saveLtft.pending,
        (
          state,
          {
            meta: {
              arg: { isAutoSave }
            }
          }
        ) => {
          if (isAutoSave) state.saveStatus = "saving";
        }
      )
      .addCase(
        saveLtft.fulfilled,
        (state, { payload: { data, isAutoSave, isSubmit } }) => {
          state.saveStatus = "succeeded";
          state.formData = data;
          state.newFormId = data.id;
          if (isAutoSave)
            state.saveLatestTimeStamp = DateUtilities.ConvertToLondonTime(
              data.lastModified,
              true
            );
          if (isSubmit) {
            showToast(toastSuccessText.submitLtft, ToastType.SUCCESS);
          }
          if (!isAutoSave && !isSubmit) {
            showToast(toastSuccessText.saveLtft, ToastType.SUCCESS);
          }
        }
      )
      .addCase(saveLtft.rejected, (state, action) => {
        const { error, isAutoSave, isSubmit } = action.payload as {
          error: any;
          isAutoSave: boolean;
          isSubmit: boolean;
        };
        state.saveStatus = "failed";
        state.error = error.message;
        if (isSubmit) {
          showToast(
            toastErrText.submitLtft,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
        if (!isAutoSave && !isSubmit) {
          showToast(
            toastErrText.saveLtft,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
      })
      .addCase(
        updateLtft.pending,
        (
          state,
          {
            meta: {
              arg: { isAutoSave }
            }
          }
        ) => {
          if (isAutoSave) state.saveStatus = "saving";
        }
      )
      .addCase(
        updateLtft.fulfilled,
        (state, { payload: { data, isAutoSave, isSubmit } }) => {
          state.saveStatus = "succeeded";
          state.formData = data;
          state.newFormId = data.id;
          if (isAutoSave)
            state.saveLatestTimeStamp = DateUtilities.ConvertToLondonTime(
              data.lastModified,
              true
            );
          if (isSubmit) {
            showToast(toastSuccessText.submitLtft, ToastType.SUCCESS);
          }
          if (!isAutoSave && !isSubmit) {
            showToast(toastSuccessText.updateLtft, ToastType.SUCCESS);
          }
        }
      )
      .addCase(updateLtft.rejected, (state, action) => {
        const { error, isAutoSave, isSubmit } = action.payload as {
          error: any;
          isAutoSave: boolean;
          isSubmit: boolean;
        };
        state.saveStatus = "failed";
        state.error = error.message;
        if (isSubmit) {
          showToast(
            toastErrText.submitLtft,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
        if (!isAutoSave && !isSubmit) {
          showToast(
            toastErrText.updateLtft,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
      });
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
