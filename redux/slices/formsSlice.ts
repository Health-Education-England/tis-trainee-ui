import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { IFormR } from "../../models/IFormR";
import { LifeCycleState } from "../../models/LifeCycleState";
import { FormsService } from "../../services/FormsService";
import { DateUtilities } from "../../utilities/DateUtilities";
import { toastErrText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";
import {
  DraftFormProps,
  setDraftFormRProps
} from "../../utilities/FormBuilderUtilities";

interface IForms {
  forms: IFormR[];
  submittedForms: IFormR[];
  status: string;
  error: any;
  draftFormProps: DraftFormProps | null;
  formsRefreshNeeded?: boolean;
}

export const initialState: IForms = {
  forms: [],
  submittedForms: [],
  status: "idle",
  error: "",
  draftFormProps: null,
  formsRefreshNeeded: false
};

export const fetchForms = createAsyncThunk(
  "forms/fetchForms",
  async (path: string) => {
    const formsService = new FormsService();
    let response: AxiosResponse<IFormR[]>;
    if (path === "/formr-a") {
      response = await formsService.getTraineeFormRPartAList();
    } else {
      response = await formsService.getTraineeFormRPartBList();
    }
    return DateUtilities.genericSort(response.data, "submissionDate", true);
  }
);

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    updatedDraftFormProps: (
      state,
      action: PayloadAction<DraftFormProps | null>
    ) => {
      return { ...state, draftFormProps: action.payload };
    },
    updatedFormsRefreshNeeded: (state, action: PayloadAction<boolean>) => {
      return { ...state, formsRefreshNeeded: action.payload };
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchForms.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.forms = action.payload;
        state.submittedForms = action.payload.filter(
          (form: IFormR) => form.lifecycleState === LifeCycleState.Submitted
        );
        state.draftFormProps = setDraftFormRProps(action.payload);
      })
      .addCase(fetchForms.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.fetchForms,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default formsSlice.reducer;

export const { updatedDraftFormProps, updatedFormsRefreshNeeded } =
  formsSlice.actions;

export const selectAllforms = (state: { forms: IForms }) => state.forms.forms;
export const selectAllSubmittedforms = (state: { forms: IForms }) =>
  state.forms?.submittedForms;
