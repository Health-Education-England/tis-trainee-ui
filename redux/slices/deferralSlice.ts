import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SaveStatusProps } from "../../components/forms/AutosaveMessage";
import { DateUtilities } from "../../utilities/DateUtilities";
import { showToast, ToastType } from "../../components/common/ToastMessage";
import { DeferralObj, DeferralState } from "../../models/DeferralTypes";

export const initialState: DeferralState = {
  formData: {} as DeferralObj,
  status: "idle",
  error: "",
  canEdit: false,
  editPageNumber: 0,
  saveStatus: "idle",
  newFormId: undefined,
  saveLatestTimeStamp: "none this session"
};

// ---------------------------------------------------------------------------
// POC NOTE: There is no Deferral backend yet, so saving/submitting is stubbed
// locally. `stampDeferral` mimics what a server would return (id, timestamps,
// status transition). Swap these thunks for real FormsService calls + DTO
// mapping (see ltftSlice / FormsService) once the API exists.
// ---------------------------------------------------------------------------
const stampDeferral = (
  formData: DeferralObj,
  isSubmit: boolean
): DeferralObj => {
  const id = formData.id ?? `local-deferral-${Date.now()}`;
  const now = new Date().toISOString();
  const currentState = isSubmit
    ? "SUBMITTED"
    : formData.status?.current?.state ?? "DRAFT";
  return {
    ...formData,
    id,
    created: formData.created ?? now,
    lastModified: now,
    status: {
      current: {
        state: currentState,
        detail: formData.status?.current?.detail ?? { reason: "", message: "" },
        modifiedBy: formData.status?.current?.modifiedBy ?? {
          name: "",
          email: "",
          role: ""
        },
        timestamp: now,
        revision: (formData.status?.current?.revision ?? 0) + (isSubmit ? 1 : 0)
      },
      history: formData.status?.history ?? []
    }
  };
};

type SaveDeferralArgs = {
  formData: DeferralObj;
  isAutoSave: boolean;
  isSubmit: boolean;
  showFailToastOnly: boolean;
};

export const saveDeferral = createAsyncThunk(
  "deferral/saveDeferral",
  async (
    { formData, isAutoSave, isSubmit, showFailToastOnly }: SaveDeferralArgs,
    { rejectWithValue }
  ) => {
    try {
      const data = stampDeferral(formData, isSubmit);
      return { data, isAutoSave, isSubmit, showFailToastOnly };
    } catch (error) {
      return rejectWithValue({ error, isAutoSave, isSubmit });
    }
  }
);

export const updateDeferral = createAsyncThunk(
  "deferral/updateDeferral",
  async (
    { formData, isAutoSave, isSubmit, showFailToastOnly }: SaveDeferralArgs,
    { rejectWithValue }
  ) => {
    try {
      const data = stampDeferral(formData, isSubmit);
      return { data, isAutoSave, isSubmit, showFailToastOnly };
    } catch (error) {
      return rejectWithValue({ error, isAutoSave, isSubmit });
    }
  }
);

export const deleteDeferral = createAsyncThunk(
  "deferral/deleteDeferral",
  async (_formId: string) => {
    // POC stub: nothing to delete on a server yet.
    return true;
  }
);

const deferralSlice = createSlice({
  name: "deferral",
  initialState,
  reducers: {
    resetToInitDeferral() {
      return initialState;
    },
    updatedDeferral(state, action: PayloadAction<DeferralObj>) {
      state.formData = action.payload;
    },
    updatedCanEditDeferral(state, action: PayloadAction<boolean>) {
      state.canEdit = action.payload;
    },
    updatedEditPageNumberDeferral(state, action: PayloadAction<number>) {
      state.editPageNumber = action.payload;
    },
    updatedDeferralSaveStatus(state, action: PayloadAction<SaveStatusProps>) {
      state.saveStatus = action.payload;
    },
    updatedDeferralStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    }
  },
  extraReducers(builder): void {
    const handleSaveFulfilled = (
      state: DeferralState,
      {
        payload: { data, isAutoSave, isSubmit, showFailToastOnly }
      }: {
        payload: {
          data: DeferralObj;
          isAutoSave: boolean;
          isSubmit: boolean;
          showFailToastOnly: boolean;
        };
      }
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
        showToast("Deferral application submitted", ToastType.SUCCESS);
      } else if (!isAutoSave && !showFailToastOnly) {
        showToast("Deferral application saved", ToastType.SUCCESS);
      }
    };

    builder
      .addCase(saveDeferral.pending, (state, { meta: { arg } }) => {
        if (arg.isAutoSave) state.saveStatus = "saving";
      })
      .addCase(saveDeferral.fulfilled, handleSaveFulfilled)
      .addCase(saveDeferral.rejected, (state, action) => {
        const { error } = (action.payload as { error: any }) ?? {};
        state.saveStatus = "failed";
        state.error = error?.message;
        showToast("There was a problem saving your deferral", ToastType.ERROR);
      })
      .addCase(updateDeferral.pending, (state, { meta: { arg } }) => {
        if (arg.isAutoSave) state.saveStatus = "saving";
      })
      .addCase(updateDeferral.fulfilled, handleSaveFulfilled)
      .addCase(updateDeferral.rejected, (state, action) => {
        const { error } = (action.payload as { error: any }) ?? {};
        state.saveStatus = "failed";
        state.error = error?.message;
        showToast("There was a problem saving your deferral", ToastType.ERROR);
      })
      .addCase(deleteDeferral.pending, state => {
        state.status = "deleting";
      })
      .addCase(deleteDeferral.fulfilled, state => {
        state.status = "succeeded";
      })
      .addCase(deleteDeferral.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
      });
  }
});

export const {
  resetToInitDeferral,
  updatedDeferral,
  updatedCanEditDeferral,
  updatedEditPageNumberDeferral,
  updatedDeferralSaveStatus,
  updatedDeferralStatus
} = deferralSlice.actions;

export default deferralSlice.reducer;
