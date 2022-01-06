import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { FormRPartB } from "../../models/FormRPartB";
import { LifeCycleState } from "../../models/LifeCycleState";
import { FormsService } from "../../services/FormsService";
import { PayloadAction } from "@reduxjs/toolkit";

interface IFormB {
  formBData: FormRPartB;
  status: string;
  error: any;
}

export const initialFormState: FormRPartB = {
  forename: "",
  surname: "",
  gmcNumber: "",
  email: "",
  localOfficeName: "",
  prevRevalBody: "",
  prevRevalBodyOther: "",
  currRevalDate: null,
  prevRevalDate: null,
  programmeSpecialty: "",
  dualSpecialty: "",
  work: [],
  sicknessAbsence: 0,
  parentalLeave: 0,
  careerBreaks: 0,
  paidLeave: 0,
  unauthorisedLeave: 0,
  otherLeave: 0,
  totalLeave: 0,
  isHonest: "",
  isHealthy: "",
  isWarned: "",
  isComplying: "",
  healthStatement: "",
  havePreviousDeclarations: "",
  previousDeclarations: [],
  previousDeclarationSummary: "",
  haveCurrentDeclarations: "",
  currentDeclarations: [],
  currentDeclarationSummary: "",
  compliments: "",
  haveCovidDeclarations: "",
  covidDeclarationDto: null,
  lifecycleState: LifeCycleState.New,
  submissionDate: "",
  lastModifiedDate: "",
  isDeclarationAccepted: false,
  isConsentAccepted: false
};

export const initialState: IFormB = {
  formBData: initialFormState,
  status: "idle",
  error: ""
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
    return await formsService.saveTraineeFormRPartB(form);
  }
);

export const updateFormB = createAsyncThunk(
  "formB/updateForm",
  async (form: FormRPartB) => {
    const formsService = new FormsService();
    return await formsService.updateTraineeFormRPartB(form);
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
      .addCase(loadSavedFormB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveFormB.pending, (state, _action) => {
        state.status = "saving";
      })
      .addCase(saveFormB.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(saveFormB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateFormB.pending, (state, _action) => {
        state.status = "updating";
      })
      .addCase(updateFormB.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(updateFormB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default formBSlice.reducer;

export const { resetToInitFormB, updatedFormB } = formBSlice.actions;

export const selectSavedFormB = (state: { formB: IFormB }) =>
  state.formB.formBData;
