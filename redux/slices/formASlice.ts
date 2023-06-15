import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  FormRPartA,
  initialFormRABeforeProfileData
} from "../../models/FormRPartA";
import { FormsService } from "../../services/FormsService";
import { toastErrText, toastSuccessText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";

interface IFormA {
  formAData: FormRPartA;
  status: string;
  error: any;
  editPageNumber: number;
  canEdit: boolean;
}

export const initialState: IFormA = {
  formAData: initialFormRABeforeProfileData,
  status: "idle",
  error: "",
  editPageNumber: 0,
  canEdit: false
};

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

const formASlice = createSlice({
  name: "formA",
  initialState,
  reducers: {
    resetToInitFormA() {
      return initialState;
    },
    updatedFormA(state, action: PayloadAction<FormRPartA>) {
      return { ...state, formAData: action.payload };
    },
    updatedEditPageNumber(state, action: PayloadAction<number>) {
      return { ...state, editPageNumber: action.payload };
    },
    updatedCanEdit(state, action: PayloadAction<boolean>) {
      return { ...state, canEdit: action.payload };
    }
  },
  extraReducers(builder): void {
    builder
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
      });
  }
});

export default formASlice.reducer;

export const {
  resetToInitFormA,
  updatedFormA,
  updatedEditPageNumber,
  updatedCanEdit
} = formASlice.actions;

export const selectSavedFormA = (state: { formA: IFormA }) =>
  state.formA.formAData;

export const selectCanEditStatus = (state: { formA: IFormA }) =>
  state.formA.canEdit;
