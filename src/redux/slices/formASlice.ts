import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { FormRPartA } from "../../models/FormRPartA";
import { LifeCycleState } from "../../models/LifeCycleState";
import { FormsService } from "../../services/FormsService";

interface IFormA {
  formAData: FormRPartA;
  status: string;
  error: any;
}

export const initialState: IFormA = {
  formAData: {
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
  },
  status: "idle",
  error: ""
};

export const loadSavedForm = createAsyncThunk(
  "formA/fetchForm",
  async (formId: any) => {
    const formsService = new FormsService();
    const response: AxiosResponse<FormRPartA> =
      await formsService.getTraineeFormRPartAByFormId(formId);
    console.log("returned formrA data: ", response.data);
    return response.data;
  }
);

const formASlice = createSlice({
  name: "formA",
  initialState,
  reducers: {},
  extraReducers(builder) {
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
      });
  }
});

export default formASlice.reducer;

export const selectSavedForm = (state: { formA: IFormA }) =>
  state.formA.formAData;
