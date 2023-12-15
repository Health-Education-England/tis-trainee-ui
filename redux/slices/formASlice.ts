import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  FormRPartA,
  initialFormRABeforeProfileData
} from "../../models/FormRPartA";
import { IFormR } from "../../models/IFormR";
import { FormsService } from "../../services/FormsService";
import { toastErrText, toastSuccessText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";
import { AutosaveStatusProps } from "../../components/forms/AutosaveMessage";
import { DateUtilities } from "../../utilities/DateUtilities";

interface IFormA {
  formAList: IFormR[];
  formAData: FormRPartA;
  status: string;
  error: any;
  editPageNumber: number;
  canEdit: boolean;
  autosaveStatus: AutosaveStatusProps;
  autoSaveLatestTimeStamp: string;
}

export const initialState: IFormA = {
  formAList: [],
  formAData: initialFormRABeforeProfileData,
  status: "idle",
  error: "",
  editPageNumber: 0,
  canEdit: false,
  autosaveStatus: "idle",
  autoSaveLatestTimeStamp: "none this session"
};

export const loadFormAList = createAsyncThunk(
  "formA/fetchFormAList",
  async () => {
    const formsService = new FormsService();
    const response: AxiosResponse<IFormR[]> =
      await formsService.getTraineeFormRPartAList();
    return DateUtilities.genericSort(response.data, "submissionDate", true);
  }
);

export const loadSavedFormA = createAsyncThunk(
  "formA/fetchFormA",
  async (formId: string) => {
    const formsService = new FormsService();
    const response: AxiosResponse<FormRPartA> =
      await formsService.getTraineeFormRPartAByFormId(formId);
    return response.data;
  }
);

export const saveFormA = createAsyncThunk(
  "formA/saveFormA",
  async (form: FormRPartA) => {
    const formsService = new FormsService();
    return formsService.saveTraineeFormRPartA(form);
  }
);

export const updateFormA = createAsyncThunk(
  "formA/updateFormA",
  async (form: FormRPartA) => {
    const formsService = new FormsService();
    return formsService.updateTraineeFormRPartA(form);
  }
);

export const autoSaveFormA = createAsyncThunk(
  "formA/autoSaveFormA",
  async (form: FormRPartA) => {
    const formsService = new FormsService();
    return (await formsService.saveTraineeFormRPartA(form)).data;
  }
);

export const autoUpdateFormA = createAsyncThunk(
  "formA/autoUpdateFormA",
  async (form: FormRPartA) => {
    const formsService = new FormsService();
    return (await formsService.updateTraineeFormRPartA(form)).data;
  }
);

export const deleteFormA = createAsyncThunk(
  "formA/deleteFormA",
  async (formId: string) => {
    const formsService = new FormsService();
    return formsService.deleteTraineeFormRPartA(formId);
  }
);

const formASlice = createSlice({
  name: "formA",
  initialState,
  reducers: {
    resetToInitFormA(state) {
      return { ...initialState, formAList: state.formAList };
    },
    updatedFormA(state, action: PayloadAction<FormRPartA>) {
      return { ...state, formAData: action.payload };
    },
    updatedEditPageNumber(state, action: PayloadAction<number>) {
      return { ...state, editPageNumber: action.payload };
    },
    updatedCanEdit(state, action: PayloadAction<boolean>) {
      return { ...state, canEdit: action.payload };
    },
    updatedAutosaveStatus(state, action: PayloadAction<AutosaveStatusProps>) {
      return { ...state, autosaveStatus: action.payload };
    },
    updatedAutoSaveLatestTimeStamp(state, action: PayloadAction<string>) {
      return { ...state, autoSaveLatestTimeStamp: action.payload };
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(loadFormAList.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(loadFormAList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formAList = action.payload;
      })
      .addCase(loadFormAList.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.fetchForms,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(loadSavedFormA.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(loadSavedFormA.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formAData = action.payload;
      })
      .addCase(loadSavedFormA.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.loadSavedFormA,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(saveFormA.pending, (state, _action) => {
        state.status = "saving";
      })
      .addCase(saveFormA.fulfilled, (state, _action) => {
        state.status = "succeeded";
        showToast(toastSuccessText.saveFormA, ToastType.SUCCESS);
      })
      .addCase(saveFormA.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.saveFormA,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(updateFormA.pending, (state, _action) => {
        state.status = "updating";
      })
      .addCase(updateFormA.fulfilled, (state, _action) => {
        state.status = "succeeded";
        showToast(toastSuccessText.updateFormA, ToastType.SUCCESS);
      })
      .addCase(updateFormA.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.updateFormA,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(autoSaveFormA.pending, state => {
        state.autosaveStatus = "saving";
      })
      .addCase(autoSaveFormA.fulfilled, (state, action) => {
        state.autosaveStatus = "succeeded";
        state.formAData = action.payload;
        state.autoSaveLatestTimeStamp = DateUtilities.ConvertToLondonTime(
          action.payload.lastModifiedDate,
          true
        );
      })
      .addCase(autoSaveFormA.rejected, state => {
        state.autosaveStatus = "failed";
      })
      .addCase(autoUpdateFormA.pending, state => {
        state.autosaveStatus = "saving";
      })
      .addCase(autoUpdateFormA.fulfilled, (state, action) => {
        state.autosaveStatus = "succeeded";
        state.formAData = action.payload;
        state.autoSaveLatestTimeStamp = DateUtilities.ConvertToLondonTime(
          action.payload.lastModifiedDate,
          true
        );
      })
      .addCase(autoUpdateFormA.rejected, state => {
        state.autosaveStatus = "failed";
      })
      .addCase(deleteFormA.pending, (state, _action) => {
        state.status = "deleting";
      })
      .addCase(deleteFormA.fulfilled, (state, _action) => {
        state.status = "succeeded";
        showToast(toastSuccessText.deleteFormA, ToastType.SUCCESS);
      })
      .addCase(deleteFormA.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.deleteFormA,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default formASlice.reducer;

export const {
  resetToInitFormA,
  updatedFormA,
  updatedEditPageNumber,
  updatedCanEdit,
  updatedAutosaveStatus,
  updatedAutoSaveLatestTimeStamp
} = formASlice.actions;

export const selectSavedFormA = (state: { formA: IFormA }) =>
  state.formA.formAData;

export const selectCanEditStatus = (state: { formA: IFormA }) =>
  state.formA.canEdit;
