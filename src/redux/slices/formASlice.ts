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
  lifecycleState: LifeCycleState.New,
  submissionDate: null,
  lastModifiedDate: null
};

export const initialState: IFormA = {
  formAData: initialFormState,
  status: "idle",
  error: ""
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
    return await formsService.saveTraineeFormRPartA(form);
  }
);

export const updateFormA = createAsyncThunk(
  "formA/updateFormA",
  async (form: FormRPartA) => {
    const formsService = new FormsService();
    return await formsService.updateTraineeFormRPartA(form);
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
      .addCase(loadSavedFormA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveFormA.pending, (state, _action) => {
        state.status = "saving";
      })
      .addCase(saveFormA.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(saveFormA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateFormA.pending, (state, _action) => {
        state.status = "updating";
      })
      .addCase(updateFormA.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(updateFormA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default formASlice.reducer;

export const { resetToInitFormA, updatedFormA } = formASlice.actions;

export const selectSavedFormA = (state: { formA: IFormA }) =>
  state.formA.formAData;
