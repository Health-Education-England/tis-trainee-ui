import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  FormRPartB,
  initialFormRBBeforeProfileData
} from "../../models/FormRPartB";
import { FormsService } from "../../services/FormsService";
import { toast } from "react-toastify";
import { toastErrText, toastSuccessText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";
interface IFormB {
  formBData: FormRPartB;
  sectionNumber: number;
  previousSectionNumber: number | null;
  status: string;
  error: any;
  saveBtnActive: boolean;
  editPageNumber: number;
  canEdit: boolean;
}

export const initialState: IFormB = {
  formBData: initialFormRBBeforeProfileData,
  sectionNumber: 1,
  previousSectionNumber: null,
  status: "idle",
  error: "",
  saveBtnActive: false,
  editPageNumber: 0,
  canEdit: false
};

export const loadSavedFormB = createAsyncThunk(
  "formB/fetchFormB",
  async (formId: string) => {
    const formsService = new FormsService();
    const response: AxiosResponse<FormRPartB> =
      await formsService.getTraineeFormRPartBByFormId(formId);
    return response.data;
  }
);

export const saveFormB = createAsyncThunk(
  "formB/saveFormB",
  async (form: FormRPartB) => {
    const formsService = new FormsService();
    return formsService.saveTraineeFormRPartB(form);
  }
);

export const updateFormB = createAsyncThunk(
  "formB/updateFormB",
  async (form: FormRPartB) => {
    const formsService = new FormsService();
    return formsService.updateTraineeFormRPartB(form);
  }
);

const formBSlice = createSlice({
  name: "formB",
  initialState,
  reducers: {
    resetToInitFormB() {
      return initialState;
    },
    updatedFormB(state, action: PayloadAction<FormRPartB>) {
      return { ...state, formBData: action.payload };
    },
    decrementFormBSection: state => {
      state.sectionNumber -= 1;
    },
    incrementFormBSection: state => {
      state.sectionNumber += 1;
    },
    updateFormBSection(state, action: PayloadAction<number>) {
      return { ...state, sectionNumber: action.payload };
    },
    updateFormBPreviousSection(state, action: PayloadAction<number | null>) {
      return { ...state, previousSectionNumber: action.payload };
    },
    updatesaveBtnActive: state => {
      state.saveBtnActive = !state.saveBtnActive;
    },
    updatedEditPageNumberB(state, action: PayloadAction<number>) {
      return { ...state, editPageNumber: action.payload };
    },
    updatedCanEditB(state, action: PayloadAction<boolean>) {
      return { ...state, canEdit: action.payload };
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(loadSavedFormB.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(loadSavedFormB.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formBData = action.payload;
      })
      .addCase(loadSavedFormB.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.loadSavedFormB,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(saveFormB.pending, (state, _action) => {
        state.status = "saving";
      })
      .addCase(saveFormB.fulfilled, (state, _action) => {
        state.status = "succeeded";
        showToast(toastSuccessText.saveFormB, ToastType.SUCCESS);
      })
      .addCase(saveFormB.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.saveFormB,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(updateFormB.pending, (state, _action) => {
        state.status = "updating";
      })
      .addCase(updateFormB.fulfilled, (state, _action) => {
        state.status = "succeeded";
        showToast(toastSuccessText.updateFormB, ToastType.SUCCESS);
      })
      .addCase(updateFormB.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.updateFormB,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default formBSlice.reducer;

export const {
  resetToInitFormB,
  updatedFormB,
  decrementFormBSection,
  incrementFormBSection,
  updateFormBSection,
  updateFormBPreviousSection,
  updatesaveBtnActive,
  updatedEditPageNumberB,
  updatedCanEditB
} = formBSlice.actions;

export const selectSavedFormB = (state: { formB: IFormB }) =>
  state.formB.formBData;

export const selectSaveBtnActive = (state: { formB: IFormB }) =>
  state.formB.saveBtnActive;
