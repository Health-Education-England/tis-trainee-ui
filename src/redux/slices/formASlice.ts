import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { FormRPartA } from "../../models/FormRPartA";
import { LifeCycleState } from "../../models/LifeCycleState";
import { FormsService } from "../../services/FormsService";
import { PayloadAction } from "@reduxjs/toolkit";

interface IFormA {
  formAData: FormRPartA;
  status: string;
  error: any;
}

export const initialFormState: FormRPartA = {
  forename: "",
  surname: "",
  gmcNumber: "",
  localOfficeName: "",
  dateOfBirth: null,
  gender: "",
  immigrationStatus: "",
  qualification: "",
  dateAttained: null,
  medicalSchool: "",
  address1: "",
  address2: "",
  address3: "",
  address4: "",
  postCode: "",
  telephoneNumber: "",
  mobileNumber: "",
  email: "",
  isLeadingToCct: false,
  programmeSpecialty: "",
  cctSpecialty1: "",
  cctSpecialty2: "",
  college: "",
  completionDate: null,
  trainingGrade: "",
  startDate: null,
  programmeMembershipType: "",
  wholeTimeEquivalent: undefined,
  declarationType: "",
  otherImmigrationStatus: "",
  traineeTisId: "",
  lifecycleState: LifeCycleState.New,
  submissionDate: null,
  lastModifiedDate: null
};

export const initialState: IFormA = {
  formAData: initialFormState,
  status: "idle",
  error: ""
};

export const loadSavedForm = createAsyncThunk(
  "formA/fetchForm",
  async (formId: string) => {
    const formsService = new FormsService();
    const response: AxiosResponse<FormRPartA> =
      await formsService.getTraineeFormRPartAByFormId(formId);
    return response.data;
  }
);

export const saveForm = createAsyncThunk(
  "formA/saveForm",
  async (form: FormRPartA) => {
    const formsService = new FormsService();
    return await formsService.saveTraineeFormRPartA(form);
  }
);

export const updateForm = createAsyncThunk(
  "formA/updateForm",
  async (form: FormRPartA) => {
    const formsService = new FormsService();
    return await formsService.updateTraineeFormRPartA(form);
  }
);

const formASlice = createSlice({
  name: "formA",
  initialState,
  reducers: {
    resetToInit() {
      return initialState;
    },
    updatedFormA(state, action: PayloadAction<FormRPartA>) {
      return { ...state, formAData: action.payload };
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(loadSavedForm.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(loadSavedForm.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formAData = action.payload;
      })
      .addCase(loadSavedForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveForm.pending, (state, _action) => {
        state.status = "saving";
      })
      .addCase(saveForm.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(saveForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateForm.pending, (state, _action) => {
        state.status = "updating";
      })
      .addCase(updateForm.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default formASlice.reducer;

export const { resetToInit, updatedFormA } = formASlice.actions;

export const selectSavedForm = (state: { formA: IFormA }) =>
  state.formA.formAData;
