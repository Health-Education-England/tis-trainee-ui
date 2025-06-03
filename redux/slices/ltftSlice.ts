import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CctCalculation, CctType } from "./cctSlice";
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
import { ReasonMsgObj } from "../../components/common/ActionModal";

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
  type: CctType;
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

type LtftStatusDetails = {
  reason: string;
  message: string;
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
  managingDeanery: string;
};

export type StatusLtft = {
  current: StatusInfo;
  history: StatusInfo[];
};

export type StatusInfo = {
  state: LtftFormStatus;
  detail: LtftStatusDetails;
  modifiedBy: LtftDiscussion;
  timestamp: string;
  revision: number;
};

export type LtftObj = {
  traineeTisId?: string;
  id?: string;
  formRef?: string;
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
  supportingInformation: string | null;
  status: StatusLtft;
  created?: Date | string;
  lastModified?: Date | string;
};

export type LtftState = {
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

export const initialState: LtftState = {
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
      isSubmit,
      showFailToastOnly
    }: {
      formData: LtftObj;
      isAutoSave: boolean;
      isSubmit: boolean;
      showFailToastOnly: boolean;
    },
    { rejectWithValue }
  ) => {
    const formsService = new FormsService();
    try {
      const mappedFormDataDto = mapLtftObjToDto(formData);
      const response = isSubmit
        ? await formsService.submitLtft(mappedFormDataDto)
        : await formsService.saveLtft(mappedFormDataDto);
      const mappedResLtftObj = mapLtftDtoToObj(response.data);
      return {
        data: mappedResLtftObj,
        isAutoSave,
        isSubmit,
        showFailToastOnly
      };
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
      isSubmit,
      showFailToastOnly
    }: {
      formData: LtftObj;
      isAutoSave: boolean;
      isSubmit: boolean;
      showFailToastOnly: boolean;
    },
    { rejectWithValue }
  ) => {
    const formsService = new FormsService();
    try {
      const mappedFormDataDto = mapLtftObjToDto(formData);
      const response = isSubmit
        ? await formsService.submitLtft(mappedFormDataDto)
        : await formsService.updateLtft(mappedFormDataDto);
      const mappedResLtftObj = mapLtftDtoToObj(response.data);
      return {
        data: mappedResLtftObj,
        isAutoSave,
        isSubmit,
        showFailToastOnly
      };
    } catch (error) {
      return rejectWithValue({ error, isAutoSave, isSubmit });
    }
  }
);

export const deleteLtft = createAsyncThunk(
  "ltft/deleteLtft",
  async (formId: string) => {
    const formsService = new FormsService();
    return await formsService.deleteLtft(formId);
  }
);

export const unsubmitLtftForm = createAsyncThunk(
  "ltft/unsubmitLtftForm",
  async ({ id, reasonObj }: { id: string; reasonObj: ReasonMsgObj }) => {
    const formsService = new FormsService();
    return await formsService.unsubmitLtft(id, reasonObj);
  }
);

export const withdrawLtftForm = createAsyncThunk(
  "ltft/withdrawLtftForm",
  async ({ id, reasonObj }: { id: string; reasonObj: ReasonMsgObj }) => {
    const formsService = new FormsService();
    return await formsService.withdrawLtft(id, reasonObj);
  }
);

export const loadSavedLtft = createAsyncThunk(
  "ltft/loadSavedLtft",
  async (id: string) => {
    const formsService = new FormsService();
    const response = await formsService.getLtftFormById(id);
    return mapLtftDtoToObj(response.data);
  }
);

const ltftSlice = createSlice({
  name: "ltft",
  initialState,
  reducers: {
    resetToInitLtft() {
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
    },
    updatedLtftSaveStatus(state, action: PayloadAction<SaveStatusProps>) {
      state.saveStatus = action.payload;
    },
    updatedLtftStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
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
        (
          state,
          { payload: { data, isAutoSave, isSubmit, showFailToastOnly } }
        ) => {
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
          if (!isAutoSave && !isSubmit && !showFailToastOnly) {
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
        (
          state,
          { payload: { data, isAutoSave, isSubmit, showFailToastOnly } }
        ) => {
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
          if (!isAutoSave && !isSubmit && !showFailToastOnly) {
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
      })
      .addCase(deleteLtft.pending, state => {
        state.status = "deleting";
      })
      .addCase(deleteLtft.fulfilled, state => {
        state.status = "succeeded";
        showToast(toastSuccessText.deleteLtft, ToastType.SUCCESS);
      })
      .addCase(deleteLtft.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.deleteLtft,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(unsubmitLtftForm.pending, state => {
        state.status = "unsubmitting";
      })
      .addCase(unsubmitLtftForm.fulfilled, state => {
        state.status = "succeeded";
        showToast(toastSuccessText.unsubmitLtft, ToastType.SUCCESS);
      })
      .addCase(unsubmitLtftForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        showToast(
          toastErrText.unsubmitLtft,
          ToastType.ERROR,
          `${action.error.code}-${action.error.message}`
        );
      })
      .addCase(withdrawLtftForm.pending, state => {
        state.status = "withdrawing";
      })
      .addCase(withdrawLtftForm.fulfilled, state => {
        state.status = "succeeded";
        showToast(toastSuccessText.withdrawLtft, ToastType.SUCCESS);
      })
      .addCase(withdrawLtftForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        showToast(
          toastErrText.withdrawLtft,
          ToastType.ERROR,
          `${action.error.code}-${action.error.message}`
        );
      })
      .addCase(loadSavedLtft.pending, state => {
        state.status = "loading";
      })
      .addCase(loadSavedLtft.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.editPageNumber = 0;
        state.canEdit = false;
        state.formData = action.payload;
      })
      .addCase(loadSavedLtft.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        showToast(
          toastErrText.loadLtft,
          ToastType.ERROR,
          `${action.error.code}-${action.error.message}`
        );
      });
  }
});

export const {
  resetToInitLtft,
  setLtftCctSnapshot,
  updatedLtft,
  updatedCanEditLtft,
  updatedEditPageNumberLtft,
  updatedLtftSaveStatus,
  updatedLtftStatus
} = ltftSlice.actions;

export default ltftSlice.reducer;
